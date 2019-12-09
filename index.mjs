import * as CountryCoder from '@ideditor/country-coder';

import calcArea from '@mapbox/geojson-area';
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
    // (yes, modifying the internal CountryCoder geometry is hacky, but seems safe)
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

        // -> This block of code is weird and requires some explanation. <-
        // CountryCoder includes higher level features which are made up of members.
        // These features don't have their own geometry, but CountryCoder provides an
        //   `aggregateFeature` method to combine these members into a MultiPolygon.
        // BUT, when we try to actually work with these MultiPolygons, Turf/JSTS
        //   gets crashy because of topography bugs.
        // SO, we'll aggregate the features ourselves by unioning them together,
        //   then store the resulting geometry back in the CountryCoder feature itself.
        // (yes, modifying the internal CountryCoder geometry is hacky, but seems safe)
        if (!feature.geometry) {
          let aggregate = feature.properties.members.reduce(_locationReducer.bind(this), null);
          feature.geometry = aggregate.geometry;
        }

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

    // generate identifier
    let id = '+' + JSON.stringify(include).toLowerCase();
    if (exclude.length) {
      exclude.sort(_locationSorter.bind(this));
      id += '-' + JSON.stringify(exclude).toLowerCase();
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
  }

}
