[![build](https://github.com/rapideditor/location-conflation/workflows/build/badge.svg)](https://github.com/rapideditor/location-conflation/actions?query=workflow%3A%22build%22)
[![npm version](https://badge.fury.io/js/%40rapideditor%2Flocation-conflation.svg)](https://badge.fury.io/js/%40rapideditor%2Flocation-conflation)


# location-conflation

🧩 Define complex geographic regions ([geofences](https://en.wikipedia.org/wiki/Geo-fence)) by including and excluding country codes and GeoJSON shapes.

⚡️ Try it live at **<https://location-conflation.com/>**

---

## What is it?

**location-conflation** generates [GeoJSON](https://geojson.org/) features by combining other locations and shapes. It's a declarative way to describe geofences, so your application doesn't need to bundle or fetch large amounts of geodata.

A **locationSet** is an object with `include` and `exclude` arrays:

```js
const locationSet = {
  include: [ /* locations */ ],
  exclude: [ /* locations */ ]
};
```

A **location** can be any of:

| Kind | Example |
|---|---|
| A [country-coder](https://github.com/rapideditor/country-coder#readme) identifier (ISO codes, UN M.49 codes, Wikidata QIDs, etc.) | `"de"`, `"001"`, `"conus"`, `"gb-sct"`, `"Q620634"` |
| A custom `.geojson` filename (add custom features via the constructor or `addFeatures`) | `"de-hamburg.geojson"`, `"new_jersey.geojson"` |
| A circular area `[lon, lat, radius?]` (radius in km, defaults to 25) | `[8.67039, 49.41882]`, `[-88.3726, 39.4818, 32]` |

> [!TIP]
> The full list of recognized country-coder identifiers is browsable at <https://ideditor.codes>.

---

## Installing

### Node

```bash
npm install @rapideditor/location-conflation
```

The package is distributed as both CJS and ESM:

```js
const { LocationConflation } = require('@rapideditor/location-conflation');   // CJS
// or
import { LocationConflation } from '@rapideditor/location-conflation';        // ESM
```

### Browser

Fetch the [IIFE bundle](https://esbuild.github.io/api/#format-iife) from the [jsDelivr CDN](https://www.jsdelivr.com/). Loading it via `<script>` exposes a `LocationConflation` global:

```html
<script src="https://cdn.jsdelivr.net/npm/@rapideditor/location-conflation@latest/dist/js/location-conflation.iife.min.js"></script>
<script>
  const loco = new LocationConflation();
</script>
```

> [!NOTE]
> This project uses modern TypeScript syntax. If you need to support legacy environments like ES5 or Internet Explorer, build your own bundle with a tool like [Babel](https://babeljs.io/).

---

## Examples

```js
import { LocationConflation } from '@rapideditor/location-conflation';
import myFeatures from './fixtures/features.json' with { type: 'json' };   // optional
const loco = new LocationConflation(myFeatures);
```

### Southern Europe

```js
const result = loco.resolveLocationSet({ include: ['039'] });   // 039 = Southern Europe
```

<img width="800px" alt="Southern Europe" src="https://raw.githubusercontent.com/rapideditor/location-conflation/main/docs/images/example1.png"/>

### Southern Europe and Northern Africa

```js
const result = loco.resolveLocationSet({ include: ['039', '015'] });   // 015 = Northern Africa
```

<img width="800px" alt="Southern Europe and Northern Africa" src="https://raw.githubusercontent.com/rapideditor/location-conflation/main/docs/images/example2.png"/>

### Southern Europe and Northern Africa, _excluding_ Egypt and Sudan

```js
const result = loco.resolveLocationSet({ include: ['039', '015'], exclude: ['eg', 'sd'] });
```

<img width="800px" alt="Southern Europe and Northern Africa, excluding Egypt and Sudan" src="https://raw.githubusercontent.com/rapideditor/location-conflation/main/docs/images/example3.png"/>

### The Alps, _excluding_ Liechtenstein and regions around Bern and Zürich

```js
const result = loco.resolveLocationSet({
  include: ['alps.geojson'],
  exclude: ['li', [8.55, 47.36], [7.45, 46.95]]
});
```

<img width="800px" alt="The Alps, excluding Liechtenstein and regions around Bern and Zürich" src="https://raw.githubusercontent.com/rapideditor/location-conflation/main/docs/images/example4.png"/>

---

## Spatial index

If your application has many objects with `locationSet` values (e.g. presets, rules, rendering styles) and you need to test *which of them apply at a given point*, the spatial-index API makes that lookup fast.

Register your objects once:

```js
const presets = [
  { id: 'amenity/cafe', locationSet: { include: ['de'] } },
  { id: 'amenity/atm',  locationSet: { include: ['001'] } },      // 001 = world
  { id: 'parking/bike', locationSet: { include: ['us-nj.geojson'] } },
];
loco.registerLocationSets(presets);
// Each preset now has a stable `locationSetID`, e.g. '+[Q183]'
```

Then query by point as often as you like:

```js
const hits = loco.locationSetsAt([8.68, 49.41]);   // Heidelberg
// => Map { '+[Q183]' => 357386, '+[Q2]' => 511207893 }
if (hits.has('+[Q183]')) { /* Germany preset applies here */ }
```

> [!NOTE]
> `locationSetsAt` does **no** polygon clipping — lookups are backed by [country-coder](https://github.com/rapideditor/country-coder)'s built-in spatial index for country-coder regions, and by [which-polygon](https://github.com/mapbox/which-polygon) for custom `.geojson` and point-radius features.

> [!IMPORTANT]
> `registerLocationSets` is **tolerant** of bad input so a batch of thousands of objects won't be rejected over a single typo:
> - Objects with a missing, empty, or invalid `locationSet` fall back to world (`+[Q2]`).
> - Individual invalid `include`/`exclude` components are silently ignored.
>
> The single-item `validate*` / `resolve*` methods, by contrast, always throw on invalid input.

See the [API reference](API.md#spatial-index) for full details on `registerLocationSets`, `locationSetsAt`, `rebuildIndex`, and `getLocationSetArea`.

---

## API

Full reference: **[API.md](API.md)**

| Method | Purpose |
|---|---|
| [`new LocationConflation(features?)`](API.md#constructor) | Construct an instance, optionally seeded with custom `.geojson` features. |
| [`addFeatures`](API.md#addfeatures) / [`removeFeatures`](API.md#removefeatures) / [`clearFeatures`](API.md#clearfeatures) | Manage the custom feature cache. |
| [`validateLocation`](API.md#validatelocation) / [`validateLocationSet`](API.md#validatelocationset) | Validate without resolving geometry. |
| [`resolveLocation`](API.md#resolvelocation) / [`resolveLocationSet`](API.md#resolvelocationset) | Validate and resolve to GeoJSON (cached). |
| [`registerLocationSets`](API.md#registerlocationsets) | Register `locationSet`-bearing objects for fast point-in-polygon lookups. |
| [`locationSetsAt`](API.md#locationsetsat) | Query which indexed locationSets cover a point. |
| [`rebuildIndex`](API.md#rebuildindex) / [`getLocationSetArea`](API.md#getlocationsetarea) | Spatial-index maintenance / inspection. |
| [`LocationConflation.stringify`](API.md#stringify) | Pretty-print GeoJSON with sensible defaults. |

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

### Thanks!

**location-conflation** is really a thin wrapper around these other great projects:

- [country-coder](https://github.com/rapideditor/country-coder) — world boundaries
- [polyclip-ts](https://github.com/luizbarboza/polyclip-ts) — polygon union / difference
- [which-polygon](https://github.com/mapbox/which-polygon) — spatial index for custom shapes

### License

Available under the [ISC License](https://opensource.org/licenses/ISC). See [LICENSE.md](LICENSE.md).
