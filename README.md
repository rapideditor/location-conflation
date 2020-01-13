[![npm version](https://badge.fury.io/js/%40ideditor%2Flocation-conflation.svg)](https://badge.fury.io/js/%40ideditor%2Flocation-conflation)

# location-conflation

🧩 Define complex geographic regions by including and excluding country codes and geojson shapes.


### What is it?

**Location-conflation** is a tool for generating [GeoJSON](https://geojson.org/) features by
including and excluding other locations and shapes.


You can define a *location set* as an Object with `include` and `exclude` properties:
```js
let locationSet = {
  include: [ Array of locations ],
  exclude: [ Array of locations ]
};
```

The "locations" can be any of the following:
* Strings recognized by the [country-coder library](https://github.com/ideditor/country-coder#readme). These should be [ISO 3166-1 2 or 3 letter country codes or UN M.49 numeric codes](https://en.wikipedia.org/wiki/List_of_countries_by_United_Nations_geoscheme).<br/>_Example: `"de"`_
* Filenames for `.geojson` features. If you want to use your own features, pass them to the LocationConflation constructor in a `FeatureCollection` - each `Feature` must have an `id` that ends in `.geojson`.<br/>_Example: `"de-hamburg.geojson"`_
* Points as `[longitude, latitude]` coordinate pairs.  A 25km radius circle will be computed around the point.<br/>_Example: `[8.67039, 49.41882]`_


### Usage Examples
```js
const LocationConflation = require('@ideditor/location-conflation');
const myFeatures = require('./featurecollection.geojson');   // optional
const loco = new LocationConflation(myFeatures);
```

#### Southern Europe:
```js
let result = loco.resolveLocationSet({ include: ['039'] });   // 039 = Southern Europe
```
<img width="800px" alt="Southern Europe" src="https://raw.githubusercontent.com/ideditor/location-conflation/master/docs/example1.png"/>


#### Southern Europe and Northern Africa:
```js
let result = loco.resolveLocationSet({ include: ['039','015'] });   // 015 = Northern Africa
```
<img width="800px" alt="Southern Europe and Northern Africa" src="https://raw.githubusercontent.com/ideditor/location-conflation/master/docs/example2.png"/>


#### Southern Europe and Northern Africa, _excluding_ Egypt and Sudan:
```js
let result = loco.resolveLocationSet({ include: ['039','015'], exclude: ['eg','sd'] });
```
<img width="800px" alt="Southern Europe and Northern Africa, excluding Egypt and Sudan" src="https://raw.githubusercontent.com/ideditor/location-conflation/master/docs/example3.png"/>


#### The Alps, _excluding_ Liechtenstein and regions around Bern and Zürich
```js
let result = loco.resolveLocationSet({ include: ['alps.geojson'], exclude: ['li', [8.55,47.36], [7.45,46.95]] });
```
<img width="800px" alt="The Alps, excluding Liechtenstein and regions around Bern and Zürich" src="https://raw.githubusercontent.com/ideditor/location-conflation/master/docs/example4.png"/>



### Other Fun facts
* This library is a wrapper around
    * [Country-coder](https://github.com/ideditor/country-coder) for world boundaries, and
    * [Turf.js](https://github.com/Turfjs/turf) for geospatial union/difference functions
* Results contain an `area` property containing the approximate size of the feature in km²<br/>(This is helpful for sorting features)
* Results contain a stable `id` in the form `+[included]-[excluded]`<br/>(e.g. "+[015,039]-[eg,sd]")
* Results are cached, so if you ask for the same thing multiple times we don't repeat the expensive turf calls.



#### Prerequisites

* [Node.js](https://nodejs.org/) version 8 or newer
* [`git`](https://www.atlassian.com/git/tutorials/install-git/) for your platform


#### Installing

* Clone this project, for example:
  `git clone git@github.com:ideditor/location-conflation.git`
* `cd` into the project folder,
* Run `npm install` to install libraries


#### Building

* `npm run build`


### License

This project is available under the [ISC License](https://opensource.org/licenses/ISC).
See the [LICENSE.md](LICENSE.md) file for more details.
