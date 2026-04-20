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
  import type { Polygon } from 'geojson';
  /**
   * Convert a center point and radius to a GeoJSON Polygon approximation of a circle.
   * @param  center - [longitude, latitude]
   * @param  radius - Radius in meters
   * @param  options - Number of edges (default 32) or options object
   * @returns A GeoJSON Polygon geometry
   */
  export default function circleToPolygon(
    center: [number, number],
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


// structuredClone is available in all target environments (Node, Bun, modern browsers)
// but lives in the DOM lib which we don't include.
declare function structuredClone<T>(value: T): T;
