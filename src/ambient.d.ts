/* eslint-disable no-duplicate-imports -- each declare module block has its own scope */

declare module '@mapbox/geojson-area' {
  import type { Geometry } from 'geojson';
  /**
   * Calculate the area of a GeoJSON geometry in square meters.
   * @param  geom - A GeoJSON geometry object
   * @returns Area in square meters
   */
  export function geometry(geom: Geometry): number;

  /**
   * Calculate the area of a coordinate ring in square meters.
   * @param  coords - An array of [lon, lat] coordinate pairs forming a ring
   * @returns Area in square meters
   */
  export function ring(coords: number[][]): number;
}


declare module 'circle-to-polygon' {
  import type { Vec2 } from 'types.ts';
  import type { Polygon } from 'geojson';
  /**
   * Convert a center point and radius to a GeoJSON Polygon approximation of a circle.
   * @param  center - [longitude, latitude]
   * @param  radius - Radius in meters
   * @param  options - Number of edges (default 32) or options object
   * @returns A GeoJSON Polygon geometry
   */
  export default function circleToPolygon(
    center: Vec2,
    radius: number,
    options?: number | { numberOfEdges?: number; earthRadius?: number; bearing?: number; rightHandRule?: boolean }
  ): Polygon;
}


declare module 'geojson-precision' {
  import type { GeoJSON } from 'geojson';
  /**
   * Reduce the precision of GeoJSON coordinates.
   * @param  geojson - Any GeoJSON object
   * @param  coordinatePrecision - Number of decimal places for coordinates
   * @param  extrasPrecision - Number of decimal places for extra coordinate values (e.g. elevation)
   * @returns A new GeoJSON object with reduced precision
   */
  export default function parse<T extends GeoJSON>(t: T, coordinatePrecision?: number, extrasPrecision?: number): T;
}


declare module 'which-polygon' {
  import type { Vec2, Vec4 } from 'types.ts';
  /** Query function returned by {@link whichPolygon}. */
  interface WhichPolygonQuery<P extends object = Record<string, unknown>> {
    /** Returns all matching feature properties for the given point `[longitude, latitude]`, or null if none. */
    (point: Vec2, multi: true): P[] | null;
    /** Returns the first matching feature properties for the given point `[longitude, latitude]`, or null. */
    (point: Vec2, multi?: false): P | null;
    /** Returns all matching feature properties within the given bounding box `[minX, minY, maxX, maxY]`. */
    bbox(bbox: Vec4): P[];
  }

  /** Build an R-tree spatial index for quick point-in-polygon lookups over a GeoJSON FeatureCollection. */
  export default function whichPolygon<P extends object = Record<string, unknown>>(
    data: { type?: string; features: Array<{ geometry: { type: string; coordinates: unknown } | null; properties: P }> }
  ): WhichPolygonQuery<P>;
}


// structuredClone is available in all target environments (Node, Bun, modern browsers)
// but lives in the DOM lib which we don't include.
declare function structuredClone<T>(value: T): T;
