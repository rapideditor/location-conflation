import * as CountryCoder from '@ideditor/country-coder';

import calcArea from '@mapbox/geojson-area';
import circleToPolygon  from 'circle-to-polygon';
import precision  from 'geojson-precision';
import prettyStringify from '@aitodotai/json-stringify-pretty-compact';
import difference  from '@turf/difference';
import { default as union } from '@turf/union';



// Reduce an array of locations into a single GeoJSON feature
function _locationReducer(accumulator, location) {
  /* eslint-disable no-console, no-invalid-this */
  let result;
  try {
    let resolved = this.resolveLocation(location);
    if (!resolved || !resolved.feature) {
      console.warn(`Warning:  Couldn't resolve location "${location}"`);
      return accumulator;
    }
    result = !accumulator ? resolved.feature : union(accumulator, resolved.feature);
  } catch (e) {
    console.warn(`Warning:  Error resolving location "${location}"`);
    console.warn(e);
    result = accumulator;
  }

  return result;
  /* eslint-enable no-console, no-invalid-this */
}



function _cloneDeep(obj) {
  return JSON.parse(JSON.stringify(obj));
}


export default class {

  // constructor
  //
  // Optionally pass a GeoJSON FeatureCollection of known features which we can refer to later.
  // Each feature must have a filename-like `id`, for example: `something.geojson`
  //
  // {
  //   "type": "FeatureCollection"
  //   "features": [
  //     {
  //       "type": "Feature",
  //       "id": "philly_metro.geojson",
  //       "properties": { … },
  //       "geometry": { … }
  //     }
  //   ]
  // }
  constructor(fc) {
    this._cache = {};

    // process input FeatureCollection
    if (fc && fc.type === 'FeatureCollection' && Array.isArray(fc.features)) {
      fc.features.forEach(feature => {
        feature.properties = feature.properties || {};
        let props = feature.properties;

        // get `id` from either `id` or `properties`
        let id = feature.id || props.id;
        if (!id || !/^\S+\.geojson$/i.test(id)) return;

        // ensure id exists and is lowercase
        id = id.toLowerCase();
        feature.id = id;
        props.id = id;

        // ensure area property exists
        if (!props.area) {
          const area = calcArea.geometry(feature.geometry) / 1e6;  // m² to km²
          props.area = Number(area.toFixed(2));
        }

        this._cache[id] = feature;
      });
    }

    // Replace CountryCoder world geometry to have a polygon covering the world.
    let world = _cloneDeep(CountryCoder.feature('Q2'));
    world.geometry = {
      type: 'Polygon',
      coordinates: [[[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]]]
    };
    world.id = 'Q2';
    world.properties.id = 'Q2';
    world.properties.area = calcArea.geometry(world.geometry) / 1e6;  // m² to km²
    this._cache.Q2 = world;
  }


  // validateLocation
  //
  // Pass a `location` identifier
  // Returns a result like
  //   {
  //     type:     'point', 'geojson', or 'countrycoder'
  //     location:  the queried location
  //     id:        a unique identifier
  //   }
  //  or `null` if the location is invalid
  //
  validateLocation(location) {
    if (Array.isArray(location)) {   // a [lon,lat] coordinate pair?
      if (location.length === 2 && Number.isFinite(location[0]) && Number.isFinite(location[1]) &&
        location[0] >= -180 && location[0] <= 180 && location[1] >= -90 && location[1] <= 90
      ) {
        const id = '[' + location.toString() + ']';
        return { type: 'point', location: location, id: id };
      }

    } else if (typeof location === 'string' && /^\S+\.geojson$/i.test(location)) {   // a .geojson filename?
      const id = location.toLowerCase();
      if (this._cache[id]) {
        return { type: 'geojson', location: location, id: id };
      }

    } else if (typeof location === 'string' || typeof location === 'number') {   // a country-coder value?
      const feature = CountryCoder.feature(location);
      if (feature) {
        // Use wikidata QID as the identifier, since that seems to be the only
        // property that everything in CountryCoder is guaranteed to have.
        const id = feature.properties.wikidata;
        return { type: 'countrycoder', location: location, id: id };
      }
    }

    return null;
  }


  // resolveLocation
  //
  // Pass a `location` identifier
  // Returns a result like
  //   {
  //     type:      'point', 'geojson', or 'countrycoder'
  //     location:  the queried location
  //     id:        a unique identifier
  //     feature:   the geojson feature
  //   }
  //  or `null` if the location is invalid
  //
  resolveLocation(location) {
    const valid = this.validateLocation(location);
    if (!valid) return null;

    // return a result from cache if we can
    if (this._cache[valid.id]) {
      return Object.assign(valid, { feature: this._cache[valid.id] });
    }

    // a [lon,lat] coordinate pair?
    if (valid.type === 'point') {
      const RADIUS = 25000;  // meters
      const EDGES = 10;
      const PRECISION = 3;
      const area = Math.PI * RADIUS * RADIUS / 1e6;     // m² to km²
      const feature = this._cache[valid.id] = precision({
        type: 'Feature',
        id: valid.id,
        properties: { id: valid.id, area: Number(area.toFixed(2)) },
        geometry: circleToPolygon(location, RADIUS, EDGES)
      }, PRECISION);
      return Object.assign(valid, { feature: feature });

    // a .geojson filename?
    } else if (valid.type === 'geojson') {
      // nothing to do here - these are all in _cache and would have returned already

    // a country-coder identifier?
    } else if (valid.type === 'countrycoder') {
      let feature = _cloneDeep(CountryCoder.feature(valid.id));
      let props = feature.properties;

      // -> This block of code is weird and requires some explanation. <-
      // CountryCoder includes higher level features which are made up of members.
      // These features don't have their own geometry, but CountryCoder provides an
      //   `aggregateFeature` method to combine these members into a MultiPolygon.
      // BUT, when we try to actually work with these aggregated MultiPolygons,
      //   Turf/JSTS gets crashy because of topography bugs.
      // SO, we'll aggregate the features ourselves by unioning them together.
      // This approach also has the benefit of removing all the internal boaders and
      //   simplifying the regional polygons a lot.
      if (Array.isArray(props.members)) {
        let seed = feature.geometry ? feature : null;
        let aggregate = props.members.reduce(_locationReducer.bind(this), seed);
        feature.geometry = aggregate.geometry;
      }

      // ensure area property exists
      if (!props.area) {
        const area = calcArea.geometry(feature.geometry) / 1e6;  // m² to km²
        props.area = Number(area.toFixed(2));
      }

      // ensure id property exists
      feature.id = valid.id;
      props.id = valid.id;

      this._cache[valid.id] = feature;
      return Object.assign(valid, { feature: feature });
    }

    return null;
  }


  // resolveLocationSet
  //
  // Pass a `locationSet` Object like:
  //   `{ include: [ Array ], exclude: [ Array ] }`
  // Returns a stable identifier string of the form:
  //   "+[included]-[excluded]"
  //
  resolveLocationSet(locationSet) {
    locationSet = locationSet || {};
    const resolve = this.resolveLocation.bind(this);
    let include = (locationSet.include || []).map(resolve).filter(Boolean);
    let exclude = (locationSet.exclude || []).map(resolve).filter(Boolean);

    if (!include.length) {
      include = [resolve('Q2')];   // default to 'the world'
    }

    // return quickly if it's a single included location..
    if (include.length === 1 && exclude.length === 0) {
      return include[0].feature;
    }

    // generate stable identifier
    include.sort(sortFeatures);
    let id = '+[' + include.map(d => d.id).join(',') + ']';
    if (exclude.length) {
      exclude.sort(sortFeatures);
      id += '-[' + exclude.map(d => d.id).join(',') + ']';
    }

    // return cached?
    if (this._cache[id]) {
      return this._cache[id];
    }

    // calculate unions
    let includeGeoJSON = include.map(d => d.location).reduce(_locationReducer.bind(this), null);
    let excludeGeoJSON = exclude.map(d => d.location).reduce(_locationReducer.bind(this), null);

    // calculate difference, update area and return result
    let resultGeoJSON = excludeGeoJSON ? difference(includeGeoJSON, excludeGeoJSON) : includeGeoJSON;
    const area = calcArea.geometry(resultGeoJSON.geometry) / 1e6;  // m² to km²
    resultGeoJSON.id = id;
    resultGeoJSON.properties = { id: id, area: Number(area.toFixed(2)) };

    return this._cache[id] = resultGeoJSON;


    // Sorting the location lists is ok because they end up unioned together.
    // This sorting makes it possible to generate a deterministic id.
    function sortFeatures(a, b) {
      const rank = { countrycoder: 1, geojson: 2, point: 3 };
      const aRank = rank[a.type];
      const bRank = rank[b.type];

      return (aRank > bRank) ? 1
        : (aRank < bRank) ? -1
        : a.id.localeCompare(b.id);
    }
  }


  cache() {
    return this._cache;
  }


  stringify(obj, options) {
    return prettyStringify(obj, options);
  }


}
