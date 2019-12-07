import * as CountryCoder from '@ideditor/country-coder';

import calcArea from '@mapbox/geojson-area';
import circleToPolygon  from 'circle-to-polygon';
import precision  from 'geojson-precision';

import difference  from '@turf/difference';
import { default as union } from '@turf/union';


export default class {
  constructor(features) {
    this._features = features || {};
  }

  // isValidLocation
  // Pass a location identifier
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


  // getIdentifier
  // Pass a locationSet Object like:
  //   { include: [ Array ], exclude: [ Array ] }
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



  // locationToFeature
  // Pass a location identifier
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

        let feature = {
          type: 'Feature',
          id: id,
          properties: {
            id: id,
            area: Number(area.toFixed(2))
          },
          geometry: circleToPolygon(location, RADIUS, EDGES)
        };
        return { type: 'point', feature: precision(feature, 3) };
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
      let feature;
      if (location === '001') {  // the world
        feature = CountryCoder.feature(location);
        feature.geometry = {
          type: 'Polygon',
          coordinates: [[[-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90]]]
        };
      } else {
        feature = CountryCoder.aggregateFeature(location);
      }

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

}
