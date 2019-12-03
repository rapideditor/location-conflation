const CountryCoder = require('@ideditor/country-coder');
const locationToFeature = require('./locationToFeature.js');

const calcArea = require('@mapbox/geojson-area');
const difference = require('@turf/difference');
const union = require('@turf/union').default;


function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// try reducing the CountryCoder regions before we do anything
let _cccache = {};
let world = deepClone(CountryCoder.feature('001'));
world.geometry = {
  type: 'Polygon',
  coordinates: [[[-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90]]]
};
_cccache['001'] = world;
world.properties.members.reduce(reduceCodes, null);

function reduceCodes(accumulator, code) {
  let feature = _cccache[code];
  if (!feature)  {
    feature = _cccache[code] = deepClone(CountryCoder.feature(code));
    if (!feature.geometry) {    // has children
      let aggregate = feature.properties.members.reduce(reduceCodes, null);
      feature.geometry = aggregate.geometry;
    }
  }

  return !accumulator ? feature : union(accumulator, feature);
}



// resolve2() - USES THE CC CACHE
// pass a locations Object like:
// {
//   include: [ Array ],
//   exclude: [ Array ]
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
    let feature = _cccache[location];
    if (!feature) {
      let result = locationToFeature(location);
      if (!result) {
        console.warn(`Warning:  Couldn't resolve location "${location}"`);
        return accumulator;
      } else {
        feature = result.feature;
      }
    }
    _currCount++;
    return !accumulator ? feature : union(accumulator, feature);
  }

}


module.exports = resolve;
