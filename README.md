[![npm version](https://badge.fury.io/js/%40ideditor%2Flocation-conflation.svg)](https://badge.fury.io/js/%40ideditor%2Flocation-conflation)
[![Build Status](https://travis-ci.org/ideditor/location-conflation.svg?branch=master)](https://travis-ci.org/ideditor/location-conflation)


# location-conflation

🧩 Define complex geographic regions by including and excluding country codes and GeoJSON shapes.


### What is it?

**Location-conflation** is a tool for generating [GeoJSON](https://geojson.org/) features by
including and excluding other locations and shapes.

⚡️ Try it now!:  https://ideditor.github.io/location-conflation/


You can define a *locationSet* as an Object with `include` and `exclude` properties:
```js
let locationSet = {
  include: [ Array of locations ],
  exclude: [ Array of locations ]
};
```

The "locations" can be any of the following:
* Strings recognized by the [country-coder library](https://github.com/ideditor/country-coder#readme). These should be [ISO 3166-1 2 or 3 letter country codes](https://en.wikipedia.org/wiki/List_of_countries_by_United_Nations_geoscheme) or [UN M.49 numeric codes](https://en.wikipedia.org/wiki/UN_M49).<br/>_Example: `"de"`_
* Filenames for `.geojson` features. If you want to use your own features, pass them to the LocationConflation constructor in a `FeatureCollection` - each `Feature` must have an `id` that ends in `.geojson`.<br/>_Example: `"de-hamburg.geojson"`_
* Points as `[longitude, latitude]` coordinate pairs.  A 25km radius circle will be computed around the point.<br/>_Example: `[8.67039, 49.41882]`_


## Usage

To install location-conflation as a dependency in your project:
```bash
$  npm install --save @ideditor/location-conflation
```

**location-conflation** is distributed in both UMD and ES6 module formats for maxmimum compatibility. ([Read more about Javascript module formats](https://dev.to/iggredible/what-the-heck-are-cjs-amd-umd-and-esm-ikm))
* `index.mjs`  - ES6 module
* `dist/index.js` - UMD module, ES6 syntax
* `dist/index.es5.js` - UMD module, ES5 syntax

Whether you require or import it, it should just work.

```js
const LocationConflation = require('@ideditor/location-conflation');    // UMD import all
// or
import * as LocationConflation from '@ideditor/location-conflation';    // ES6 import all
```

You can also use **location-conflation** directly in a web browser. A good way to do this is to fetch the file from the [jsDelivr CDN](https://www.jsdelivr.com/), which can even deliver minified versions.

The latest versions of many web browsers now support [ES6 modules in script tags](https://caniuse.com/#feat=es6-module) like this:
```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@ideditor/location-conflation@0.5/index.min.mjs"></script>
```

Older versions of modern ES6-capable browsers can still load the UMD build:
```html
<script src="https://cdn.jsdelivr.net/npm/@ideditor/location-conflation@0.5/dist/index.min.js"></script>
```

Or if you need to support even older browsers like Internet Explorer, fetch the ES5 version:
```html
<script src="https://cdn.jsdelivr.net/npm/@ideditor/location-conflation@0.5/dist/index.es5.min.js"></script>
```

&nbsp;

## Examples
```js
const LocationConflation = require('@ideditor/location-conflation');
const myFeatures = require('./path/to/FeatureCollection.json');   // optional
const loco = new LocationConflation(myFeatures);
```

#### Southern Europe:
```js
let locationSet = { include: ['039'] };    // 039 = Southern Europe
let result = loco.resolveLocationSet(locationSet);
```
<img width="800px" alt="Southern Europe" src="https://raw.githubusercontent.com/ideditor/location-conflation/master/docs/images/example1.png"/>


#### Southern Europe and Northern Africa:
```js
let locationSet = { include: ['039','015'] };   // 015 = Northern Africa
let result = loco.resolveLocationSet(locationSet);
```
<img width="800px" alt="Southern Europe and Northern Africa" src="https://raw.githubusercontent.com/ideditor/location-conflation/master/docs/images/example2.png"/>


#### Southern Europe and Northern Africa, _excluding_ Egypt and Sudan:
```js
let locationSet = { include: ['039','015'], exclude: ['eg','sd'] };
let result = loco.resolveLocationSet(locationSet);
```
<img width="800px" alt="Southern Europe and Northern Africa, excluding Egypt and Sudan" src="https://raw.githubusercontent.com/ideditor/location-conflation/master/docs/images/example3.png"/>


#### The Alps, _excluding_ Liechtenstein and regions around Bern and Zürich
```js
let result = loco.resolveLocationSet({ include: ['alps.geojson'], exclude: ['li', [8.55,47.36], [7.45,46.95]] });
```
<img width="800px" alt="The Alps, excluding Liechtenstein and regions around Bern and Zürich" src="https://raw.githubusercontent.com/ideditor/location-conflation/master/docs/images/example4.png"/>


&nbsp;

## API Reference

* [constructor](#constructor)
* [validateLocation](#validateLocation)
* [validateLocationSet](#validateLocationSet)
* [resolveLocation](#resolveLocation)
* [resolveLocationSet](#resolveLocationSet)
* [strict](#strict)
* [stringify](#stringify)
* [cache](#cache)

&nbsp;

<a name="constructor" href="#constructor">#</a> const <i>loco</i> = new <b>LocationConflation</b>(<i>featureCollection</i>)

Constructs a new LocationConflation instance.

Optionally pass a GeoJSON FeatureCollection of known features which can be used later as locations.

Each feature *must* have a filename-like `id`, for example: `example.geojson`
```js
{
  "type": "FeatureCollection"
  "features": [
    {
      "type": "Feature",
      "id": "example.geojson",
      "properties": { … },
      "geometry": { … }
    }
  ]
}
```

&nbsp;

<a name="validateLocation" href="#validateLocation">#</a> <i>loco</i>.<b>validateLocation</b>(<i>location</i>)

Validates a given location. The "locations" can be:
* Points as `[longitude, latitude]` coordinate pairs. _Example: `[8.67039, 49.41882]`_
* Filenames for known `.geojson` features. _Example: `"de-hamburg.geojson"`_
* Strings recognized by the [country-coder library](https://github.com/ideditor/country-coder#readme). _Example: `"de"`_

If the location is valid, returns a result `Object` like:
```js
{
  type:     'point', 'geojson', or 'countrycoder'
  location:  the queried location
  id:        the stable identifier for the feature
}
```

If the location is invalid,
* _in strict mode_, throws an error
* _in non-strict mode_, returns `null`

&nbsp;

<a name="validateLocationSet" href="#validateLocationSet">#</a> <i>loco</i>.<b>validateLocationSet</b>(<i>locationSet</i>)

Validates a given locationSet. Pass a locationSet `Object` like:
```js
{
  include: [ Array of locations ],
  exclude: [ Array of locations ]
}
```

If the locationSet is valid, returns a result `Object` like:

```js
{
  type:         'locationset'
  locationSet:  the queried locationSet
  id:           the stable identifier for the feature
}
```

If the locationSet is invalid or contains any invalid locations,
* _in strict mode_, throws an error
* _in non-strict mode_, invalid locations are quietly ignored. A locationSet with nothing included will be considered valid, and will validate as if it were a locationSet covering the entire world.  `{ type: 'locationset', locationSet: ['Q2'], id: +[Q2] }`

&nbsp;

<a name="resolveLocation" href="#resolveLocation">#</a> <i>loco</i>.<b>resolveLocation</b>(<i>location</i>)

Resolves a given location into a GeoJSON feature.  This is similar to [validateLocation](#validateLocation), but runs slower and includes the actual GeoJSON in the result.  Results are cached, so if you ask for the same thing multiple times we don't repeat the expensive clipping operations.

The returned GeoJSON feature will also have an `area` property containing the approximate size of the feature in km².  (This is helpful for sorting features)

If the location is valid, returns a result `Object` like:
```js
{
  type:     'point', 'geojson', or 'countrycoder'
  location:  the queried location
  id:        the stable identifier for the feature
  feature:   the resolved GeoJSON feature
}
```

If the location is invalid,
* _in strict mode_, throws an error
* _in non-strict mode_, returns `null`

&nbsp;

<a name="resolveLocationSet" href="#resolveLocationSet">#</a> <i>loco</i>.<b>resolveLocationSet</b>(<i>locationSet</i>)

Resolves a given locationSet into a GeoJSON feature.  This is similar to [validateLocationSet](#validateLocationSet), but runs slower and includes the actual GeoJSON in the result.  Results are cached, so if you ask for the same thing multiple times we don't repeat the expensive clipping operations.

The returned GeoJSON feature will also have an `area` property containing the approximate size of the feature in km².  (This is helpful for sorting features)

If the locationSet is valid, returns a result `Object` like:

```js
{
  type:         'locationset'
  locationSet:  the queried locationSet
  id:           the stable identifier for the feature
  feature:      the resolved GeoJSON feature
}
```

If the locationSet is invalid or contains any invalid locations,
* _in strict mode_, throws an error
* _in non-strict mode_, invalid locations are quietly ignored. A locationSet with nothing included will be considered valid, and will validate as if it were a locationSet covering the entire world.  `{ type: 'locationset', locationSet: ['Q2'], id: +[Q2] }`

&nbsp;

<a name="strict" href="#strict">#</a> <i>loco</i>.<b>strict</b>(<i>val</i>)

Get/set "strict mode".  New instances of LocationConflation start out in strict mode by default.

* In strict mode, any invalid location or locationSet throws an error.
* In non strict mode, invalid locations are ignored, and locationSets that include nothing are assumed to include the entire world.

```js
loco.strict(false);                // pass a true/false value to set the strict mode
const isStrict = loco.strict();    // pass no value to return the current value
```

&nbsp;

<a name="stringify" href="#stringify">#</a> <i>loco</i>.<b>stringify</b>(<i>object</i>, <i>options</i>)

Convenience method that wraps [json-stringify-pretty-compact](https://www.npmjs.com/package/@aitodotai/json-stringify-pretty-compact) to stringify the given object. Optional `options` parameter gets passed through to json-stringify-pretty-compact.

```js
loco.stringify(someGeoJson, { maxLength: 100 });    // Make it pretty!
```

<a name="cache" href="#cache">#</a> <i>loco</i>.<b>cache</b>()

Convenience method to access the internal feature `_cache`.  You probably shouldn't use it except for debugging.

&nbsp;


## Contributing

### Prerequisites

* [Node.js](https://nodejs.org/) version 10 or newer
* [`git`](https://www.atlassian.com/git/tutorials/install-git/) for your platform


### Installing

* Clone this project, for example:
  `git clone git@github.com:ideditor/location-conflation.git`
* `cd` into the project folder,
* Run `npm install` to install libraries


### Building

* `npm run build`


### Thanks!

**location-conflation** is really just a wrapper around these other great projects:
* [country-coder](https://github.com/ideditor/country-coder) for world boundaries, and
* [polygon-clipping](https://github.com/mfogel/polygon-clipping) for union/difference functions


### License

This project is available under the [ISC License](https://opensource.org/licenses/ISC).
See the [LICENSE.md](LICENSE.md) file for more details.
