import * as CountryCoder from '@ideditor/country-coder';

import calcArea from '@mapbox/geojson-area';
import circleToPolygon  from 'circle-to-polygon';
import polygonClipping from 'polygon-clipping';
import precision  from 'geojson-precision';
import prettyStringify from '@aitodotai/json-stringify-pretty-compact';


export default class {

  // constructor
  //
  // `fc`  Optional FeatureCollection of known features
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
    // The _cache retains resolved features, so if you ask for the same thing multiple times
    // we don't repeat the expensive resolving/clipping operations.
    //
    // Each feature has a stable identifier that is used as the cache key.
    // The identifiers look like:
    // - for point locations, the stringified point:          e.g. '[8.67039,49.41882]'
    // - for geojson locations, the geojson id:               e.g. 'de-hamburg.geojson'
    // - for countrycoder locations, feature.id property:     e.g. 'Q2'  (countrycoder uses Wikidata identifiers)
    // - for aggregated locationSets, +[include]-[exclude]:   e.g '+[Q2]-[Q18,Q27611]'
    this._cache = {};

    // When strict mode = true, throw on invalid locations or locationSets.
    // When strict mode = false, return `null` for invalid locations or locationSets.
    this._strict = true;

    // process input FeatureCollection
    if (fc && fc.type === 'FeatureCollection' && Array.isArray(fc.features)) {
      fc.features.forEach(feature => {
        feature.properties = feature.properties || {};
        let props = feature.properties;

        // Get `id` from either `id` or `properties`
        let id = feature.id || props.id;
        if (!id || !/^\S+\.geojson$/i.test(id)) return;

        // Ensure `id` exists and is lowercase
        id = id.toLowerCase();
        feature.id = id;
        props.id = id;

        // Ensure `area` property exists
        if (!props.area) {
          const area = calcArea.geometry(feature.geometry) / 1e6;  // m² to km²
          props.area = Number(area.toFixed(2));
        }

        this._cache[id] = feature;
      });
    }

    // Replace CountryCoder world geometry to be a polygon covering the world.
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
  // `location`  The location to validate
  //
  // Pass a `location` value to validate
  //
  // Returns a result like:
  //   {
  //     type:     'point', 'geojson', or 'countrycoder'
  //     location:  the queried location
  //     id:        the stable identifier for the feature
  //   }
  // or `null` if the location is invalid
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
        // Use wikidata QID as the identifier, since that seems to be the one
        // property that everything in CountryCoder is guaranteed to have.
        const id = feature.properties.wikidata;
        return { type: 'countrycoder', location: location, id: id };
      }
    }

    if (this._strict) {
      throw new Error(`validateLocation:  Invalid location: "${location}".`);
    } else {
      return null;
    }
  }


  // resolveLocation
  // `location`  The location to resolve
  //
  // Pass a `location` value to resolve
  //
  // Returns a result like:
  //   {
  //     type:      'point', 'geojson', or 'countrycoder'
  //     location:  the queried location
  //     id:        a stable identifier for the feature
  //     feature:   the resolved GeoJSON feature
  //   }
  //  or `null` if the location is invalid
  //
  resolveLocation(location) {
    const valid = this.validateLocation(location);
    if (!valid) return null;

    const id = valid.id;

    // Return a result from cache if we can
    if (this._cache[id]) {
      return Object.assign(valid, { feature: this._cache[id] });
    }

    // A [lon,lat] coordinate pair?
    if (valid.type === 'point') {
      const RADIUS = 25000;  // meters
      const EDGES = 10;
      const PRECISION = 3;
      const area = Math.PI * RADIUS * RADIUS / 1e6;     // m² to km²
      const feature = this._cache[id] = precision({
        type: 'Feature',
        id: id,
        properties: { id: id, area: Number(area.toFixed(2)) },
        geometry: circleToPolygon(location, RADIUS, EDGES)
      }, PRECISION);
      return Object.assign(valid, { feature: feature });

    // A .geojson filename?
    } else if (valid.type === 'geojson') {
      // nothing to do here - these are all in _cache and would have returned already

    // A country-coder identifier?
    } else if (valid.type === 'countrycoder') {
      let feature = _cloneDeep(CountryCoder.feature(id));
      let props = feature.properties;

      // -> This block of code is weird and requires some explanation. <-
      // CountryCoder includes higher level features which are made up of members.
      // These features don't have their own geometry, but CountryCoder provides an
      //   `aggregateFeature` method to combine these members into a MultiPolygon.
      // In the past, Turf/JSTS/martinez could not handle the aggregated features,
      //   so we'd iteratively union them all together.  (this was slow)
      // But now mfogel/polygon-clipping handles these MultiPolygons like a boss.
      // This approach also has the benefit of removing all the internal boaders and
      //   simplifying the regional polygons a lot.
      if (Array.isArray(props.members)) {
        let aggregate = CountryCoder.aggregateFeature(id);
        aggregate.geometry.coordinates = _clip([aggregate], 'UNION').geometry.coordinates;
        feature.geometry = aggregate.geometry;
      }

      // Ensure `area` property exists
      if (!props.area) {
        const area = calcArea.geometry(feature.geometry) / 1e6;  // m² to km²
        props.area = Number(area.toFixed(2));
      }

      // Ensure `id` property exists
      feature.id = id;
      props.id = id;

      this._cache[id] = feature;
      return Object.assign(valid, { feature: feature });
    }

    if (this._strict) {
      throw new Error(`resolveLocation:  Couldn't resolve location "${location}".`);
    } else {
      return null;
    }
  }


  // validateLocationSet
  // `locationSet`  the locationSet to validate
  //
  // Pass a locationSet Object to validate like:
  //   {
  //     include: [ Array of locations ],
  //     exclude: [ Array of locations ]
  //   }
  //
  // Returns a result like:
  //   {
  //     type:         'locationset'
  //     locationSet:  the queried locationSet
  //     id:           the stable identifier for the feature
  //   }
  // or `null` if the locationSet is invalid
  //
  validateLocationSet(locationSet) {
    locationSet = locationSet || {};
    const validator = this.validateLocation.bind(this);
    let include = (locationSet.include || []).map(validator).filter(Boolean);
    let exclude = (locationSet.exclude || []).map(validator).filter(Boolean);

    if (!include.length) {
      if (this._strict) {
        throw new Error(`validateLocationSet:  LocationSet includes nothing.`);
      } else {
        // non-strict mode, replace an empty locationSet with one that includes "the world"
        locationSet.include = ['Q2'];
        include = [{ type: 'countrycoder', location: 'Q2', id: 'Q2' }];
      }
    }

    // Generate stable identifier
    include.sort(_sortLocations);
    let id = '+[' + include.map(d => d.id).join(',') + ']';
    if (exclude.length) {
      exclude.sort(_sortLocations);
      id += '-[' + exclude.map(d => d.id).join(',') + ']';
    }

    return { type: 'locationset', locationSet: locationSet, id: id };
  }


  // resolveLocationSet
  // `locationSet`  the locationSet to resolve
  //
  // Pass a locationSet Object to validate like:
  //   {
  //     include: [ Array of locations ],
  //     exclude: [ Array of locations ]
  //   }
  //
  // Returns a result like:
  //   {
  //     type:         'locationset'
  //     locationSet:  the queried locationSet
  //     id:           the stable identifier for the feature
  //     feature:      the resolved GeoJSON feature
  //   }
  // or `null` if the locationSet is invalid
  //
  resolveLocationSet(locationSet) {
    locationSet = locationSet || {};
    const valid = this.validateLocationSet(locationSet);
    if (!valid) return null;

    const id = valid.id;

    // Return a result from cache if we can
    if (this._cache[id]) {
      return Object.assign(valid, { feature: this._cache[id] });
    }

    const resolver = this.resolveLocation.bind(this);
    const includes = (locationSet.include || []).map(resolver).filter(Boolean);
    const excludes = (locationSet.exclude || []).map(resolver).filter(Boolean);

    // Return quickly if it's a single included location..
    if (includes.length === 1 && excludes.length === 0) {
      return Object.assign(valid, { feature: includes[0].feature });
    }

    // Calculate unions
    const includeGeoJSON = _clip(includes.map(d => d.feature), 'UNION');
    const excludeGeoJSON = _clip(excludes.map(d => d.feature), 'UNION');

    // Calculate difference, update `area` and return result
    let resultGeoJSON = excludeGeoJSON ? _clip([includeGeoJSON, excludeGeoJSON], 'DIFFERENCE') : includeGeoJSON;
    const area = calcArea.geometry(resultGeoJSON.geometry) / 1e6;  // m² to km²
    resultGeoJSON.id = id;
    resultGeoJSON.properties = { id: id, area: Number(area.toFixed(2)) };

    this._cache[id] = resultGeoJSON;
    return Object.assign(valid, { feature: resultGeoJSON });
  }


  // strict
  //
  strict(val) {
    if (val === undefined) {   // get
      return this._strict;
    } else {                   // set
      this._strict = val;
      return this;
    }
  }


  // cache
  // convenience method to access the internal cache
  cache() {
    return this._cache;
  }


  // stringify
  // convenience method to prettyStringify the given object
  stringify(obj, options) {
    return prettyStringify(obj, options);
  }
}


// Wrap the mfogel/polygon-clipping library and return a GeoJSON feature.
function _clip(features, which) {
  if (!Array.isArray(features) || !features.length) return null;

  const fn = { UNION: polygonClipping.union, DIFFERENCE: polygonClipping.difference }[which];
  const args = features.map(feature => feature.geometry.coordinates);
  const coords = fn.apply(null, args);
  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: whichType(coords),
      coordinates: coords
    }
  };

  // is this a Polygon or a MultiPolygon?
  function whichType(coords) {
    const a = Array.isArray(coords);
    const b = a && Array.isArray(coords[0]);
    const c = b && Array.isArray(coords[0][0]);
    const d = c && Array.isArray(coords[0][0][0]);
    return d ? 'MultiPolygon' : 'Polygon';
  }
}


function _cloneDeep(obj) {
  return JSON.parse(JSON.stringify(obj));
}


// Sorting the location lists is ok because they end up unioned together.
// This sorting makes it possible to generate a deterministic id.
function _sortLocations(a, b) {
  const rank = { countrycoder: 1, geojson: 2, point: 3 };
  const aRank = rank[a.type];
  const bRank = rank[b.type];

  return (aRank > bRank) ? 1
    : (aRank < bRank) ? -1
    : a.id.localeCompare(b.id);
}