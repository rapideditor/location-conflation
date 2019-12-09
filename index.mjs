import * as CountryCoder from '@ideditor/country-coder';

import calcArea from '@mapbox/geojson-area';
import circleToPolygon  from 'circle-to-polygon';
import precision  from 'geojson-precision';

import difference  from '@turf/difference';
import { default as union } from '@turf/union';


export default class {

  // constructor
  //
  // Optionally pass an Object of known GeoJSON features which we can use later
  // Each feature must have a filename-like id:  `something.geojson`
  // {
  //  "philly_metro.geojson": {
  //    "type": "Feature",
  //    "id": "philly_metro.geojson",
  //    "properties": {},
  //    "geometry": { ... }
  //  }
  // }
  constructor(features) {
    this._cache = {};
    this._features = features || {};

    // Update CountryCoder world geometry to be a polygon covering the world.
    // (yes, modifying the internal CountryCoder feature.geometry is hacky, but seems safe)
    let world = CountryCoder.feature('001');
    world.geometry = {
      type: 'Polygon',
      coordinates: [[[-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90]]]
    };
  }


  // isValidLocation
  // Pass a `location` identifier
  // Returns 'point', 'geojson', or 'countrycoder' if valid, false otherwise
  isValidLocation(location) {
    if (Array.isArray(location)) {   // a [lon,lat] coordinate pair?
      return !!(
        location.length === 2 && Number.isFinite(location[0]) && Number.isFinite(location[1]) &&
        location[0] >= -180 && location[0] <= 180 && location[1] >= -90 && location[1] <= 90
      ) && 'point';

    } else if (/^\S+\.geojson$/i.test(location)) {   // a .geojson filename?
      return !!this._features[location] && 'geojson';

    } else {    // a country-coder string?
      let ccmatch = CountryCoder.feature(location);
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
        const id = 'point:' + location.toString();
        const area = Math.PI * RADIUS * RADIUS / 1e6;     // m² to km²

        let feature = this._cache[id];
        if (!feature) {
          feature = this._cache[id] = precision({
            type: 'Feature',
            id: id,
            properties: { id: id, area: Number(area.toFixed(2)) },
            geometry: circleToPolygon(location, RADIUS, EDGES)
          }, 3);
        }
        return { type: 'point', feature: feature };
      } else {
        return null;
      }

     // a .geojson filename?
     } else if (/^\S+\.geojson$/i.test(location)) {
      let feature = this._features[location];
      if (feature) {
        feature.properties = feature.properties || {};
        if (!feature.properties.area) {                          // ensure area property
          let area = calcArea.geometry(feature.geometry) / 1e6;  // m² to km²
          feature.properties.area = Number(area.toFixed(2));
        }
        return { type: 'geojson', feature: feature };
      } else {
        return null;
      }

    // a country-coder string?
    } else {
      let feature = CountryCoder.feature(location);
      if (feature) {
        feature.properties = feature.properties || {};
        if (!feature.properties.area) {                            // ensure area property
          const area = calcArea.geometry(feature.geometry) / 1e6;  // m² to km²
          feature.properties.area = Number(area.toFixed(2));
        }
        return { type: 'countrycoder', feature: feature };
      } else {
        return null;
      }

    }
  }


  // getIdentifier
  //
  // Pass a `locationSet` Object like:
  //   `{ include: [ Array ], exclude: [ Array ] }`
  // Returns a stable identifier string of the form:
  //   "+[included]-[excluded]"
  getIdentifier(locationSet) {
    locationSet = locationSet || {};
    let include = (locationSet.include || []).filter(l => this.isValidLocation(l));
    let exclude = (locationSet.exclude || []).filter(l => this.isValidLocation(l));
    let that = this;

    if (include.length) {
      include.sort(compare);
    } else {
      include = ['001'];   // default to 'the world'
    }

    let id = '+' + JSON.stringify(include).toLowerCase();

    if (exclude.length) {
      exclude.sort(compare);
      id += '-' + JSON.stringify(exclude).toLowerCase();
    }

    return id;

    // it's ok to sort these lists because they all end up unioned together.
    function compare(a, b) {
      const rank = { countrycoder: 1, geojson: 2, point: 3 };
      const aRank = rank[that.isValidLocation(a)] || 4;
      const bRank = rank[that.isValidLocation(b)] || 4;

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
  }


  // resolveLocationSet()
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
    let that = this;

    if (include.length) {
      include.sort(locationSorter);
    } else {
      include = ['001'];   // default to 'the world'
    }

    // exit early if a simple shape..
    if (include.length === 1 && exclude.length === 0) {
      return this.locationToFeature(include[0]);
    }

    // generate identifier
    let id = '+' + JSON.stringify(include).toLowerCase();
    if (exclude.length) {
      exclude.sort(locationSorter);
      id += '-' + JSON.stringify(exclude).toLowerCase();
    }

    // return cached?
    if (this._cache[id]) {
      return this._cache[id];
    }

    // resolve lists
    let includeGeoJSON = include.reduce(locationReducer, null);
    let excludeGeoJSON = exclude.reduce(locationReducer, null);

    // calculate include-exclude, recalc area and return result
    let resultGeoJSON = excludeGeoJSON ? difference(includeGeoJSON, excludeGeoJSON) : includeGeoJSON;
    const area = calcArea.geometry(resultGeoJSON.geometry) / 1e6;  // m² to km²

    resultGeoJSON.id = id;
    resultGeoJSON.properties = { id: id, area: Number(area.toFixed(2)) };
    this._cache[id] = resultGeoJSON;

    return resultGeoJSON;


    // Reduce the locations into a single GeoJSON feature
    function locationReducer(accumulator, location) {
      let result = that.locationToFeature(location);
      if (!result) {
        console.warn(`Warning:  Couldn't resolve location "${location}"`);  // eslint-disable-line no-console
        return accumulator;
      }

      let feature = result.feature;

      // -> This block of code is weird and requires some explanation. <-
      // CountryCoder includes higher level features which are made up of members.
      // These features don't have their own geometry, but CountryCoder provides an
      //   `aggregateFeature` method to combine these members into a MultiPolygon.
      // BUT, when we try to actually work with these MultiPolygons, Turf/JSTS
      //   gets crashy because of topography bugs.
      // SO, we'll aggregate the features ourselves by unioning them together,
      //   then store the resulting geometry back in the CountryCoder feature itself.
      //   (yes, modifying the internal CountryCoder feature geometry is hacky, but seems safe)
      if (result.type === 'countrycoder' && !feature.geometry) {
        let aggregate = feature.properties.members.reduce(locationReducer, null);
        feature.geometry = aggregate.geometry;
        const area = calcArea.geometry(feature.geometry) / 1e6;  // m² to km²
        feature.properties.area = Number(area.toFixed(2));
      }

      return !accumulator ? feature : union(accumulator, feature);
    }


    // It's ok to sort location lists because they all end up unioned together.
    function locationSorter(a, b) {
      const rank = { countrycoder: 1, geojson: 2, point: 3 };
      const aRank = rank[that.isValidLocation(a)] || 4;
      const bRank = rank[that.isValidLocation(b)] || 4;

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
  }


}
