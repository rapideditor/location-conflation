import { describe, it, expect } from 'bun:test';
import { LocationConflation } from '../src/location-conflation.ts';
import type { LocationSet } from '../src/types.ts';
import * as sample from './features.sample.ts';

// Shared instance is safe here — these tests are read-only and do not mutate the cache.
const loco = new LocationConflation(sample.featureCollection);


describe('resolveLocationSet', () => {

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
      expect(result.feature.id).toBe('+[Q18,Q27611]');
      expect(result.feature.properties.id).toBe('+[Q18,Q27611]');
      expect(typeof result.feature.properties.area).toBe('number');
    });

    it('sorts excluded countrycoder locations', () => {
      const locationSet = { include: ['001'], exclude: ['013', '005'] };
      const result = loco.resolveLocationSet(locationSet);
      expect(result.type).toBe('locationset');
      expect(result.locationSet).toBe(locationSet);
      expect(result.id).toBe('+[Q2]-[Q18,Q27611]');
      expect(result.feature.id).toBe('+[Q2]-[Q18,Q27611]');
      expect(result.feature.properties.id).toBe('+[Q2]-[Q18,Q27611]');
      expect(typeof result.feature.properties.area).toBe('number');
    });
  });


  describe('`.geojson` filenames', () => {
    it('sorts included .geojson locations', () => {
      const locationSet = { include: ['philly_metro.geojson', 'dc_metro.geojson'] };
      const result = loco.resolveLocationSet(locationSet);
      expect(result.type).toBe('locationset');
      expect(result.locationSet).toBe(locationSet);
      expect(result.id).toBe('+[dc_metro.geojson,philly_metro.geojson]');
      expect(result.feature.id).toBe('+[dc_metro.geojson,philly_metro.geojson]');
      expect(result.feature.properties.id).toBe('+[dc_metro.geojson,philly_metro.geojson]');
      expect(typeof result.feature.properties.area).toBe('number');
    });

    it('sorts excluded .geojson locations', () => {
      const locationSet = { include: ['001'], exclude: ['philly_metro.geojson', 'dc_metro.geojson'] };
      const result = loco.resolveLocationSet(locationSet);
      expect(result.type).toBe('locationset');
      expect(result.locationSet).toBe(locationSet);
      expect(result.id).toBe('+[Q2]-[dc_metro.geojson,philly_metro.geojson]');
      expect(result.feature.id).toBe('+[Q2]-[dc_metro.geojson,philly_metro.geojson]');
      expect(result.feature.properties.id).toBe('+[Q2]-[dc_metro.geojson,philly_metro.geojson]');
      expect(typeof result.feature.properties.area).toBe('number');
    });
  });


  describe('points', () => {
    it('sorts included point locations', () => {
      const locationSet: LocationSet = { include: [[1, 0], [0, 1], [1, 1], [0, 0]] };
      const result = loco.resolveLocationSet(locationSet);
      expect(result.type).toBe('locationset');
      expect(result.locationSet).toBe(locationSet);
      expect(result.id).toBe('+[[0,0],[0,1],[1,0],[1,1]]');
      expect(result.feature.id).toBe('+[[0,0],[0,1],[1,0],[1,1]]');
      expect(result.feature.properties.id).toBe('+[[0,0],[0,1],[1,0],[1,1]]');
      expect(typeof result.feature.properties.area).toBe('number');
    });

    it('sorts excluded point locations', () => {
      const locationSet: LocationSet = { include: ['001'], exclude: [[1, 0], [0, 1], [1, 1], [0, 0]] };
      const result = loco.resolveLocationSet(locationSet);
      expect(result.type).toBe('locationset');
      expect(result.locationSet).toBe(locationSet);
      expect(result.id).toBe('+[Q2]-[[0,0],[0,1],[1,0],[1,1]]');
      expect(result.feature.id).toBe('+[Q2]-[[0,0],[0,1],[1,0],[1,1]]');
      expect(result.feature.properties.id).toBe('+[Q2]-[[0,0],[0,1],[1,0],[1,1]]');
      expect(typeof result.feature.properties.area).toBe('number');
    });
  });


  it('invalid included locations throw an error', () => {
    const locationSet = { include: ['fake', 'null'] };
    expect(() => loco.resolveLocationSet(locationSet)).toThrow(/invalid location/i);
  });

  it('invalid excluded locations throw an error', () => {
    const locationSet = { include: ['001'], exclude: ['fake', 'null'] };
    expect(() => loco.resolveLocationSet(locationSet)).toThrow(/invalid location/i);
  });

  it('sorts included countrycoder < geojson < point', () => {
    const locationSet: LocationSet = { include: ['philly_metro.geojson', [0,0], 'ca'] };
    const result = loco.resolveLocationSet(locationSet);
    expect(result.type).toBe('locationset');
    expect(result.locationSet).toBe(locationSet);
    expect(result.id).toBe('+[Q16,philly_metro.geojson,[0,0]]');
    expect(result.feature.id).toBe('+[Q16,philly_metro.geojson,[0,0]]');
    expect(result.feature.properties.id).toBe('+[Q16,philly_metro.geojson,[0,0]]');
    expect(typeof result.feature.properties.area).toBe('number');
  });

  it('sorts excluded countrycoder < geojson < point', () => {
    const locationSet: LocationSet = { include: ['001'], exclude: ['philly_metro.geojson', [0,0], 'ca'] };
    const result = loco.resolveLocationSet(locationSet);
    expect(result.type).toBe('locationset');
    expect(result.locationSet).toBe(locationSet);
    expect(result.id).toBe('+[Q2]-[Q16,philly_metro.geojson,[0,0]]');
    expect(result.feature.id).toBe('+[Q2]-[Q16,philly_metro.geojson,[0,0]]');
    expect(result.feature.properties.id).toBe('+[Q2]-[Q16,philly_metro.geojson,[0,0]]');
    expect(typeof result.feature.properties.area).toBe('number');
  });

});
