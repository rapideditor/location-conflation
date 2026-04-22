import { describe, it, expect } from 'bun:test';
import { LocationConflation } from '../src/location-conflation.ts';
import type { Vec2, Vec3 } from '../src/types.ts';
import * as sample from './features.sample.ts';

// Shared instance is safe here — these tests are read-only and do not mutate the cache.
const loco = new LocationConflation(sample.featureCollection);


describe('resolveLocation', () => {

  describe('points', () => {
    it('a valid [lon, lat] Array returns a feature match', () => {
      const location: Vec2 = [0, 0];
      const result = loco.resolveLocation(location);
      expect(result.type).toBe('point');
      expect(result.location).toBe(location);
      expect(result.feature.id).toBe('[0,0]');
      expect(result.feature.properties.id).toBe('[0,0]');
      expect(result.feature.properties.area).toBe(1963.5);      // area = Pi * 25 * 25
    });

    it('a valid [lon, lat, radius] Array returns a feature match', () => {
      const location: Vec3 = [0, 0, 100];
      const result = loco.resolveLocation(location);
      expect(result.type).toBe('point');
      expect(result.location).toBe(location);
      expect(result.feature.id).toBe('[0,0,100]');
      expect(result.feature.properties.id).toBe('[0,0,100]');
      expect(result.feature.properties.area).toBe(31415.93);    // area = Pi * 100 * 100
    });

    it('an invalid [lon, lat] Array throws an error', () => {
      const location: number[] = [];
      expect(() => loco.resolveLocation(location as Vec2)).toThrow(/invalid location/i);
    });
  });


  describe('`.geojson` filenames', () => {
    it('a known `.geojson` filename with id returns a feature match', () => {
      const location = 'dc_metro.geojson';
      const result = loco.resolveLocation(location);
      expect(result.type).toBe('geojson');
      expect(result.location).toBe(location);
      expect(result.feature.id).toBe('dc_metro.geojson');
      expect(result.feature.properties.id).toBe('dc_metro.geojson');
      expect(typeof result.feature.properties.area).toBe('number');
    });

    it('a known `.geojson` filename with id property returns a feature match', () => {
      const location = 'philly_metro.geojson';
      const result = loco.resolveLocation(location);
      expect(result.type).toBe('geojson');
      expect(result.location).toBe(location);
      expect(result.feature.id).toBe('philly_metro.geojson');
      expect(result.feature.properties.id).toBe('philly_metro.geojson');
      expect(typeof result.feature.properties.area).toBe('number');
    });

    it('`.geojson` identifiers compare as lowercase', () => {
      const location = 'PHiLLy_MeTRo.GeoJSoN';
      const result = loco.resolveLocation(location);
      expect(result.type).toBe('geojson');
      expect(result.location).toBe(location);
      expect(result.feature.id).toBe('philly_metro.geojson');
      expect(result.feature.properties.id).toBe('philly_metro.geojson');
      expect(typeof result.feature.properties.area).toBe('number');
    });

    it('an invalid `.geojson` filename throws an error', () => {
      const location = 'fake.geojson';
      expect(() => loco.resolveLocation(location)).toThrow(/invalid location/i);
    });
  });


  describe('country coder feature identifiers', () => {
    it('a valid country coder feature identifier returns a feature match', () => {
      const location = 'gb';
      const result = loco.resolveLocation(location);
      expect(result.type).toBe('countrycoder');
      expect(result.location).toBe(location);
      expect(result.feature.id).toBe('Q145');
      expect(result.feature.properties.id).toBe('Q145');
      expect(typeof result.feature.properties.area).toBe('number');
    });

    it('an invalid country coder feature identifier throws an error', () => {
      const location = 'fake';
      expect(() => loco.resolveLocation(location)).toThrow(/invalid location/i);
    });
  });

});
