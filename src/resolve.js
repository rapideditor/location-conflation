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

  // resolve included..
  let includeCount = 0;
  let includeGeoJSON = locations.include.reduce((accumulator, location) => {
    let result = locationToFeature(location);
    if (!result) {
      console.warn(`Warning:  Couldn't resolve include location "${location}"`);
      return accumulator;
    } else {
      includeCount++;
      return !accumulator ? result.feature : union(accumulator, result.feature);
    }
  }, null);

  if (!includeCount) {
    console.warn('Warning:  Nothing included, defaulting to world ("001").');
    includeGeoJSON = locationToFeature('001').feature;
    includeCount++;
  }

  // resolve excluded..
  let excludeCount = 0;
  let excludeGeoJSON = locations.exclude.reduce((accumulator, location) => {
    let result = locationToFeature(location);
    if (!result) {
      console.warn(`Warning:  Couldn't resolve exclude location "${location}"`);
      return accumulator;
    } else {
      excludeCount++;
      return !accumulator ? result.feature : union(accumulator, result.feature);
    }
  }, null);

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

  let resultGeoJSON = excludeGeoJSON ? difference(includeGeoJSON, excludeGeoJSON) : includeGeoJSON;
  const area = calcArea.geometry(resultGeoJSON.geometry) / 1e6;  // m² to km²

  resultGeoJSON.id = id;
  resultGeoJSON.properties = { id: id, area: Number(area.toFixed(2)) };

  return resultGeoJSON;
}


module.exports = resolve;