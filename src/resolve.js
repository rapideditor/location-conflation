const CountryCoder = require('@ideditor/country-coder');
const locationToFeature = require('./locationToFeature.js');

const calcArea = require('@mapbox/geojson-area');
const difference = require('@turf/difference');
const union = require('@turf/union').default;


// resolve()
// pass a locations Object like:
// {
//    include:  [ Array ],
//    exclude:  [ Array ]
// }
//
function resolve(locations) {
  locations = locations || {};
  locations.include = locations.include || [];
  locations.exclude = locations.exclude || [];

  let _currCount;   // keep track of how many locations were actually resolvable.

  // resolve included..
  _currCount = 0;
  let includeGeoJSON = locations.include.reduce(locationReducer, null);
  let includeCount = _currCount;
  if (!includeCount) {
    console.warn('Warning:  Nothing included, defaulting to world ("001").');
    includeGeoJSON = locationToFeature('001').feature;
    includeCount++;
  }

  // resolve excluded..
  _currCount = 0;
  let excludeGeoJSON = locations.exclude.reduce(locationReducer, null);
  let excludeCount = _currCount;

  // generate an id
  let id = '+[' + locations.include.toString() + ']';
  if (excludeCount) {
    id += '-[' + locations.exclude.toString() + ']';
  }

  // exit early if nothing to do, or a simple shape..
  if (includeCount === 0) {
    return {
      type: 'Feature',
      id: id,
      properties: { id: id, area: 0 },
      geometry: null
    };
  } else if (includeCount === 1 && excludeCount === 0) {
    return includeGeoJSON;
  }

  // calculate include-exclude, recalc area and return result
  let resultGeoJSON = excludeGeoJSON ? difference(includeGeoJSON, excludeGeoJSON) : includeGeoJSON;
  const area = calcArea.geometry(resultGeoJSON.geometry) / 1e6;  // m² to km²

  resultGeoJSON.id = id;
  resultGeoJSON.properties = { id: id, area: Number(area.toFixed(2)) };

  return resultGeoJSON;


  // reduce all the locations into a single geojson feature
  function locationReducer(accumulator, location) {
    let result = locationToFeature(location);
    if (!result) {
      console.warn(`Warning:  Couldn't resolve location "${location}"`);
      return accumulator;
    } else {
      _currCount++;

      let feature = result.feature;

      // So.. We sometimes run into issues with `turf.union` and JSTS.. :(
      // Some of the results we get from country-coder are MultiPolygon regions containing
      // many countries.  It seems to help if we reduce the complexity of these regions
      // before we try to union them into the accumulated feature.
      if (Array.isArray(feature.properties.members) && feature.properties.id !== '001') {
        // Try unioning region with itself to remove internal boundaries.
        feature = union(feature, feature);
      }

      return !accumulator ? feature : union(accumulator, feature);
    }
  }

}


module.exports = resolve;
