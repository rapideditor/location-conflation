import { describe, it } from 'bun:test';
import { strict as assert } from 'bun:assert';
import { LocationConflation } from '../src/location-conflation.ts';


describe('addFeatures', () => {

  it('adds features into the cache after construction', () => {
    const loco = new LocationConflation();
    assert.throws(() => loco.validateLocation('boston.geojson'));  // not yet known

    const fc = {
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
    assert.ok(result instanceof Object);
    assert.equal(result.type, 'geojson');
    assert.equal(result.feature.id, 'boston.geojson');
    assert.equal(result.feature.properties.id, 'boston.geojson');
    assert.ok(result.feature.properties.area > 0);
  });

  it('normalizes id to lowercase', () => {
    const loco = new LocationConflation();
    const fc = {
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
    assert.ok(result instanceof Object);
    assert.equal(result.feature.id, 'myregion.geojson');
  });

  it('reads id from properties if not on feature', () => {
    const loco = new LocationConflation();
    const fc = {
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
    assert.ok(result instanceof Object);
    assert.equal(result.feature.id, 'from_props.geojson');
  });

  it('preserves existing area property', () => {
    const loco = new LocationConflation();
    const fc = {
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
    assert.equal(result.feature.properties.area, 42);
  });

  it('skips features without .geojson id', () => {
    const loco = new LocationConflation();
    const fc = {
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
    assert.throws(() => loco.validateLocation('bad-id'));
  });

  it('silently returns if given invalid input', () => {
    const loco = new LocationConflation();
    loco.addFeatures(null);
    loco.addFeatures(undefined);
    loco.addFeatures({});
    loco.addFeatures({ type: 'Feature' });
  });

  it('overwrites existing cache entry with same id', () => {
    const loco = new LocationConflation();
    const fc1 = {
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
    const fc2 = {
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
    assert.equal(result.feature.properties.area, 200);
  });

  it('added features work in resolveLocationSet', async () => {
    const features = await Bun.file('test/fixtures/features.json').json();
    const loco = new LocationConflation(features);

    const fc = {
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
    assert.ok(result instanceof Object);
    assert.equal(result.type, 'locationset');
    assert.ok(result.feature.properties.area > 0);
  });
});


describe('removeFeatures', () => {

  it('removes a .geojson feature from the cache', async () => {
    const features = await Bun.file('test/fixtures/features.json').json();
    const loco = new LocationConflation(features);

    // Verify it exists first
    const before = loco.resolveLocation('dc_metro.geojson');
    assert.ok(before instanceof Object);

    loco.removeFeatures('dc_metro.geojson');

    assert.throws(() => loco.validateLocation('dc_metro.geojson'));
  });

  it('removes multiple features at once', async () => {
    const features = await Bun.file('test/fixtures/features.json').json();
    const loco = new LocationConflation(features);

    loco.removeFeatures('dc_metro.geojson', 'philly_metro.geojson');

    assert.throws(() => loco.validateLocation('dc_metro.geojson'));
    assert.throws(() => loco.validateLocation('philly_metro.geojson'));
  });

  it('is case-insensitive', () => {
    const loco = new LocationConflation();
    const fc = {
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

    assert.throws(() => loco.validateLocation('test.geojson'));
  });

  it('silently ignores non-.geojson ids', () => {
    const loco = new LocationConflation();
    loco.removeFeatures('Q2', 'not-a-geojson', '');
    // Q2 should still be in the cache
    const result = loco.resolveLocation('Q2');
    assert.ok(result instanceof Object);
  });

  it('silently ignores ids not in the cache', () => {
    const loco = new LocationConflation();
    loco.removeFeatures('nonexistent.geojson');
    // no error thrown
  });
});


describe('clearFeatures', () => {

  it('clears all cached features', async () => {
    const features = await Bun.file('test/fixtures/features.json').json();
    const loco = new LocationConflation(features);

    // Resolve some things to populate the cache
    loco.resolveLocation('de');
    loco.resolveLocation([0, 0]);

    loco.clearFeatures();

    assert.throws(() => loco.validateLocation('dc_metro.geojson'));
    assert.throws(() => loco.validateLocation('philly_metro.geojson'));
  });

  it('preserves the Q2 world feature', () => {
    const loco = new LocationConflation();
    loco.clearFeatures();

    const result = loco.resolveLocation('Q2');
    assert.ok(result instanceof Object);
    assert.equal(result.feature.id, 'Q2');
  });

  it('allows re-adding features after clearing', () => {
    const loco = new LocationConflation();
    const fc = {
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

    assert.throws(() => loco.validateLocation('test.geojson'));

    // Re-add
    loco.addFeatures(fc);
    const result = loco.resolveLocation('test.geojson');
    assert.ok(result instanceof Object);
  });
});


describe('_cache accessor (deprecated)', () => {

  it('getter returns the resolved-feature cache map', () => {
    const loco = new LocationConflation();

    const cache = loco._cache;
    assert.ok(cache instanceof Map);

    const q2 = cache.get('Q2');
    assert.ok(q2 instanceof Object);
    assert.equal(q2.id, 'Q2');
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
    assert.ok(result instanceof Object);
    assert.equal(result.feature.id, 'test.geojson');
    assert.equal(result.feature.properties.area, 123);
  });
});


describe('stringify', () => {
  it('pretty-stringifies values via static method', () => {
    const json = LocationConflation.stringify({ a: 1, b: { c: true } }, { maxLength: 10 });

    assert.equal(typeof json, 'string');
    assert.ok(json.includes('"a": 1'));
    assert.ok(json.includes('"b"'));
  });
});
