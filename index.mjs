import locationToFeature from './src/locationToFeature.js';
import isValidLocation from './src/isValidLocation.js';


// // build indexes
// import whichPolygon from 'which-polygon';

// Object.keys(resources).forEach(resourceId => {
//   const resource = resources[resourceId];

//   resource.includeLocations.forEach(location => {
//     const featureId = location.toString();
//     let keepFeature = keepFeatures[featureId];
//     if (!keepFeature) {
//       const origFeature = locationToFeature(location, features).feature;
//       keepFeature = deepClone(origFeature);
//       keepFeature.properties.resources = {};
//       keepFeatures[featureId] = keepFeature;
//     }

//     keepFeature.properties.resources[resourceId] = deepClone(resource);
//   });
// });

// let includes = whichPolygon(includegj);
// let excludes = whichPolygon(excludegj);


export {
  locationToFeature, isValidLocation
};
