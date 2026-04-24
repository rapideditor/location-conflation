# API Reference

Full reference for the `LocationConflation` class.

For a quick start, see the [README](README.md).

## Contents

**Constructor & feature management**
- [`new LocationConflation(featureCollection?)`](#constructor)
- [`addFeatures(featureCollection)`](#addfeatures)
- [`removeFeatures(...ids)`](#removefeatures)
- [`clearFeatures()`](#clearfeatures)
- [`_cache`](#_cache) — deprecated

**Validation & resolution**
- [`validateLocation(location)`](#validatelocation)
- [`validateLocationSet(locationSet)`](#validatelocationset)
- [`resolveLocation(location)`](#resolvelocation)
- [`resolveLocationSet(locationSet)`](#resolvelocationset)

**Spatial index**
- [`registerLocationSets(objects)`](#registerlocationsets)
- [`rebuildIndex()`](#rebuildindex)
- [`locationSetsAt([lon, lat])`](#locationsetsat)
- [`getLocationSetArea(locationSetID)`](#getlocationsetarea)

**Static helpers**
- [`LocationConflation.stringify(object, options?)`](#stringify)

---

## Constructor

### `new LocationConflation(featureCollection?)`

Constructs a new `LocationConflation` instance.

Optionally pass a GeoJSON `FeatureCollection` of custom features that can be referenced later as locations. Each feature **must** have a filename-like `id` ending in `.geojson` (on either `feature.id` or `feature.properties.id`). IDs are normalized to lowercase.

> [!NOTE]
> The world locationSet (`+[Q2]`) is automatically registered on construction, so `locationSetsAt()` will return valid results for any point immediately — even before you call `registerLocationSets()` yourself.

```js
{
  "type": "FeatureCollection",
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

---

## Feature management

### `addFeatures`

```ts
loco.addFeatures(featureCollection: GeoJSON.FeatureCollection): void
```

Adds custom `.geojson` features into the internal resolved cache. Each feature must include an `id` ending in `.geojson`.

### `removeFeatures`

```ts
loco.removeFeatures(...ids: string[]): void
```

Removes custom `.geojson` features by id (case-insensitive). Non-`.geojson` ids are ignored.

### `clearFeatures`

```ts
loco.clearFeatures(): void
```

Clears all resolved-cache entries (`_resolved`) and re-seeds the world location and locationSet.

> [!NOTE]
> This method does **not** clear registered locationSets in the spatial index. To reset the index entirely, create a new `LocationConflation` instance. To clear custom `.geojson` features while keeping registered locationSets, call `removeFeatures(...)` selectively.

### `_cache`

> [!WARNING]
> **Deprecated.** Prefer the `addFeatures` / `removeFeatures` / `clearFeatures` / `resolveLocation` / `resolveLocationSet` methods. This getter is retained only for backward compatibility with existing downstream code.

Backward-compatibility getter exposing the internal resolved cache as a `Map`.

---

## Validation & resolution

### `validateLocation`

```ts
loco.validateLocation(location: Location): ValidatedLocation
```

Validates a single location. Throws if the location is invalid.

A **location** can be any of:

| Kind | Example | Notes |
|---|---|---|
| country-coder identifier | `"de"`, `"001"`, `"conus"`, `"gb-sct"`, `"Q620634"` | See [country-coder](https://github.com/rapideditor/country-coder#readme). Full list at <https://ideditor.codes>. |
| Custom `.geojson` filename | `"new_jersey.geojson"` | Must have been passed to the constructor or `addFeatures`. |
| Point with radius | `[8.67, 49.42]`, `[-88.37, 39.48, 32]` | `[lon, lat, radius?]`. Radius in km; defaults to 25. |

> [!WARNING]
> For numeric-looking country-coder identifiers, pass strings like `"001"` and `"039"`.
> Avoid using numeric identifiers in JavaScript, because leading-zero values may be treated like octal numbers and represent a different number than you expect.

On success, returns:

```js
{
  type: 'point' | 'geojson' | 'countrycoder',
  location: /* the queried location */,
  id: /* stable identifier */
}
```

### `validateLocationSet`

```ts
loco.validateLocationSet(locationSet: LocationSet): ValidatedLocationSet
```

Validates a locationSet. Throws if the locationSet or any of its components are invalid.

```js
{
  include: [ /* locations */ ],
  exclude: [ /* locations */ ]
}
```

On success, returns:

```js
{
  type: 'locationset',
  locationSet: /* the queried locationSet */,
  id: /* stable identifier */
}
```

### `resolveLocation`

```ts
loco.resolveLocation(location: Location): ResolvedLocation
```

Like `validateLocation`, but also returns the resolved GeoJSON feature. Results are cached.

> [!NOTE]
> The returned feature has an `area` property (approximate km²) attached to its `properties`, which is useful for sorting.

On success, returns the same shape as `validateLocation` plus a `feature` field containing the resolved GeoJSON.

### `resolveLocationSet`

```ts
loco.resolveLocationSet(locationSet: LocationSet): ResolvedLocationSet
```

Like `validateLocationSet`, but runs the polygon-clipping operations and returns the resulting GeoJSON feature. Results are cached.

---

## Spatial index

> [!TIP]
> The spatial index makes point-in-polygon lookups against many locationSets cheap. Register once up front, then query with `locationSetsAt` as often as you like — no polygon clipping happens during lookup.

### `registerLocationSets`

```ts
loco.registerLocationSets<T extends HasLocationSet>(objects: T[]): (T & HasLocationSetID)[]
```

Builds an inverted spatial index from objects that contain a `locationSet` property. Each object is annotated with a stable `locationSetID` and returned.

> [!IMPORTANT]
> Unlike the single-item `validate*` / `resolve*` methods, this method is **tolerant** of bad input so a batch of thousands of presets won't be rejected over a single typo:
> - Objects with a missing, empty, or invalid `locationSet` fall back to world (`+[Q2]`).
> - Individual invalid `include`/`exclude` components are silently ignored.

This method **accumulates** — calling it multiple times adds to the same index. To reset, construct a new `LocationConflation` instance.

```js
const presets = [
  { id: 'amenity/cafe', locationSet: { include: ['de'] } },
  { id: 'amenity/atm',  locationSet: { include: ['001'] } },
];
loco.registerLocationSets(presets);
// presets[0].locationSetID === '+[Q183]'
// presets[1].locationSetID === '+[Q2]'
```

### `rebuildIndex`

```ts
loco.rebuildIndex(): void
```

Rebuilds the internal spatial index from currently indexed locationSets and cached features.

> [!NOTE]
> Normally you don't need to call this yourself — `registerLocationSets`, `addFeatures`, `removeFeatures`, and `clearFeatures` all rebuild the index automatically.

### `locationSetsAt`

```ts
loco.locationSetsAt(point: Vec2): Map<LocationSetID, number>
```

Returns a `Map` of the indexed locationSets whose resolved area covers the point `[lon, lat]`, mapped to their approximate area in km².

Returning a `Map` gives callers O(1) `has(locationSetID)` membership tests — the common "is this locationSet valid here?" check — without a linear array scan. Results are not sorted; sort `[...result.entries()]` by value if you need that.

```js
loco.registerLocationSets(presets);
const hits = loco.locationSetsAt([-75.16, 39.95]);
if (hits.has('+[Q30]')) { /* US preset applies here */ }
// Iterate smallest-first:
const sorted = [...hits.entries()].sort((a, b) => a[1] - b[1]);
```

### `getLocationSetArea`

```ts
loco.getLocationSetArea(locationSetID: LocationSetID): number | undefined
```

Returns the approximate area (in km²) of an indexed locationSet, or `undefined` if it has not been indexed.

> [!NOTE]
> The area is the sum of `include` component areas computed during `registerLocationSets`. It does not subtract `exclude` areas.

---

## Static helpers

### `stringify`

```ts
LocationConflation.stringify(obj: unknown, options?: StringifyOptions): string
```

Convenience wrapper around [json-stringify-pretty-compact](https://github.com/lydell/json-stringify-pretty-compact). `options` are passed through.

```js
LocationConflation.stringify(someGeoJson, { maxLength: 100 });
```
