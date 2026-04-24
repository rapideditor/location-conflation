import { describe, it, expect } from 'bun:test';
import { LocationConflation } from '../src/location-conflation.ts';
import type { LocationSet } from '../src/types.ts';
import * as sample from './features.sample.ts';

// Shared instance is safe here — these tests are read-only and do not mutate the cache.
const loco = new LocationConflation(sample.featureCollection);


describe('validateLocationSet', () => {

  describe('empty locationSet', () => {
    it('empty locationSet throws an error', () => {
      const locationSet = { };
      expect(() => loco.resolveLocationSet(locationSet)).toThrow(/includes nothing/i);
    });
  });


  describe('country coder identifiers', () => {
    it('sorts included countrycoder locations', () => {
      const locationSet = { include: ['013', '005'] };
      const result = loco.resolveLocationSet(locationSet);
      expect(result.type).toBe('locationset');
      expect(result.locationSet).toBe(locationSet);
      expect(result.id).toBe('+[Q18,Q27611]');
    });

    it('invalid included countrycoder locations throw an error', () => {
      const locationSet = { include: ['013', 'fake', '005'] };
      expect(() => loco.resolveLocationSet(locationSet)).toThrow(/invalid location/i);
    });

    it('sorts excluded countrycoder locations', () => {
      const locationSet = { include: ['001'], exclude: ['013', '005'] };
      const result = loco.resolveLocationSet(locationSet);
      expect(result.type).toBe('locationset');
      expect(result.locationSet).toBe(locationSet);
      expect(result.id).toBe('+[Q2]-[Q18,Q27611]');
    });

    it('invalid excluded countrycoder locations throw an error', () => {
      const locationSet = { include: ['001'], exclude: ['013', 'fake', '005'] };
      expect(() => loco.resolveLocationSet(locationSet)).toThrow(/invalid location/i);
    });

    it('missing include throws an error', () => {
      const locationSet = { exclude: ['013', '005'] };
      expect(() => loco.resolveLocationSet(locationSet)).toThrow(/includes nothing/i);
    });
  });


  describe('`.geojson` filenames', () => {
    it('sorts included .geojson locations', () => {
      const locationSet = { include: ['philly_metro.geojson', 'dc_metro.geojson'] };
      const result = loco.resolveLocationSet(locationSet);
      expect(result.type).toBe('locationset');
      expect(result.locationSet).toBe(locationSet);
      expect(result.id).toBe('+[dc_metro.geojson,philly_metro.geojson]');
    });

    it('invalid included .geojson locations throw an error', () => {
      const locationSet = { include: ['philly_metro.geojson', 'fake.geojson', 'dc_metro.geojson'] };
      expect(() => loco.resolveLocationSet(locationSet)).toThrow(/invalid location/i);
    });

    it('sorts excluded .geojson locations', () => {
      const locationSet = { include: ['001'], exclude: ['philly_metro.geojson', 'dc_metro.geojson'] };
      const result = loco.resolveLocationSet(locationSet);
      expect(result.type).toBe('locationset');
      expect(result.locationSet).toBe(locationSet);
      expect(result.id).toBe('+[Q2]-[dc_metro.geojson,philly_metro.geojson]');
    });

    it('invalid excluded .geojson locations throw an error', () => {
      const locationSet = { include: ['001'], exclude: ['philly_metro.geojson', 'fake.geojson', 'dc_metro.geojson'] };
      expect(() => loco.resolveLocationSet(locationSet)).toThrow(/invalid location/i);
    });
  });


  describe('points', () => {
    it('sorts included point locations', () => {
      const locationSet: LocationSet = { include: [[1, 0], [0, 1], [1, 1], [0, 0]] };
      const result = loco.resolveLocationSet(locationSet);
      expect(result.type).toBe('locationset');
      expect(result.locationSet).toBe(locationSet);
      expect(result.id).toBe('+[[0,0],[0,1],[1,0],[1,1]]');
    });

    it('invalid included point locations throw an error', () => {
      const locationSet: LocationSet = { include: [[1, 0], [0, 1], [NaN, NaN], [1, 1], [0, 0]] };
      expect(() => loco.resolveLocationSet(locationSet)).toThrow(/invalid location/i);
    });

    it('sorts excluded point locations', () => {
      const locationSet: LocationSet = { include: ['001'], exclude: [[1, 0], [0, 1], [1, 1], [0, 0]] };
      const result = loco.resolveLocationSet(locationSet);
      expect(result.type).toBe('locationset');
      expect(result.locationSet).toBe(locationSet);
      expect(result.id).toBe('+[Q2]-[[0,0],[0,1],[1,0],[1,1]]');
    });

    it('invalid excluded point locations throw an error', () => {
      const locationSet: LocationSet = { include: ['001'], exclude: [[1, 0], [0, 1], [NaN, NaN], [1, 1], [0, 0]] };
      expect(() => loco.resolveLocationSet(locationSet)).toThrow(/invalid location/i);
    });
  });


  it('sorts included countrycoder < geojson < point', () => {
    const locationSet: LocationSet = { include: ['philly_metro.geojson', [0,0], 'ca'] };
    const result = loco.resolveLocationSet(locationSet);
    expect(result.type).toBe('locationset');
    expect(result.locationSet).toBe(locationSet);
    expect(result.id).toBe('+[Q16,philly_metro.geojson,[0,0]]');
  });

  it('sorts excluded countrycoder < geojson < point', () => {
    const locationSet: LocationSet = { include: ['001'], exclude: ['philly_metro.geojson', [0,0], 'ca'] };
    const result = loco.resolveLocationSet(locationSet);
    expect(result.type).toBe('locationset');
    expect(result.locationSet).toBe(locationSet);
    expect(result.id).toBe('+[Q2]-[Q16,philly_metro.geojson,[0,0]]');
  });

  it('force lowercase', () => {
    const locationSet = { include: ['US'], exclude: ['PR'] };
    const result = loco.resolveLocationSet(locationSet);
    expect(result.type).toBe('locationset');
    expect(result.locationSet).toBe(locationSet);
    expect(result.id).toBe('+[Q30]-[Q1183]');
  });

});
