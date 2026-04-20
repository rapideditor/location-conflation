import * as CountryCoder from '@rapideditor/country-coder';
import * as Polyclip from 'polyclip-ts';
import calcArea from '@mapbox/geojson-area';
import circleToPolygon from 'circle-to-polygon';
import precision from 'geojson-precision';
import prettyStringify from 'json-stringify-pretty-compact';
import type { Geom } from 'polyclip-ts';

import type {
  LCFeature,
  LCFeatureProperties,
  Location,
  LocationSet,
  ResolvedLocation,
  ResolvedLocationSet,
  StringifyOptions,
  ValidatedLocation,
  ValidatedLocationSet,
} from './types.ts';


// Re-export everything from types.ts so consumers can `import { … } from '@rapideditor/location-conflation'`
export type * from './types.ts';


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
   *
   * Identifiers look like:
   * - `'[8.67039,49.41882]'` — point locations
   * - `'de-hamburg.geojson'` — geojson file locations
   * - `'Q2'` — country-coder locations (Wikidata QIDs)
   * - `'+[Q2]-[Q18,Q27611]'` — aggregated location sets
   */
  public _cache: Map<string, LCFeature>;

  /**
   * When `true` (default), throw on invalid locations or location sets.
   * When `false`, return `null` for invalid locations or location sets.
   */
  public strict: boolean;

  /**
   * Creates a new LocationConflation instance.
   *
   * @param fc - Optional GeoJSON FeatureCollection of known features with filename-like IDs
   *   (e.g. `"something.geojson"`).  Accepts a standard `GeoJSON.FeatureCollection` from
   *   `@types/geojson` — no casts needed.  Features without a `.geojson` id are silently skipped.
   */
  constructor(fc?: GeoJSON.FeatureCollection) {
    this._cache = new Map();
    this.strict = true;

    // Process input FeatureCollection.
    // We accept standard GeoJSON and coerce each qualifying feature into
    // the narrower LCFeature shape (guaranteed string id, area, polygon geometry).
    if (fc?.type === 'FeatureCollection' && Array.isArray(fc.features)) {
      for (const feature of fc.features) {
        const props = feature.properties ?? {};

        // Get `id` from either `id` or `properties`
        let id = feature.id ?? props['id'];
        if (!id || !/^\S+\.geojson$/i.test(String(id))) continue;

        // Ensure `id` exists and is lowercase
        id = String(id).toLowerCase();

        const geometry = feature.geometry as GeoJSON.Polygon | GeoJSON.MultiPolygon;

        // Ensure `area` property exists
        // The purpose of the `area` property is to enable rough size comparisons.
        const existingArea = props['area'] as number | undefined;
        const area = existingArea || Number((calcArea.geometry(geometry) / 1e6).toFixed(2)); // m² to km²

        const lcFeature: LCFeature = {
          type: 'Feature',
          id,
          properties: { ...props, id, area } as LCFeatureProperties,
          geometry,
        };

        this._cache.set(id, lcFeature);
      }
    }

    // Replace CountryCoder world geometry to be a polygon covering the world.
    const worldGeometry: GeoJSON.Polygon = {
      type: 'Polygon',
      coordinates: [[[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]]],
    };
    const world: LCFeature = {
      type: 'Feature',
      id: 'Q2',
      properties: { id: 'Q2', area: Number((calcArea.geometry(worldGeometry) / 1e6).toFixed(2)) },
      geometry: worldGeometry,
    };
    this._cache.set('Q2', world);
  }

  /**
   * Validates a location and returns its type and stable identifier
   * @param location - Location to validate (point, geojson filename, or country code)
   * @returns Validated location object or null if invalid
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
  validateLocation(location: Location): ValidatedLocation | null {
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
      if (this._cache.has(id)) {
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

    if (this.strict) {
      throw new Error(`validateLocation:  Invalid location: "${location}".`);
    }
    return null;
  }

  /**
   * Resolves a location to a GeoJSON feature
   * @param location - Location to resolve
   * @returns Resolved location with GeoJSON feature or null if invalid
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
  resolveLocation(location: Location): ResolvedLocation | null {
    const valid = this.validateLocation(location);
    if (!valid) return null;

    const id = valid.id;

    // Return a result from cache if we can.
    // (.geojson features are always in _cache — they were loaded in the constructor.)
    if (this._cache.has(id)) {
      return { ...valid, feature: this._cache.get(id)! };
    }

    // A [lon,lat] coordinate pair?
    if (valid.type === 'point' && Array.isArray(location)) {
      const lon = location[0];
      const lat = location[1];
      const radius = location[2] || 25; // km
      const EDGES = 10;
      const PRECISION = 3;
      const area = Math.PI * radius * radius;
      const feature: LCFeature = precision(
        {
          type: 'Feature' as const,
          id,
          properties: { id, area: Number(area.toFixed(2)) },
          geometry: circleToPolygon([lon, lat], radius * 1000, EDGES), // km to m
        },
        PRECISION
      );
      this._cache.set(id, feature);
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
          const clipped = clip([{
            type: 'Feature',
            id: '',
            properties: {} as LCFeatureProperties,
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
      const area = Number((calcArea.geometry(geometry) / 1e6).toFixed(2)); // m² to km²

      const feature: LCFeature = {
        type: 'Feature',
        id,
        properties: { id, area } as LCFeatureProperties,
        geometry,
      };

      this._cache.set(id, feature);
      return { ...valid, feature };
    }

    if (this.strict) {
      throw new Error(`resolveLocation:  Couldn't resolve location "${location}".`);
    }
    return null;
  }

  /**
   * Validates a locationSet and returns its stable identifier
   * @param locationSet - LocationSet with include/exclude arrays
   * @returns Validated locationSet object or null if invalid
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
    let include = (locationSet.include || []).map(validator).filter(Boolean) as ValidatedLocation[];
    const exclude = (locationSet.exclude || []).map(validator).filter(Boolean) as ValidatedLocation[];

    if (!include.length) {
      if (this.strict) {
        throw new Error('validateLocationSet:  LocationSet includes nothing.');
      } else {
        // non-strict mode, replace an empty locationSet with one that includes "the world"
        locationSet.include = ['Q2'];
        include = [{ type: 'countrycoder', location: 'Q2', id: 'Q2' }];
      }
    }

    // Generate stable identifier
    include.sort(sortLocations);
    let id = '+[' + include.map((d) => d.id).join(',') + ']';
    if (exclude.length) {
      exclude.sort(sortLocations);
      id += '-[' + exclude.map((d) => d.id).join(',') + ']';
    }

    return { type: 'locationset', locationSet, id };
  }

  /**
   * Resolves a locationSet to a GeoJSON feature by combining included/excluded regions
   * @param locationSet - LocationSet with include/exclude arrays
   * @returns Resolved locationSet with GeoJSON feature or null if invalid
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
  resolveLocationSet(locationSet?: LocationSet): ResolvedLocationSet | null {
    locationSet = locationSet || {};
    const valid = this.validateLocationSet(locationSet);
    if (!valid) return null;

    const id = valid.id;

    // Return a result from cache if we can
    if (this._cache.has(id)) {
      return { ...valid, feature: this._cache.get(id)! };
    }

    const resolver = this.resolveLocation.bind(this);
    const includes = (locationSet.include || []).map(resolver).filter(Boolean) as ResolvedLocation[];
    const excludes = (locationSet.exclude || []).map(resolver).filter(Boolean) as ResolvedLocation[];

    // Return quickly if it's a single included location..
    if (includes.length === 1 && excludes.length === 0) {
      return { ...valid, feature: includes[0]!.feature };
    }

    // Calculate unions
    const includeGeoJSON = clip(includes.map((d) => d.feature), 'UNION')!;
    const excludeGeoJSON = clip(excludes.map((d) => d.feature), 'UNION');

    // Calculate difference, update `area` and return result
    const resultGeoJSON = excludeGeoJSON ? clip([includeGeoJSON, excludeGeoJSON], 'DIFFERENCE')! : includeGeoJSON;
    const area = calcArea.geometry(resultGeoJSON.geometry) / 1e6; // m² to km²
    resultGeoJSON.id = id;
    resultGeoJSON.properties = { id, area: Number(area.toFixed(2)) };

    this._cache.set(id, resultGeoJSON);
    return { ...valid, feature: resultGeoJSON };
  }

  /**
   * Convenience method to pretty-stringify an object
   * @param obj - Object to stringify
   * @param options - Stringify options
   * @returns Pretty-formatted JSON string
   *
   * @example
   * ```typescript
   * const result = loco.resolveLocation('de');
   * console.log(loco.stringify(result.feature));
   * // Outputs a compact, readable JSON representation of the feature
   *
   * // Custom formatting options
   * console.log(loco.stringify(result.feature, { indent: 2, maxLength: 80 }));
   * ```
   */
  stringify(obj: unknown, options?: StringifyOptions): string {
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
function clip(features: LCFeature[], which: ClipOperation): LCFeature | null {
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
    properties: {} as LCFeatureProperties,
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
function sortLocations(a: ValidatedLocation, b: ValidatedLocation): number {
  const rank = { countrycoder: 1, geojson: 2, point: 3 };
  const aRank = rank[a.type];
  const bRank = rank[b.type];

  return aRank > bRank ? 1 : aRank < bRank ? -1 : a.id.localeCompare(b.id);
}

export default LocationConflation;
