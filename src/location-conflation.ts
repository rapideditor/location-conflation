import * as CountryCoder from '@rapideditor/country-coder';
import * as Polyclip from 'polyclip-ts';
import calcArea from '@mapbox/geojson-area';
import circleToPolygon from 'circle-to-polygon';
import precision from 'geojson-precision';
import prettyStringify from 'json-stringify-pretty-compact';
import type { Polygon, MultiPolygon } from 'geojson';

// Type definitions
type Vec2 = [number, number];
type Vec3 = [number, number, number];
type Location = Vec2 | Vec3 | string | number;

interface FeatureProperties {
  id: string;
  area: number;
  members?: string[];
  [key: string]: unknown;
}

type GeoJSONGeometry = Polygon | MultiPolygon;

interface GeoJSONFeature {
  type: 'Feature';
  id: string;
  properties: FeatureProperties;
  geometry: GeoJSONGeometry;
}

interface FeatureCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

interface LocationSet {
  include?: Location[];
  exclude?: Location[];
}

interface ValidatedLocation {
  type: 'point' | 'geojson' | 'countrycoder';
  location: Location;
  id: string;
}

interface ResolvedLocation extends ValidatedLocation {
  feature: GeoJSONFeature;
}

interface ValidatedLocationSet {
  type: 'locationset';
  locationSet: LocationSet;
  id: string;
}

interface ResolvedLocationSet extends ValidatedLocationSet {
  feature: GeoJSONFeature;
}

type ClipOperation = 'UNION' | 'DIFFERENCE';

type StringifyOptions = Parameters<typeof prettyStringify>[1];

export class LocationConflation {
  private _cache: Map<string, GeoJSONFeature>;
  public strict: boolean;

  /**
   * Creates a new LocationConflation instance
   * @param fc - Optional FeatureCollection of known features with filename-like IDs (e.g., "something.geojson")
   */
  constructor(fc?: FeatureCollection) {
    // The _cache retains resolved features, so if you ask for the same thing multiple times
    // we don't repeat the expensive resolving/clipping operations.
    //
    // Each feature has a stable identifier that is used as the cache key.
    // The identifiers look like:
    // - for point locations, the stringified point:          e.g. '[8.67039,49.41882]'
    // - for geojson locations, the geojson id:               e.g. 'de-hamburg.geojson'
    // - for countrycoder locations, feature.id property:     e.g. 'Q2'  (countrycoder uses Wikidata identifiers)
    // - for aggregated locationSets, +[include]-[exclude]:   e.g '+[Q2]-[Q18,Q27611]'
    this._cache = new Map();

    // When strict mode = true, throw on invalid locations or locationSets.
    // When strict mode = false, return `null` for invalid locations or locationSets.
    this.strict = true;

    // process input FeatureCollection
    if (fc?.type === 'FeatureCollection' && Array.isArray(fc.features)) {
      for (const feature of fc.features) {
        feature.properties = feature.properties || ({} as FeatureProperties);
        const props = feature.properties;

        // Get `id` from either `id` or `properties`
        let id = feature.id || props.id;
        if (!id || !/^\S+\.geojson$/i.test(id)) continue;

        // Ensure `id` exists and is lowercase
        id = id.toLowerCase();
        feature.id = id;
        props.id = id;

        // Ensure `area` property exists
        if (!props.area) {
          const area = calcArea.geometry(feature.geometry) / 1e6; // m² to km²
          props.area = Number(area.toFixed(2));
        }

        this._cache.set(id, feature);
      }
    }

    // Replace CountryCoder world geometry to be a polygon covering the world.
    const worldFeature = CountryCoder.feature('Q2');
    const world = cloneDeep(worldFeature) as unknown as GeoJSONFeature;
    world.geometry = {
      type: 'Polygon',
      coordinates: [[[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]]],
    };
    world.id = 'Q2';
    world.properties.id = 'Q2';
    world.properties.area = calcArea.geometry(world.geometry) / 1e6; // m² to km²
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

    // Return a result from cache if we can
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
      const feature = precision(
        {
          type: 'Feature',
          id,
          properties: { id, area: Number(area.toFixed(2)) },
          geometry: circleToPolygon([lon, lat], radius * 1000, EDGES), // km to m
        },
        PRECISION
      ) as GeoJSONFeature;
      this._cache.set(id, feature);
      return { ...valid, feature };
    }

    // A .geojson filename?
    if (valid.type === 'geojson') {
      // nothing to do here - these are all in _cache and would have returned already
    }

    // A country-coder identifier?
    if (valid.type === 'countrycoder') {
      const ccFeature = CountryCoder.feature(id);
      const feature = cloneDeep(ccFeature) as unknown as GeoJSONFeature;
      const props = feature.properties;

      // -> This block of code is weird and requires some explanation. <-
      // CountryCoder includes higher level features which are made up of members.
      // These features don't have their own geometry, but CountryCoder provides an
      //   `aggregateFeature` method to combine these members into a MultiPolygon.
      // In the past, Turf/JSTS/martinez could not handle the aggregated features,
      //   so we'd iteratively union them all together.  (this was slow)
      // But now mfogel/polygon-clipping handles these MultiPolygons like a boss.
      // This approach also has the benefit of removing all the internal borders and
      //   simplifying the regional polygons a lot.
      if (Array.isArray(props.members)) {
        const aggregate = CountryCoder.aggregateFeature(id);
        if (aggregate) {
          const clipped = clip([aggregate as unknown as GeoJSONFeature], 'UNION');
          if (clipped) {
            feature.geometry = clipped.geometry;
          }
        }
      }

      // Ensure `area` property exists
      if (!props.area) {
        const area = calcArea.geometry(feature.geometry) / 1e6; // m² to km²
        props.area = Number(area.toFixed(2));
      }

      // Ensure `id` property exists
      feature.id = id;
      props.id = id;

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
  validateLocationSet(locationSet?: LocationSet): ValidatedLocationSet | null {
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
      return { ...valid, feature: includes[0].feature };
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

/**
 * Wraps the polyclip-ts library and returns a GeoJSON feature
 * @param features - Array of features to clip
 * @param which - Operation type (UNION or DIFFERENCE)
 * @returns Clipped GeoJSON feature or null if features array is empty
 */
function clip(features: GeoJSONFeature[], which: ClipOperation): GeoJSONFeature | null {
  if (!Array.isArray(features) || !features.length) return null;

  const fn = { UNION: Polyclip.union, DIFFERENCE: Polyclip.difference }[which];
  const args = features.map((feature) => feature.geometry.coordinates);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const coords = (fn as any)(...args);

  return {
    type: 'Feature',
    properties: {} as FeatureProperties,
    geometry: {
      type: whichType(coords),
      coordinates: coords,
    } as GeoJSONGeometry,
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
 * Deep clones an object using JSON serialization
 * @param obj - Object to clone
 * @returns Cloned object
 */
function cloneDeep<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Sorting function for locations to generate deterministic IDs
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
