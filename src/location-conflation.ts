import * as CountryCoder from '@rapideditor/country-coder';
import * as Polyclip from 'polyclip-ts';
import calcArea from '@mapbox/geojson-area';
import circleToPolygon from 'circle-to-polygon';
import precision from 'geojson-precision';
import prettyStringify from 'json-stringify-pretty-compact';
import whichPolygon from 'which-polygon';
import type { Geom } from 'polyclip-ts';

import type {
  HasLocationSet,
  HasLocationSetID,
  LocoFeature,
  LocoProperties,
  Location,
  LocationID,
  LocationSet,
  LocationSetID,
  ResolvedLocation,
  ResolvedLocationSet,
  StringifyOptions,
  ValidatedLocation,
  ValidatedLocationSet,
  Vec2,
} from './types.ts';


// Re-export everything from types.ts so consumers can `import { … } from '@rapideditor/location-conflation'`
export type * from './types.ts';


// Template "world" features always available in the cache.
const WORLD_GEOMETRY: GeoJSON.Polygon = {
  type: 'Polygon',
  coordinates: [[[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]]],
};

// 'Q2' - A Location representing the entire world.
const WORLD_LOCATION: LocoFeature = {
  type: 'Feature',
  id: 'Q2',
  properties: { id: 'Q2', area: _getArea(WORLD_GEOMETRY) },
  geometry: WORLD_GEOMETRY
};


/**
 * LocationConflation lets you define complex geographic regions by including and
 * excluding country codes, points, and custom `.geojson` shapes.
 *
 * It resolves these definitions into GeoJSON `Feature`s with polygon geometries,
 * caching expensive polygon-clipping operations for performance.
 *
 * @example
 * ```ts
 * import { LocationConflation } from '@rapideditor/location-conflation';
 *
 * const loco = new LocationConflation(myFeatureCollection);
 *
 * const result = loco.resolveLocationSet({ include: ['de'], exclude: ['de-berlin.geojson'] });
 * console.log(result.feature);  // GeoJSON Feature of Germany minus Berlin
 * ```
 */
export class LocationConflation {
  /**
   * Internal cache of resolved features, keyed by stable identifiers.
   * Identifiers look like:
   * - `'[8.67039,49.41882]'` — point locations
   * - `'de-hamburg.geojson'` — geojson file locations
   * - `'Q2'` — country-coder locations (Wikidata QIDs)
   * - `'+[Q2]-[Q18,Q27611]'` — aggregated location sets
   */
  private _resolved: Map<string, LocoFeature>;

  // Spatial index state, built by `registerLocationSets()` and rebuilt by `rebuildIndex()`.
  //
  // Inverted index: locationID → Set of locationSetIDs that include/exclude that component location.
  // Reads as English: "the sets including this location" / "the sets excluding this location".
  private _setsIncluding: Map<LocationID, Set<LocationSetID>>;
  private _setsExcluding: Map<LocationID, Set<LocationSetID>>;
  // locationSetID → approximate area in km² (used for sorting locationSetsAt results).
  private _setAreas: Map<LocationSetID, number>;
  // Spatial index for custom .geojson and point-radius features only.
  // CountryCoder regions are looked up via CountryCoder's own spatial index.
  private _spatialIndex: ReturnType<typeof whichPolygon<{ id: string }>> | null;


  /**
   * @constructor
   * Creates a new LocationConflation instance.
   * @param fc - Optional GeoJSON FeatureCollection of known features with filename-like IDs
   *   (e.g. `"something.geojson"`).  Accepts a standard `GeoJSON.FeatureCollection` from
   *   `@types/geojson` — no casts needed.  Features without a `.geojson` id are silently skipped.
   */
  constructor(fc?: GeoJSON.FeatureCollection) {
    this._resolved = new Map();
    this._setsIncluding = new Map();
    this._setsExcluding = new Map();
    this._setAreas = new Map();
    this._spatialIndex = null;

    // Load any .geojson features from the input FeatureCollection.
    if (fc) {
      this.addFeatures(fc);
    }

    // Seed the resolved cache with the world Location and LocationSet, always available as fallback.
    this._resolved.set('Q2', structuredClone(WORLD_LOCATION));
  }


  /**
   * Adds `.geojson` features to the cache of known locations.
   *
   * Each feature must have a filename-like `id` ending in `.geojson` (either on
   * the feature itself or in its `properties`).  Features without a qualifying
   * `id` are silently skipped.
   *
   * The method normalizes each feature into the {@link LocoFeature} shape
   * (lowercased id, guaranteed `area` property, polygon geometry).  If a
   * feature with the same id already exists in the cache, it is replaced.
   *
   * @param fc - A GeoJSON FeatureCollection containing custom locations.
   *   Accepts a standard `GeoJSON.FeatureCollection` — no casts needed.
   *
   * @example
   * ```ts
   * // Load additional features after construction
   * const loco = new LocationConflation();
   * loco.addFeatures(additionalFeatureCollection);
   *
   * // Now these features are available for resolving
   * const result = loco.resolveLocation('philly_metro.geojson');
   * ```
   */
  addFeatures(fc: GeoJSON.FeatureCollection): void {
    if (fc?.type !== 'FeatureCollection' || !Array.isArray(fc.features)) return;

    for (const feature of fc.features) {
      const props = feature.properties ?? {};

      // Get `id` from either `id` or `properties.id`
      // Features without a valid id are silently skipped.
      let id = feature.id ?? props['id'];
      if (!id || !/^\S+\.geojson$/i.test(String(id))) continue;

      // Ensure `id` exists and is lowercase
      id = String(id).toLowerCase();

      const geometry = feature.geometry as GeoJSON.Polygon | GeoJSON.MultiPolygon;

      // Ensure `area` property exists
      // The purpose of the `area` property is to enable rough size comparisons.
      const existingArea = props['area'] as number | undefined;
      const area = existingArea || _getArea(geometry);

      const lcFeature: LocoFeature = {
        type: 'Feature',
        id,
        properties: { ...props, id, area } as LocoProperties,
        geometry,
      };

      this._resolved.set(id, lcFeature);
    }

    // If any locationSets have been registered, the spatial index may now be stale.
    if (this._setAreas.size > 0) this.rebuildIndex();
  }


  /**
   * Removes `.geojson` features from the cache by id.
   * Each id should be a filename-like string ending in `.geojson`.
   * Ids are matched case-insensitively (lowercased before lookup).
   * Non-`.geojson` ids and ids not present in the cache are silently ignored.
   *
   * @param ids - One or more feature ids to remove.
   *
   * @example
   * ```ts
   * loco.removeFeatures('philly_metro.geojson', 'dc_metro.geojson');
   * ```
   */
  removeFeatures(...ids: string[]): void {
    for (const id of ids) {
      if (!/^\S+\.geojson$/i.test(id)) continue;
      this._resolved.delete(id.toLowerCase());
    }

    // If any locationSets have been registered, the spatial index may now be stale.
    if (this._setAreas.size > 0) this.rebuildIndex();
  }


  /**
   * Removes all cached features.
   * This clears everything from the cache — `.geojson` features, resolved
   * country-coder features, point circles, and aggregated location sets.
   * The world feature (`Q2`) is re-added automatically.
   *
   * @example
   * ```ts
   * loco.clearFeatures();
   * // Cache now contains only the world feature (Q2)
   * ```
   */
  clearFeatures(): void {
    this._resolved.clear();

    // Seed the resolved cache with the world Location and LocationSet, always available as fallback.
    this._resolved.set('Q2', structuredClone(WORLD_LOCATION));

    // If any locationSets have been registered, the spatial index may now be stale.
    if (this._setAreas.size > 0) this.rebuildIndex();
  }


  /**
   * Backward-compatibility alias to access the internal resolved-feature cache.
   * @deprecated Use the LocationConflation APIs instead (`addFeatures`, `removeFeatures`, `clearFeatures`).
   */
  public get _cache(): Map<string, LocoFeature> {
    return this._resolved;
  }


  /**
   * Validates a location and returns its type and stable identifier.
   * @param location - Location to validate (point, geojson filename, or country code)
   * @returns Validated location object
   * @throws  Throws Error if the given location is invalid.
   *
   * @example
   * ```typescript
   * // Point location with default 25km radius
   * loco.validateLocation([8.67039, 49.41882]);
   * // => { type: 'point', location: [8.67039, 49.41882], id: '[8.67039,49.41882]' }
   *
   * // Point location with custom radius
   * loco.validateLocation([-77.0369, 38.9072, 10]);
   * // => { type: 'point', location: [-77.0369, 38.9072, 10], id: '[-77.0369,38.9072,10]' }
   *
   * // Country code
   * loco.validateLocation('de');
   * // => { type: 'countrycoder', location: 'de', id: 'Q183' }
   *
   * // GeoJSON file
   * loco.validateLocation('philly_metro.geojson');
   * // => { type: 'geojson', location: 'philly_metro.geojson', id: 'philly_metro.geojson' }
   * ```
   */
  validateLocation(location: Location): ValidatedLocation {
    // [lon, lat] or [lon, lat, radius] point?
    if (Array.isArray(location) && (location.length === 2 || location.length === 3)) {
      const lon = location[0];
      const lat = location[1];
      const radius = location[2];

      if (
        Number.isFinite(lon) &&
        lon >= -180 &&
        lon <= 180 &&
        Number.isFinite(lat) &&
        lat >= -90 &&
        lat <= 90 &&
        (location.length === 2 || (radius !== undefined && Number.isFinite(radius) && radius > 0))
      ) {
        const id = '[' + location.toString() + ']';
        return { type: 'point', location, id };
      }
    } else if (typeof location === 'string' && /^\S+\.geojson$/i.test(location)) {
      // a .geojson filename?
      const id = location.toLowerCase();
      if (this._resolved.has(id)) {
        return { type: 'geojson', location, id };
      }
    } else if (typeof location === 'string' || typeof location === 'number') {
      // a country-coder value?
      const feature = CountryCoder.feature(location);
      if (feature) {
        // Use wikidata QID as the identifier, since that seems to be the one
        // property that everything in CountryCoder is guaranteed to have.
        const id = feature.properties.wikidata;
        return { type: 'countrycoder', location, id };
      }
    }

    throw new Error(`validateLocation:  Invalid location: "${location}".`);
  }


  /**
   * Resolves a location to a GeoJSON feature.
   * @param location - Location to resolve
   * @returns Resolved location with GeoJSON feature
   * @throws  Throws Error if the given location is invalid or cannot be resolved.
   *
   * @example
   * ```typescript
   * // Resolve a point location to a circular polygon
   * const result = loco.resolveLocation([8.67039, 49.41882]);
   * // result.feature is a GeoJSON Feature with a circular Polygon geometry
   *
   * // Resolve a country code
   * const germany = loco.resolveLocation('de');
   * // germany.feature is a GeoJSON Feature with Germany's boundary
   *
   * // Resolve a custom GeoJSON file
   * const metro = loco.resolveLocation('philly_metro.geojson');
   * // metro.feature is the pre-loaded GeoJSON Feature
   * ```
   */
  resolveLocation(location: Location): ResolvedLocation {
    const valid = this.validateLocation(location);
    const id = valid.id;

    // Return a result from cache if we can.
    // (.geojson features are always in _resolvedLocations — they were loaded in the constructor.)
    if (this._resolved.has(id)) {
      return { ...valid, feature: this._resolved.get(id)! };
    }

    // A [lon,lat] coordinate pair?
    if (valid.type === 'point' && Array.isArray(location)) {
      const lon = location[0];
      const lat = location[1];
      const radius = location[2] || 25;  // km
      const EDGES = 10;
      const PRECISION = 3;
      const area = Math.PI * radius * radius;   // km²
      const feature: LocoFeature = precision(
        {
          type: 'Feature',
          id,
          properties: { id, area: Number(area.toFixed(2)) },
          geometry: circleToPolygon([lon, lat], radius * 1000, EDGES),  // km to m
        },
        PRECISION
      );
      this._resolved.set(id, feature);
      return { ...valid, feature };
    }

    // A country-coder identifier?
    if (valid.type === 'countrycoder') {
      // id is a wikidata QID that validateLocation already confirmed exists in CountryCoder
      const ccFeature = CountryCoder.feature(id)!;
      const ccProps = ccFeature.properties;
      let geometry: GeoJSON.Polygon | GeoJSON.MultiPolygon | undefined;

      // -> This block of code is weird and requires some explanation. <-
      // CountryCoder includes higher level features which are made up of members.
      // These features don't have their own geometry, but CountryCoder provides an
      //   `aggregateFeature` method to combine these members into a MultiPolygon.
      // In the past, Turf/JSTS/martinez could not handle the aggregated features,
      //   so we'd iteratively union them all together.  (this was slow)
      // But now mfogel/polygon-clipping handles these MultiPolygons like a boss.
      // This approach also has the benefit of removing all the internal borders and
      //   simplifying the regional polygons a lot.
      if (Array.isArray(ccProps.members)) {
        const aggregate = CountryCoder.aggregateFeature(id);
        if (aggregate) {
          const clipped = _clip([{
            type: 'Feature',
            id: '',
            properties: {} as LocoProperties,
            geometry: aggregate.geometry as GeoJSON.Polygon | GeoJSON.MultiPolygon,
          }], 'UNION');
          if (clipped) {
            geometry = clipped.geometry;
          }
        }
      }

      // Clone geometry so we never hold a reference to CountryCoder's internal data.
      // Skip the clone for aggregate features — clip() already produced a fresh geometry.
      if (!geometry) {
        geometry = structuredClone(ccFeature.geometry) as GeoJSON.Polygon | GeoJSON.MultiPolygon;
      }

      // Ensure `area` property exists
      const area = _getArea(geometry);

      const feature: LocoFeature = {
        type: 'Feature',
        id,
        properties: { id, area } as LocoProperties,
        geometry,
      };

      this._resolved.set(id, feature);
      return { ...valid, feature };
    }

    throw new Error(`resolveLocation:  Couldn't resolve location "${location}".`);
  }


  /**
   * Validates a locationSet and returns its stable identifier
   * @param locationSet - LocationSet with include/exclude arrays
   * @returns Validated locationSet object
   * @throws  Throws Error if any referenced location is invalid, or locationSet has no include.
   *
   * @example
   * ```typescript
   * // Include multiple countries
   * loco.validateLocationSet({ include: ['de', 'fr', 'it'] });
   * // => { type: 'locationset', locationSet: {...}, id: '+[Q183,Q142,Q38]' }
   *
   * // Include with exclusions
   * loco.validateLocationSet({
   *   include: ['de'],
   *   exclude: ['de-berlin.geojson']
   * });
   * // => { type: 'locationset', locationSet: {...}, id: '+[Q183]-[de-berlin.geojson]' }
   *
   * // Mix different location types
   * loco.validateLocationSet({
   *   include: ['us', [8.67039, 49.41882], 'philly_metro.geojson']
   * });
   * ```
   */
  validateLocationSet(locationSet?: LocationSet): ValidatedLocationSet {
    locationSet = locationSet || {};
    const validator = this.validateLocation.bind(this);
    const include = (locationSet.include || []).map(validator) as ValidatedLocation[];
    const exclude = (locationSet.exclude || []).map(validator) as ValidatedLocation[];

    if (!include.length) {
      throw new Error('validateLocationSet:  LocationSet includes nothing.');
    }

    // Generate stable identifier
    include.sort(_sortLocations);
    let id = '+[' + include.map((d) => d.id).join(',') + ']';
    if (exclude.length) {
      exclude.sort(_sortLocations);
      id += '-[' + exclude.map((d) => d.id).join(',') + ']';
    }

    return { type: 'locationset', locationSet, id };
  }


  /**
   * Resolves a locationSet to a GeoJSON feature by combining included/excluded regions
   * @param locationSet - LocationSet with include/exclude arrays
   * @returns Resolved locationSet with GeoJSON feature
   * @throws  Throws Error if any referenced location is invalid, or locationSet has no include.
   *
   * @example
   * ```typescript
   * // Combine multiple countries into one feature
   * const benelux = loco.resolveLocationSet({
   *   include: ['be', 'nl', 'lu']
   * });
   * // benelux.feature is a GeoJSON Feature with combined boundaries
   *
   * // Germany excluding Berlin
   * const germanyNoCapital = loco.resolveLocationSet({
   *   include: ['de'],
   *   exclude: ['de-berlin.geojson']
   * });
   * // Result is Germany with Berlin cut out
   *
   * // Complex region definition
   * const customRegion = loco.resolveLocationSet({
   *   include: ['us-ca', 'us-or', 'us-wa'],
   *   exclude: [[8.67039, 49.41882, 50]]
   * });
   * // West coast states minus a 50km circle
   * ```
   */
  resolveLocationSet(locationSet?: LocationSet): ResolvedLocationSet {
    locationSet = locationSet || {};
    const valid = this.validateLocationSet(locationSet);
    const id = valid.id;

    // Return a result from cache if we can
    if (this._resolved.has(id)) {
      return { ...valid, feature: this._resolved.get(id)! };
    }

    const resolver = this.resolveLocation.bind(this);
    const includes = (locationSet.include || []).map(resolver) as ResolvedLocation[];
    const excludes = (locationSet.exclude || []).map(resolver) as ResolvedLocation[];

    // Return quickly if it's just a single included location.
    if (includes.length === 1 && excludes.length === 0) {
      return { ...valid, feature: includes[0]!.feature };
    }

    // Calculate unions
    const includeGeoJSON = _clip(includes.map((d) => d.feature), 'UNION')!;
    const excludeGeoJSON = _clip(excludes.map((d) => d.feature), 'UNION');

    // Calculate difference, update `area` and return result
    const resultGeoJSON = excludeGeoJSON ? _clip([includeGeoJSON, excludeGeoJSON], 'DIFFERENCE')! : includeGeoJSON;
    resultGeoJSON.id = id;
    resultGeoJSON.properties = { id, area: _getArea(resultGeoJSON.geometry) };

    this._resolved.set(id, resultGeoJSON);
    return { ...valid, feature: resultGeoJSON };
  }


  /**
   * Registers `locationSet`-bearing objects so that {@link locationSetsAt} can tell you
   * which of them cover a given point.
   *
   * For each object, this method:
   * 1. Validates the `locationSet` and assigns its stable `locationSetID` (e.g. `'+[Q183]'`).
   * 2. Walks the `include` / `exclude` components and records them in an inverted index
   *    (component `locationID` → set of `locationSetID`s that reference it).
   * 3. Sums the approximate areas of the `include` components so results can be ranked
   *    smallest-first.
   *
   * Unlike the single-item `validate*` / `resolve*` methods, this method is **tolerant** of
   * bad input so that a batch of thousands of presets won't be rejected over a single typo:
   * - Objects with a missing, empty, or invalid `locationSet` fall back to world (`+[Q2]`).
   * - Individual invalid `include` / `exclude` components are silently ignored.
   *
   * This method **accumulates** — calling it multiple times (e.g. for different data sources)
   * inserts all locationSets into the same index.  The spatial index is rebuilt automatically.
   * To reset the index entirely, create a new `LocationConflation` instance.
   *
   * Note: this does **not** resolve each locationSet to a combined polygon — that expensive
   * clipping step is deferred to {@link resolveLocationSet}, called only when the caller
   * actually needs the GeoJSON geometry.
   *
   * @param objects - Objects with a `locationSet` property to index.
   * @returns The same array of objects, narrowed to guarantee `locationSetID` is set.
   *
   * @example
   * ```ts
   * const presets = [
   *   { id: 'amenity/cafe', locationSet: { include: ['de'] } },
   *   { id: 'amenity/atm',  locationSet: { include: ['001'] } },
   * ];
   * loco.registerLocationSets(presets);
   * // presets[0].locationSetID === '+[Q183]'
   * // presets[1].locationSetID === '+[Q2]'
   * ```
   */
  registerLocationSets<T extends HasLocationSet>(objects: T[]): (T & HasLocationSetID)[] {
    if (!Array.isArray(objects)) return [];

    for (const obj of objects) {
      // Resolve the locationSet to a stable id; fall back to world on any problem
      // (missing, empty include, or all-invalid components).
      let locationSet: LocationSet = obj.locationSet ?? {};
      let locationSetID: LocationSetID;
      try {
        locationSetID = this.validateLocationSet(locationSet).id;
      } catch {
        locationSet = { include: ['Q2'] };
        locationSetID = '+[Q2]';
      }
      obj.locationSet = locationSet;
      obj.locationSetID = locationSetID;

      // If we've already indexed this exact locationSetID, skip the inner work.
      // The object still gets its locationSetID set above.
      if (this._setAreas.has(locationSetID)) continue;

      let area = 0;

      for (const location of (locationSet.include ?? [])) {
        // Silently skip invalid/unresolvable components in batch mode.
        let resolved: ResolvedLocation;
        try {
          resolved = this.resolveLocation(location);
        } catch {
          continue;
        }
        const locationID: LocationID = resolved.id;
        area += resolved.feature.properties.area;

        let s = this._setsIncluding.get(locationID);
        if (!s) { s = new Set(); this._setsIncluding.set(locationID, s); }
        s.add(locationSetID);
      }

      for (const location of (locationSet.exclude ?? [])) {
        // Silently skip invalid/unresolvable components in batch mode.
        let resolved: ResolvedLocation;
        try {
          resolved = this.resolveLocation(location);
        } catch {
          continue;
        }
        const locationID: LocationID = resolved.id;

        let s = this._setsExcluding.get(locationID);
        if (!s) { s = new Set(); this._setsExcluding.set(locationID, s); }
        s.add(locationSetID);
      }

      this._setAreas.set(locationSetID, area);
    }

    this.rebuildIndex();

    return objects as unknown as (T & HasLocationSetID)[];
  }


  /**
   * Rebuilds the internal spatial index from the current cache and inverted index.
   *
   * Normally you don't need to call this yourself — {@link registerLocationSets},
   * {@link addFeatures}, {@link removeFeatures}, and {@link clearFeatures} all rebuild
   * the index automatically when appropriate.  Call it manually only if you've mutated
   * the cache through the (deprecated) `_cache` getter.
   */
  rebuildIndex(): void {
    // Collect all unique component locationIDs referenced by the inverted index.
    const allLocationIDs = new Set([
      ...this._setsIncluding.keys(),
      ...this._setsExcluding.keys(),
    ]);

    // Only custom .geojson features (ids ending in `.geojson`) and point-radius features
    // (ids starting with `[`) go into our which-polygon index.  CountryCoder regions are
    // deliberately skipped here because CountryCoder already provides its own optimized
    // spatial index via `featuresContaining()`, which we use directly in `locationSetsAt`.
    const features: Array<{ type: 'Feature'; geometry: GeoJSON.Polygon | GeoJSON.MultiPolygon; properties: { id: LocationID } }> = [];
    for (const locationID of allLocationIDs) {
      if (!locationID.startsWith('[') && !/\.geojson$/i.test(locationID)) continue;

      const feature = this._resolved.get(locationID);
      if (feature) {
        features.push({
          type: 'Feature',
          geometry: feature.geometry,
          properties: { id: locationID },
        });
      }
    }

    this._spatialIndex = whichPolygon({ type: 'FeatureCollection', features });
  }


  /**
   * Returns the stable `locationSetID`s of all indexed location sets that cover the given point.
   *
   * Uses the inverted spatial index built by {@link registerLocationSets} — no polygon clipping is
   * performed.  For country-coder regions, CountryCoder's built-in spatial index is used.
   * For custom `.geojson` and point-radius features, the local which-polygon index is used.
   *
   * Results are sorted by approximate area ascending (smallest / most specific region first).
   *
   * Call {@link resolveLocationSet} on any returned ID if you need the actual GeoJSON feature.
   *
   * @param point - `[longitude, latitude]` coordinate to query.
   * @returns Array of locationSetIDs valid at the given point.
   *
   * @example
   * ```ts
   * loco.registerLocationSets(presets);
   * const ids = loco.locationSetsAt([-75.16, 39.95]);
   * // => ['+[Q30]', '+[Q1]', ...]
   * // resolve one if you need the feature:
   * const feature = loco.resolveLocationSet({ include: ['us'] })?.feature;
   * ```
   */
  locationSetsAt(point: Vec2): string[] {
    if (!this._spatialIndex) return [];

    // Two-pass design:
    //   1. For each component location covering the point, walk the inverted index to
    //      collect the locationSetIDs that include or exclude it.
    //   2. Apply exclusions (a locationSet that excludes any covering component is removed).
    //
    // Component lookup is split across two spatial indexes because CountryCoder regions
    // use CountryCoder's own index, while custom .geojson and point-radius features use ours.
    // Unlike some earlier designs, we do NOT put resolved locationSet polygons into
    // which-polygon — membership is always derived from component hits via the inverted
    // index.  This keeps the spatial index small and avoids needing to resolve every set
    // to a combined polygon up front.
    const results = new Set<string>();
    const toExclude = new Set<string>();

    // Search the inverted index for occurrances of the given locationID.
    const gather = (locationID: LocationID): void => {
      for (const id of (this._setsIncluding.get(locationID) ?? [])) {
        results.add(id);
      }
      for (const id of (this._setsExcluding.get(locationID) ?? [])) {
        toExclude.add(id);
      }
    };

    // Country-coder components: delegate to CountryCoder's own spatial index
    for (const ccFeature of CountryCoder.featuresContaining(point)) {
      gather(ccFeature.properties.wikidata);
    }

    // Custom .geojson and point-radius components: use our which-polygon index
    // which-polygon returns null (not []) when multi=true and no matches
    for (const props of (this._spatialIndex(point, true) ?? [])) {
      gather(props.id);
    }

    // Apply exclusions
    for (const id of toExclude) {
      results.delete(id);
    }

    // Sort by approximate area ascending (smallest/most specific region first)
    return [...results].sort((a, b) => {
      const aArea = this._setAreas.get(a) ?? Infinity;
      const bArea = this._setAreas.get(b) ?? Infinity;
      return aArea - bArea;
    });
  }

  /**
   * Returns the approximate area (in km²) of an indexed locationSet.
   * The area is the sum of `include` location areas computed during
   * {@link registerLocationSets} — it does not subtract `exclude` areas.
   * Returns `undefined` if the locationSet has not been indexed.
   *
   * @param locationSetID - Stable locationSet identifier, e.g. `'+[Q183]'`.
   * @returns Approximate area in km², or `undefined` if not indexed.
   *
   * @example
   * ```ts
   * loco.registerLocationSets([{ locationSet: { include: ['de'] } }]);
   * loco.getLocationSetArea('+[Q183]');  // ~357000
   * ```
   */
  getLocationSetArea(locationSetID: LocationSetID): number | undefined {
    return this._setAreas.get(locationSetID);
  }

  /**
   * Convenience method to pretty-stringify an object.
   * @param obj - Object to stringify
   * @param options - Stringify options
   * @returns Pretty-formatted JSON string
   *
   * @example
   * ```typescript
   * const result = loco.resolveLocation('de');
   * console.log(LocationConflation.stringify(result.feature));
   * // Outputs a compact, readable JSON representation of the feature
   *
   * // Custom formatting options
   * console.log(LocationConflation.stringify(result.feature, { indent: 2, maxLength: 80 }));
   * ```
   */
  static stringify(obj: unknown, options?: StringifyOptions): string {
    return prettyStringify(obj, options);
  }
}


/** The two polygon clipping operations used internally. */
type ClipOperation = 'UNION' | 'DIFFERENCE';

/**
 * Wraps the polyclip-ts library and returns a GeoJSON feature.
 * @param features - Array of features to clip
 * @param which - Operation type (UNION or DIFFERENCE)
 * @returns Clipped GeoJSON feature or null if features array is empty
 */
function _clip(features: LocoFeature[], which: ClipOperation): LocoFeature | null {
  if (!Array.isArray(features) || !features.length) return null;

  const fn = which === 'UNION' ? Polyclip.union : Polyclip.difference;
  const first = features[0]!.geometry.coordinates as Geom;
  const rest: Geom[] = [];
  for (let i = 1; i < features.length; i++) {
    rest.push(features[i]!.geometry.coordinates as Geom);
  }
  const coords = fn(first, ...rest);

  return {
    type: 'Feature',
    properties: {} as LocoProperties,
    geometry: {
      type: whichType(coords),
      coordinates: coords,
    } as GeoJSON.Polygon | GeoJSON.MultiPolygon,
    id: '',
  };

  // is this a Polygon or a MultiPolygon?
  function whichType(coords: unknown): 'Polygon' | 'MultiPolygon' {
    const a = Array.isArray(coords);
    const b = a && Array.isArray(coords[0]);
    const c = b && Array.isArray(coords[0][0]);
    const d = c && Array.isArray(coords[0][0][0]);
    return d ? 'MultiPolygon' : 'Polygon';
  }
}


/**
 * Sorting function for locations to generate deterministic IDs.
 * Sorting the location lists is ok because they end up unioned together.
 * @param a - First location
 * @param b - Second location
 * @returns Sort order
 */
function _sortLocations(a: ValidatedLocation, b: ValidatedLocation): number {
  const rank = { countrycoder: 1, geojson: 2, point: 3 };
  const aRank = rank[a.type];
  const bRank = rank[b.type];

  return aRank > bRank ? 1 : aRank < bRank ? -1 : a.id.localeCompare(b.id);
}


/**
 * Compute the rough area of a GeoJSON geometry, in km².
 * We ensure that all resolved GeoJSON features have an `area` property.
 * The purpose of the `area` property is to enable rough size comparisons.
 * @param geom - The geometry to compute the area for
 * @returns  Area, in km², and truncated to 2 decimal places
 */
function _getArea(geom: GeoJSON.Geometry): number {
  return Number((calcArea.geometry(geom) / 1e6).toFixed(2));  // m² to km²
}


export default LocationConflation;
