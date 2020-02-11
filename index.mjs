import * as CountryCoder from '@ideditor/country-coder';

import calcArea from '@mapbox/geojson-area';
import rewind  from '@mapbox/geojson-rewind';
import circleToPolygon  from 'circle-to-polygon';
import precision  from 'geojson-precision';

import difference  from '@turf/difference';
import { default as union } from '@turf/union';



// Reduce an array of locations into a single GeoJSON feature
function _locationReducer(accumulator, location) {
  let result = this.locationToFeature(location);   // eslint-disable-line no-invalid-this
  if (!result || !result.feature) {
    console.warn(`Warning:  Couldn't resolve location "${location}"`);  // eslint-disable-line no-console
    return accumulator;
  }
  return !accumulator ? result.feature : union(accumulator, result.feature);
}


// It's ok to sort location lists because they all end up unioned together.
function _locationSorter(a, b) {
  const rank = { countrycoder: 1, geojson: 2, point: 3 };
  const aRank = rank[this.isValidLocation(a)] || 4;   // eslint-disable-line no-invalid-this
  const bRank = rank[this.isValidLocation(b)] || 4;   // eslint-disable-line no-invalid-this

  if (aRank > bRank) return 1;
  if (aRank < bRank) return -1;

  // numeric sort point [lon,lat] locations
  if (aRank === 3 && bRank === 3) {
    return (a[0] - b[0] > 0) ? 1
      : (a[0] - b[0] < 0) ? -1
      : (a[1] - b[1]);
  }

  // lexical sort other identifiers
  return a.localeCompare(b);
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
        const id = feature.id || props.id;
        if (!id || !/^\S+\.geojson$/i.test(id)) return;

        // ensure id
        feature.id = id;
        props.id = id;

        // ensure area property
        if (!props.area) {
          const area = calcArea.geometry(feature.geometry) / 1e6;  // m² to km²
          props.area = Number(area.toFixed(2));
        }

        this._cache[id] = feature;
      });
    }

    // Update CountryCoder world geometry to be a polygon covering the world.
    // (yes, modifying the internal CountryCoder geometry is hacky, but seems safe)
    let world = CountryCoder.feature('001');
    world.geometry = {
      type: 'Polygon',
      coordinates: [[[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]]]
    };
  }


  // isValidLocation
  //
  // Pass a `location` identifier
  // Returns 'point', 'geojson', or 'countrycoder' if valid, false otherwise
  isValidLocation(location) {
    if (Array.isArray(location)) {   // a [lon,lat] coordinate pair?
      return !!(
        location.length === 2 && Number.isFinite(location[0]) && Number.isFinite(location[1]) &&
        location[0] >= -180 && location[0] <= 180 && location[1] >= -90 && location[1] <= 90
      ) && 'point';

    } else if (/^\S+\.geojson$/i.test(location)) {   // a .geojson filename?
      return !!this._cache[location] && 'geojson';

    } else {    // a country-coder string?
      const ccmatch = CountryCoder.feature(location);
      return !!ccmatch && 'countrycoder';
    }
  }


  // locationToFeature
  //
  // Pass a `location` identifier
  // Returns a GeoJSON feature
  locationToFeature(location) {
    // a [lon,lat] coordinate pair?
    if (Array.isArray(location)) {
      if (location.length === 2 && Number.isFinite(location[0]) && Number.isFinite(location[1]) &&
        location[0] >= -180 && location[0] <= 180 && location[1] >= -90 && location[1] <= 90
      ) {
        const RADIUS = 25000;  // meters
        const EDGES = 10;
        const PRECISION = 3;
        const id = 'point:' + location.toString();
        const area = Math.PI * RADIUS * RADIUS / 1e6;     // m² to km²

        let feature = this._cache[id];
        if (!feature) {
          feature = this._cache[id] = precision({
            type: 'Feature',
            id: id,
            properties: { id: id, area: Number(area.toFixed(2)) },
            geometry: circleToPolygon(location, RADIUS, EDGES)
          }, PRECISION);
        }
        return { type: 'point', feature: feature };

      } else {
        return null;
      }

     // a .geojson filename?
     } else if (/^\S+\.geojson$/i.test(location)) {
      const feature = this._cache[location];
      if (feature) {
        return { type: 'geojson', feature: feature };
      } else {
        return null;
      }

    // a country-coder string?
    } else {
      let feature = CountryCoder.feature(location);
      if (feature) {
        feature.properties = feature.properties || {};
        let props = feature.properties;

        // -> This block of code is weird and requires some explanation. <-
        // CountryCoder includes higher level features which are made up of members.
        // These features don't have their own geometry, but CountryCoder provides an
        //   `aggregateFeature` method to combine these members into a MultiPolygon.
        // BUT, when we try to actually work with these aggregated MultiPolygons,
        //   Turf/JSTS gets crashy because of topography bugs.
        // SO, we'll aggregate the features ourselves by unioning them together,
        //   then store the resulting geometry back in the CountryCoder feature itself.
        // This approach also has the benefit of removing all the internal boaders and
        //   simplifying the regional polygons a lot.
        // (yes, modifying the internal CountryCoder geometry is hacky, but seems safe)
        if (!feature.geometry) {
          let aggregate = props.members.reduce(_locationReducer.bind(this), null);
          feature.geometry = aggregate.geometry;
        } else {
          feature = rewind(feature);  // watch out - Country Coder features inconsistently wound!
        }

        // ensure area property
        if (!props.area) {
          const area = calcArea.geometry(feature.geometry) / 1e6;  // m² to km²
          props.area = Number(area.toFixed(2));
        }

        // ensure id
        const id = (props.iso1A2 || props.iso1N3 || props.m49 || props.M49).toString();
        feature.id = id;
        props.id = id;

        return { type: 'countrycoder', feature: feature };

      } else {
        return null;
      }
    }
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
    let include = (locationSet.include || []).filter(l => this.isValidLocation(l));
    let exclude = (locationSet.exclude || []).filter(l => this.isValidLocation(l));

    if (include.length) {
      include.sort(_locationSorter.bind(this));
    } else {
      include = ['001'];   // default to 'the world'
    }

    // return quickly if it's a single included location..
    if (include.length === 1 && exclude.length === 0) {
      let result = this.locationToFeature(include[0]);
      return result && result.feature;
    }

    // generate stable identifier
    let id = '+' + toIdString(include);
    if (exclude.length) {
      exclude.sort(_locationSorter.bind(this));
      id += '-' + toIdString(exclude);
    }

    // return cached?
    if (this._cache[id]) {
      return this._cache[id];
    }

    // resolve lists
    let includeGeoJSON = include.reduce(_locationReducer.bind(this), null);
    let excludeGeoJSON = exclude.reduce(_locationReducer.bind(this), null);

    // calculate include-exclude, recalc area and return result
    let resultGeoJSON = excludeGeoJSON ? difference(includeGeoJSON, excludeGeoJSON) : includeGeoJSON;
    const area = calcArea.geometry(resultGeoJSON.geometry) / 1e6;  // m² to km²

    resultGeoJSON.id = id;
    resultGeoJSON.properties = { id: id, area: Number(area.toFixed(2)) };
    this._cache[id] = resultGeoJSON;

    return resultGeoJSON;


    function toIdString(arr) {
      return JSON.stringify(arr).replace(/"/g,'').toLowerCase();
    }
  }

}
