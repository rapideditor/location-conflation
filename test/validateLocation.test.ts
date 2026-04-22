import { describe, it, expect } from 'bun:test';
import { LocationConflation } from '../src/location-conflation.ts';
import type { Location, Vec2, Vec3 } from '../src/types.ts';
import * as sample from './features.sample.ts';

// Shared instance is safe here — these tests are read-only and do not mutate the cache.
const loco = new LocationConflation(sample.featureCollection);


describe('validateLocation', () => {

  describe('points', () => {
    // Note: `it.each` spreads tuple elements as args, so we wrap each point in a single-element array.
    it.each<[Vec2]>([[[0, 0]], [[-180, -90]], [[180, -90]], [[180, 90]]])(
      'a valid [lon, lat] array %j returns a "point" result',
      (val) => {
        const result = loco.validateLocation(val);
        expect(result.type).toBe('point');
        expect(result.location).toBe(val);
        expect(result.id).toBe('[' + val.toString() + ']');
      }
    );

    it.each<[Vec3]>([[[0, 0, 20]], [[-180, -90, 20]], [[180, -90, 20]], [[180, 90, 20]]])(
      'a valid [lon, lat, radius] array %j returns a "point" result',
      (val) => {
        const result = loco.validateLocation(val);
        expect(result.type).toBe('point');
        expect(result.location).toBe(val);
        expect(result.id).toBe('[' + val.toString() + ']');
      }
    );

    it('an invalid [lon, lat, radius?] Array throws an error', () => {
      // Helper to call validateLocation with inputs that are intentionally wrong at compile time.
      // Using `unknown` + cast keeps the call site typed while letting us pass bad values.
      const badCall = (v: unknown) => () => loco.validateLocation(v as Location);

      expect(badCall([])).toThrow(/invalid location/i);
      expect(badCall(['a'])).toThrow(/invalid location/i);
      expect(badCall([0])).toThrow(/invalid location/i);
      expect(badCall([-181, -90])).toThrow(/invalid location/i);
      expect(badCall([-180, 91])).toThrow(/invalid location/i);
      expect(badCall([181, -90])).toThrow(/invalid location/i);
      expect(badCall([180, 91])).toThrow(/invalid location/i);
      expect(badCall([10, 10, null])).toThrow(/invalid location/i);
      expect(badCall([10, 10, -10])).toThrow(/invalid location/i);
      expect(badCall([10, 10, 0])).toThrow(/invalid location/i);
      expect(badCall([10, 10, 10, 10])).toThrow(/invalid location/i);
    });
  });


  describe('`.geojson` filenames', () => {
    it.each(['philly_metro.geojson', 'dc_metro.geojson'])(
      'a valid `.geojson` identifier %s returns a "geojson" result',
      (val) => {
        const result = loco.validateLocation(val);
        expect(result.type).toBe('geojson');
        expect(result.location).toBe(val);
        expect(result.id).toBe(val);
      }
    );

    it.each(['philly_metro', 'fake.geojson'])(
      'an invalid `.geojson` identifier %s throws an error',
      (val) => {
        expect(() => loco.validateLocation(val)).toThrow(/invalid location/i);
      }
    );

    it('`.geojson` identifiers compare as lowercase', () => {
      const result = loco.validateLocation('PHiLLy_MeTRo.GeoJSoN');
      expect(result.type).toBe('geojson');
      expect(result.location).toBe('PHiLLy_MeTRo.GeoJSoN');
      expect(result.id).toBe('philly_metro.geojson');
    });
  });


  describe('country coder feature identifiers', () => {
    it.each<Location>(['GB', 'gb', 'gbr', '826', 826, 'Q145', '🇬🇧', 'united kingdom'])(
      'a valid country coder identifier %j returns a "countrycoder" result',
      (val) => {
        const result = loco.validateLocation(val);
        expect(result.type).toBe('countrycoder');
        expect(result.location).toBe(val);
        expect(result.id).toBe('Q145');
      }
    );

    it.each(['', 'false', 'null'])(
      'an invalid country coder identifier %j throws an error',
      (val) => {
        expect(() => loco.validateLocation(val)).toThrow(/invalid location/i);
      }
    );
  });

});
