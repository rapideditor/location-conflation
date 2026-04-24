import { describe, it, expect } from 'bun:test';
import { LocationConflation } from '../src/location-conflation.ts';


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
