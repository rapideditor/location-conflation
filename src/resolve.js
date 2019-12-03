const CountryCoder = require('@ideditor/country-coder');
const locationToFeature = require('./locationToFeature.js');

const difference = require('@turf/difference');
const union = require('@turf/union').default;


function resolve(includeLocations, excludeLocations) {
  includeLocations = includeLocations || [];
  excludeLocations = excludeLocations || [];


  let includeGeoJSON = includeLocations.reduce((accumulator, location) => {
    let result = locationToFeature(location);
    if (!result) {
      console.warn(`Warning:  Couldn't resolve include location "${location}"`);
      return accumulator;
    }
    return !accumulator ? result.feature : union(accumulator, result.feature);
  }, null);

  let excludeGeoJSON = excludeLocations.reduce((accumulator, location) => {
    let result = locationToFeature(location);
    if (!result) {
      console.warn(`Warning:  Couldn't resolve exclude location "${location}"`);
      return accumulator;
    }
    return !accumulator ? result.feature : union(accumulator, result.feature);
  }, null);


  if (includeGeoJSON && excludeGeoJSON) {
    return difference(includeGeoJSON, excludeGeoJSON);
  } else {
    return includeGeoJSON;
  }

}

module.exports = resolve;
