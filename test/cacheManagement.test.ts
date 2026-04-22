import { describe, it, expect } from 'bun:test';
import type { FeatureCollection } from 'geojson';
import { LocationConflation } from '../src/location-conflation.ts';
import * as sample from './features.sample.ts';


describe('addFeatures', () => {

  it('adds features into the cache after construction', () => {
    const loco = new LocationConflation();
    expect(() => loco.validateLocation('boston.geojson')).toThrow(/invalid location/i);  // not yet known

    const fc: FeatureCollection = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        id: 'boston.geojson',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [[[-71.2, 42.2], [-71.0, 42.2], [-71.0, 42.4], [-71.2, 42.4], [-71.2, 42.2]]]
        }
      }]
    };

    loco.addFeatures(fc);

    const result = loco.resolveLocation('boston.geojson');
    expect(result.type).toBe('geojson');
    expect(result.feature.id).toBe('boston.geojson');
    expect(result.feature.properties.id).toBe('boston.geojson');
    expect(result.feature.properties.area).toBeGreaterThan(0);
  });

  it('normalizes id to lowercase', () => {
    const loco = new LocationConflation();
    const fc: FeatureCollection = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        id: 'MyRegion.GeoJSON',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]
        }
      }]
    };

    loco.addFeatures(fc);

    const result = loco.resolveLocation('myregion.geojson');
    expect(result.feature.id).toBe('myregion.geojson');
  });

  it('reads id from properties if not on feature', () => {
    const loco = new LocationConflation();
    const fc: FeatureCollection = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: { id: 'from_props.geojson' },
        geometry: {
          type: 'Polygon',
          coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]
        }
      }]
    };

    loco.addFeatures(fc);

    const result = loco.resolveLocation('from_props.geojson');
    expect(result.feature.id).toBe('from_props.geojson');
  });

  it('preserves existing area property', () => {
    const loco = new LocationConflation();
    const fc: FeatureCollection = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        id: 'known_area.geojson',
        properties: { area: 42 },
        geometry: {
          type: 'Polygon',
          coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]
        }
      }]
    };

    loco.addFeatures(fc);

    const result = loco.resolveLocation('known_area.geojson');
    expect(result.feature.properties.area).toBe(42);
  });

  it('skips features without .geojson id', () => {
    const loco = new LocationConflation();
    const fc: FeatureCollection = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        id: 'bad-id',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]
        }
      }]
    };

    loco.addFeatures(fc);
    expect(() => loco.validateLocation('bad-id')).toThrow(/invalid location/i);
  });

  it('silently returns if given invalid input', () => {
    const loco = new LocationConflation();
    // Intentionally passing bad input to verify tolerance.
    loco.addFeatures(null as unknown as FeatureCollection);
    loco.addFeatures(undefined as unknown as FeatureCollection);
    loco.addFeatures({} as FeatureCollection);
    loco.addFeatures({ type: 'Feature' } as unknown as FeatureCollection);
  });

  it('overwrites existing cache entry with same id', () => {
    const loco = new LocationConflation();
    const fc1: FeatureCollection = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        id: 'region.geojson',
        properties: { area: 100 },
        geometry: {
          type: 'Polygon',
          coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]
        }
      }]
    };
    const fc2: FeatureCollection = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        id: 'region.geojson',
        properties: { area: 200 },
        geometry: {
          type: 'Polygon',
          coordinates: [[[0, 0], [2, 0], [2, 2], [0, 2], [0, 0]]]
        }
      }]
    };

    loco.addFeatures(fc1);
    loco.addFeatures(fc2);

    const result = loco.resolveLocation('region.geojson');
    expect(result.feature.properties.area).toBe(200);
  });

  it('added features work in resolveLocationSet', () => {
    // use shared sample feature collection
    const loco = new LocationConflation(sample.featureCollection);

    const fc: FeatureCollection = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        id: 'custom_area.geojson',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [[[-77, 38.7], [-77, 39.0], [-76.8, 39.0], [-76.8, 38.7], [-77, 38.7]]]
        }
      }]
    };

    loco.addFeatures(fc);

    const result = loco.resolveLocationSet({ include: ['custom_area.geojson'] });
    expect(result.type).toBe('locationset');
    expect(result.feature.properties.area).toBeGreaterThan(0);
  });
});


describe('removeFeatures', () => {

  it('removes a .geojson feature from the cache', () => {
    // use shared sample feature collection
    const loco = new LocationConflation(sample.featureCollection);

    // Verify it resolves first (throws if not present)
    loco.resolveLocation('dc_metro.geojson');

    loco.removeFeatures('dc_metro.geojson');

    expect(() => loco.validateLocation('dc_metro.geojson')).toThrow(/invalid location/i);
  });

  it('removes multiple features at once', () => {
    // use shared sample feature collection
    const loco = new LocationConflation(sample.featureCollection);

    loco.removeFeatures('dc_metro.geojson', 'philly_metro.geojson');

    expect(() => loco.validateLocation('dc_metro.geojson')).toThrow(/invalid location/i);
    expect(() => loco.validateLocation('philly_metro.geojson')).toThrow(/invalid location/i);
  });

  it('is case-insensitive', () => {
    const loco = new LocationConflation();
    const fc: FeatureCollection = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        id: 'test.geojson',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]
        }
      }]
    };
    loco.addFeatures(fc);
    loco.removeFeatures('TEST.GeoJSON');

    expect(() => loco.validateLocation('test.geojson')).toThrow(/invalid location/i);
  });

  it('silently ignores non-.geojson ids', () => {
    const loco = new LocationConflation();
    loco.removeFeatures('Q2', 'not-a-geojson', '');
    // Q2 should still be in the cache
    const result = loco.resolveLocation('Q2');
    expect(result.feature.id).toBe('Q2');
  });

  it('silently ignores ids not in the cache', () => {
    const loco = new LocationConflation();
    loco.removeFeatures('nonexistent.geojson');
    // no error thrown
  });
});


describe('clearFeatures', () => {

  it('clears all cached features', () => {
    // use shared sample feature collection
    const loco = new LocationConflation(sample.featureCollection);

    // Resolve some things to populate the cache
    loco.resolveLocation('de');
    loco.resolveLocation([0, 0]);

    loco.clearFeatures();

    expect(() => loco.validateLocation('dc_metro.geojson')).toThrow(/invalid location/i);
    expect(() => loco.validateLocation('philly_metro.geojson')).toThrow(/invalid location/i);
  });

  it('preserves the Q2 world feature', () => {
    const loco = new LocationConflation();
    loco.clearFeatures();

    const result = loco.resolveLocation('Q2');
    expect(result.feature.id).toBe('Q2');
  });

  it('allows re-adding features after clearing', () => {
    const loco = new LocationConflation();
    const fc: FeatureCollection = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        id: 'test.geojson',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]
        }
      }]
    };

    loco.addFeatures(fc);
    loco.clearFeatures();

    expect(() => loco.validateLocation('test.geojson')).toThrow(/invalid location/i);

    // Re-add
    loco.addFeatures(fc);
    const result = loco.resolveLocation('test.geojson');
    expect(result.feature.id).toBe('test.geojson');
  });
});


describe('_cache accessor (deprecated)', () => {

  it('getter returns the resolved-feature cache map', () => {
    const loco = new LocationConflation();

    const cache = loco._cache;
    expect(cache).toBeInstanceOf(Map);

    const q2 = cache.get('Q2');
    expect(q2!.id).toBe('Q2');
  });

  it('getter allows mutating the underlying cache map', () => {
    const loco = new LocationConflation();

    loco._cache.set('test.geojson', {
      type: 'Feature',
      id: 'test.geojson',
      properties: { id: 'test.geojson', area: 123 },
      geometry: {
        type: 'Polygon',
        coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]],
      },
    });

    const result = loco.resolveLocation('test.geojson');
    expect(result.feature.id).toBe('test.geojson');
    expect(result.feature.properties.area).toBe(123);
  });
});


describe('stringify', () => {
  it('pretty-stringifies values via static method', () => {
    const json = LocationConflation.stringify({ a: 1, b: { c: true } }, { maxLength: 10 });

    expect(typeof json).toBe('string');
    expect(json.includes('"a": 1')).toBeTruthy();
    expect(json.includes('"b"')).toBeTruthy();
  });
});
