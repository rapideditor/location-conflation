import type prettyStringify from 'json-stringify-pretty-compact';


/** A 2-number tuple, for example: `[longitude, latitude]` */
export type Vec2 = [number, number];

/** A 3-number tuple, for example: `[longitude, latitude, radius]` */
export type Vec3 = [number, number, number];


/**
 * A location identifier. Can be:
 * - A `[lon, lat]` point (default 25 km radius)
 * - A `[lon, lat, radius]` point with custom radius in km
 * - A string filename like `"something.geojson"`
 * - A string or numeric country-coder identifier (ISO code, M49, Wikidata QID, etc.)
 */
export type Location = Vec2 | Vec3 | string | number;


/**
 * Properties guaranteed to exist on every feature returned by LocationConflation.
 * These are stricter than standard `GeoJsonProperties` because LC validates and
 * enriches features during resolution.
 */
export interface LCFeatureProperties {
  /** Stable identifier for the feature (e.g. `"Q183"`, `"philly_metro.geojson"`, `"+[Q183]-[Q64]"`) */
  id: string;
  /** Area of the feature in square kilometers */
  area: number;
  /** For country-coder aggregate regions, the list of member region identifiers */
  members?: string[];
  /** Additional properties are permitted */
  [key: string]: unknown;
}

/**
 * A GeoJSON Feature as returned by LocationConflation.
 *
 * Extends the standard `GeoJSON.Feature` type with narrower guarantees:
 * - `id` is always a `string` (standard allows `string | number | undefined`)
 * - `geometry` is always `Polygon | MultiPolygon` (standard allows any `Geometry | null`)
 * - `properties` always includes `id` and `area` (standard allows `null`)
 *
 * Because this extends `Feature`, an `LCFeature` is assignable anywhere a
 * standard `Feature` is expected — no casts needed.
 */
export interface LCFeature extends GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon, LCFeatureProperties> {
  /** Stable string identifier — always present (narrows Feature's optional `id`) */
  id: string;
}

/**
 * A `FeatureCollection` of {@link LCFeature}s, as used internally by LocationConflation.
 *
 * Extends the standard `GeoJSON.FeatureCollection`, so it is assignable anywhere
 * a standard `FeatureCollection` is expected.
 *
 * @see Use standard `GeoJSON.FeatureCollection` from `@types/geojson` when constructing
 *   a collection to pass to the {@link LocationConflation} constructor — it accepts
 *   standard GeoJSON without casts.
 */
export interface LCFeatureCollection extends GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon, LCFeatureProperties> {
  /** Array of LocationConflation features with guaranteed `id`, `area`, and polygon geometry */
  features: LCFeature[];
}


/**
 * A location set definition with optional `include` and `exclude` arrays.
 *
 * @example
 * ```ts
 * // Include Germany, exclude Berlin
 * const ls: LocationSet = {
 *   include: ['de'],
 *   exclude: ['de-berlin.geojson']
 * };
 * ```
 */
export interface LocationSet {
  /** Locations to include (unioned together). Defaults to world (`['Q2']`) if empty. */
  include?: Location[];
  /** Locations to exclude (differenced from the union of includes). */
  exclude?: Location[];
}


/**
 * Result of {@link LocationConflation.validateLocation}.
 * Contains the parsed location type, original value, and a stable cache identifier.
 */
export interface ValidatedLocation {
  /** What kind of location this is */
  type: 'point' | 'geojson' | 'countrycoder';
  /** The original location value that was validated */
  location: Location;
  /** Stable identifier used as a cache key (e.g. `"[8.67,49.42]"`, `"Q183"`, `"file.geojson"`) */
  id: string;
}

/**
 * Result of {@link LocationConflation.resolveLocation}.
 * Extends {@link ValidatedLocation} with the resolved GeoJSON feature.
 */
export interface ResolvedLocation extends ValidatedLocation {
  /** The resolved GeoJSON feature for this location */
  feature: LCFeature;
}


/**
 * Result of {@link LocationConflation.validateLocationSet}.
 * Contains the validated include/exclude arrays and a stable cache identifier.
 */
export interface ValidatedLocationSet {
  /** Always `'locationset'` */
  type: 'locationset';
  /** The validated (possibly normalized) location set */
  locationSet: LocationSet;
  /** Stable identifier encoding the sorted includes/excludes (e.g. `"+[Q183]-[Q64]"`) */
  id: string;
}

/**
 * Result of {@link LocationConflation.resolveLocationSet}.
 * Extends {@link ValidatedLocationSet} with the resolved GeoJSON feature.
 */
export interface ResolvedLocationSet extends ValidatedLocationSet {
  /** The resolved GeoJSON feature representing the combined include/exclude region */
  feature: LCFeature;
}


/** Options accepted by `json-stringify-pretty-compact`. */
export type StringifyOptions = Parameters<typeof prettyStringify>[1];
