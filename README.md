[![build](https://github.com/rapideditor/location-conflation/workflows/build/badge.svg)](https://github.com/rapideditor/location-conflation/actions?query=workflow%3A%22build%22)
[![npm version](https://badge.fury.io/js/%40rapideditor%2Flocation-conflation.svg)](https://badge.fury.io/js/%40rapideditor%2Flocation-conflation)


# location-conflation

🧩 Define complex geographic regions ([geofences](https://en.wikipedia.org/wiki/Geo-fence)) by including and excluding country codes and GeoJSON shapes.


### What is it?

**Location-conflation** is a tool for generating [GeoJSON](https://geojson.org/) features by
including and excluding other locations and shapes.

It is useful for generating geofences in a declarative way, so your application doesn't need
to bundle or fetch so much geodata.

⚡️ Try it now!:  https://location-conflation.com/


You can define a *locationSet* as an Object with `include` and `exclude` properties:
```js
const locationSet = {
  include: [ Array of locations ],
  exclude: [ Array of locations ]
};
```

The "locations" can be any of the following:

- Strings recognized by the [country-coder library](https://github.com/rapideditor/country-coder#readme).<br/>
  These include [ISO 3166-1 2 or 3 letter country codes](https://en.wikipedia.org/wiki/List_of_countries_by_United_Nations_geoscheme), [UN M.49 numeric codes](https://en.wikipedia.org/wiki/UN_M49), and supported Wikidata QIDs.<br/>
  _Examples: `"de"`, `"001"`, `"conus"`, `"gb-sct"`, `"Q620634"`_<br/>
  👉 A current list of supported codes can be found at <https://ideditor.codes>

- Filenames for custom `.geojson` features. If you want to use your own features, pass them to the LocationConflation constructor in a `FeatureCollection`<br/>
  Each `Feature` must have an `id` that ends in `.geojson`.<br/>
  _Examples: `"de-hamburg.geojson"`, `"new_jersey.geojson"`_

- Circular areas defined as `[longitude, latitude, radius?]` Array.<br/>
  Radius is specified in kilometers and is optional. If not specified, it will default to a 25km radius.<br/>
  _Examples: `[8.67039, 49.41882]`, `[-88.3726, 39.4818, 32]`_


## Installing

### Use in Node

`npm install @rapideditor/location-conflation`

**location-conflation** is distributed in CJS and ESM module formats for maximum compatibility. ([Read more about Javascript module formats](https://dev.to/iggredible/what-the-heck-are-cjs-amd-umd-and-esm-ikm))


```js
const LocationConflation = require('@rapideditor/location-conflation');  // require CJS
// or
import { LocationConflation } from '@rapideditor/location-conflation';   // import ESM
```


### Use in Browsers

You can also use **location-conflation** directly in a web browser.  A good way to do this is to fetch the ["iife"](https://esbuild.github.io/api/#format-iife) bundle from the [jsDelivr CDN](https://www.jsdelivr.com/), which can even deliver minified versions.

When you load this file in a `<script>` tag, you'll get a `LocationConflation` global to use elsewhere in your scripts:
```html
<head>
<script src="https://cdn.jsdelivr.net/npm/@rapideditor/location-conflation@latest/dist/js/location-conflation.iife.min.js"></script>
</head>
…
<script>
  var loco = new LocationConflation();
</script>
```

👉 This project uses modern JavaScript syntax for use in supported node versions and modern browsers.  If you need support for legacy environments like ES5 or Internet Explorer, you'll need to build your own bundle with something like [Babel](https://babeljs.io/docs/en/index.html).


&nbsp;

## Examples
```js
import { LocationConflation } from '@rapideditor/location-conflation';
import myFeatures from './fixtures/features.json' with {type: 'json'};  // optional
const loco = new LocationConflation(myFeatures);
```

#### Southern Europe:
```js
const locationSet = { include: ['039'] };    // 039 = Southern Europe
const result = loco.resolveLocationSet(locationSet);
```
<img width="800px" alt="Southern Europe" src="https://raw.githubusercontent.com/rapideditor/location-conflation/main/docs/images/example1.png"/>


#### Southern Europe and Northern Africa:
```js
const locationSet = { include: ['039','015'] };   // 015 = Northern Africa
const result = loco.resolveLocationSet(locationSet);
```
<img width="800px" alt="Southern Europe and Northern Africa" src="https://raw.githubusercontent.com/rapideditor/location-conflation/main/docs/images/example2.png"/>


#### Southern Europe and Northern Africa, _excluding_ Egypt and Sudan:
```js
const locationSet = { include: ['039','015'], exclude: ['eg','sd'] };
const result = loco.resolveLocationSet(locationSet);
```
<img width="800px" alt="Southern Europe and Northern Africa, excluding Egypt and Sudan" src="https://raw.githubusercontent.com/rapideditor/location-conflation/main/docs/images/example3.png"/>


#### The Alps, _excluding_ Liechtenstein and regions around Bern and Zürich
```js
const result = loco.resolveLocationSet({ include: ['alps.geojson'], exclude: ['li', [8.55,47.36], [7.45,46.95]] });
```
<img width="800px" alt="The Alps, excluding Liechtenstein and regions around Bern and Zürich" src="https://raw.githubusercontent.com/rapideditor/location-conflation/main/docs/images/example4.png"/>


&nbsp;

## API Reference

* [constructor](#constructor)
* [addFeatures](#addfeatures)
* [removeFeatures](#removefeatures)
* [clearFeatures](#clearfeatures)
* [_cache (deprecated)](#_cache-deprecated)
* [validateLocation](#validateLocation)
* [validateLocationSet](#validateLocationSet)
* [resolveLocation](#resolveLocation)
* [resolveLocationSet](#resolveLocationSet)
* [registerLocationSets](#registerlocationsets)
* [rebuildIndex](#rebuildindex)
* [locationSetsAt](#locationsetsat)
* [stringify](#stringify)

&nbsp;

<a name="constructor" href="#constructor">#</a> const <i>loco</i> = new <b>LocationConflation</b>(<i>featureCollection</i>)

Constructs a new LocationConflation instance.

Optionally pass a GeoJSON `FeatureCollection` of custom features which can be referred to later as locations.

Each feature *must* have a filename-like `id`, for example: `new_jersey.geojson`
```js
{
  "type": "FeatureCollection"
  "features": [
    {
      "type": "Feature",
      "id": "new_jersey.geojson",
      "properties": { … },
      "geometry": { … }
    }
  ]
}
```

&nbsp;

<a name="addfeatures" href="#addfeatures">#</a> <i>loco</i>.<b>addFeatures</b>(<i>featureCollection</i>)

Adds custom `.geojson` features into the internal resolved cache.

Each feature must include an `id` ending in `.geojson` (on either `feature.id` or `feature.properties.id`).
IDs are normalized to lowercase.

&nbsp;

<a name="removefeatures" href="#removefeatures">#</a> <i>loco</i>.<b>removeFeatures</b>(<i>...ids</i>)

Removes custom `.geojson` features by id (case-insensitive).
Non-`.geojson` ids are ignored.

&nbsp;

<a name="clearfeatures" href="#clearfeatures">#</a> <i>loco</i>.<b>clearFeatures</b>()

Clears all resolved-cache entries and re-seeds world fallbacks (`Q2` and `+[Q2]`).

&nbsp;

<a name="_cache-deprecated" href="#_cache-deprecated">#</a> <i>loco</i>.<b>_cache</b>

Backward-compatibility getter for the internal resolved cache (`Map`).

⚠️ Deprecated: prefer API methods like `addFeatures`, `removeFeatures`, `clearFeatures`, `resolveLocation`, and `resolveLocationSet`.

&nbsp;

<a name="validateLocation" href="#validateLocation">#</a> <i>loco</i>.<b>validateLocation</b>(<i>location</i>)

Validates a given location. The "locations" can be:
- Strings recognized by the [country-coder library](https://github.com/rapideditor/country-coder#readme). <br/>
  👉 A current list of supported codes can be found at <https://ideditor.codes><br/>
  _Examples: `"de"`, `"001"`, `"conus"`, `"gb-sct"`, `"Q620634"`_

- Filename-like identifiers of custom `.geojson` features. <br/>
  _Examples: `"de-hamburg.geojson"`, `"new_jersey.geojson"`_

- Circular areas defined as `[longitude, latitude, radius?]` Array.<br/>
  Radius is specified in kilometers and is optional. If not specified, it will default to a 25km radius.<br/>
  _Examples: `[8.67039, 49.41882]`, `[-88.3726, 39.4818, 32]`_


If the location is valid, returns a result `Object` like:
```js
{
  type:     'point', 'geojson', or 'countrycoder'
  location:  the queried location
  id:        the stable identifier for the feature
}
```

If the location is invalid, throws an error.

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

If the locationSet is invalid or contains any invalid locations, throws an error.

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

If the location is invalid, throws an error.

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

If the locationSet is invalid or contains any invalid locations, throws an error.

&nbsp;

<a name="registerlocationsets" href="#registerlocationsets">#</a> <i>loco</i>.<b>registerLocationSets</b>(<i>objects</i>)

Builds an inverted spatial index from objects that contain `locationSet` values.
Each object receives a `locationSetID` property.

Unlike the single-item `validate*`/`resolve*` methods, this method is **tolerant** of bad input so that a batch of thousands of presets won't be rejected over a single typo:
* Objects with a missing, empty, or invalid `locationSet` fall back to world (`+[Q2]`).
* Individual invalid `include`/`exclude` components are silently ignored.

This method accumulates: multiple calls add to the same index.

&nbsp;

<a name="rebuildindex" href="#rebuildindex">#</a> <i>loco</i>.<b>rebuildIndex</b>()

Rebuilds the internal spatial index from currently indexed locationSets and cached features.
Call this after adding/removing custom features if they are already referenced by indexed locationSets.

&nbsp;

<a name="locationsetsat" href="#locationsetsat">#</a> <i>loco</i>.<b>locationSetsAt</b>(<i>[lon, lat]</i>)

Returns matching `locationSetID` values for a point.
Results are sorted by approximate area ascending (smallest / most specific first).

&nbsp;

<a name="stringify" href="#stringify">#</a> <b>LocationConflation.stringify</b>(<i>object</i>, <i>options</i>)

Convenience method that wraps [json-stringify-pretty-compact](https://github.com/lydell/json-stringify-pretty-compact) to stringify the given object. Optional `options` parameter gets passed through to json-stringify-pretty-compact.

```js
LocationConflation.stringify(someGeoJson, { maxLength: 100 });    // Make it pretty!
```

&nbsp;


## Contributing

See the [CONTRIBUTING.md](CONTRIBUTING.md) file for more info.

&nbsp;


### Thanks!

**location-conflation** is really just a wrapper around these other great projects:
* [country-coder](https://github.com/rapideditor/country-coder) for world boundaries, and
* [polyclip-ts](https://github.com/luizbarboza/polyclip-ts) for union/difference functions


### License

This project is available under the [ISC License](https://opensource.org/licenses/ISC).
See the [LICENSE.md](LICENSE.md) file for more details.
