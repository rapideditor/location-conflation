import { describe, it, expect } from 'bun:test';
import { LocationConflation } from '../src/location-conflation.ts';
import type { HasLocationSet, Vec2 } from '../src/types.ts';
import * as sample from './features.sample.ts';


describe('registerLocationSets', () => {

  it('assigns locationSetID to each object', () => {
    const loco = new LocationConflation(sample.featureCollection);
    const objects = loco.registerLocationSets([
      { locationSet: { include: ['de'] } },
      { locationSet: { include: ['us'] } },
    ]);

    expect(objects[0]!.locationSetID).toBe('+[Q183]');
    expect(objects[1]!.locationSetID).toBe('+[Q30]');
  });

  it('handles objects without locationSet (defaults to world)', () => {
    const loco = new LocationConflation(sample.featureCollection);
    const objects = loco.registerLocationSets([{ id: 'no-locationset' } as HasLocationSet]);

    expect(objects[0]!.locationSetID).toBe('+[Q2]');
  });

  it('handles locationSet with empty include (defaults to world)', () => {
    const loco = new LocationConflation(sample.featureCollection);
    const objects = loco.registerLocationSets([{ locationSet: { include: [] } }]);

    expect(objects[0]!.locationSetID).toBe('+[Q2]');
  });

  it('handles locationSet with include and exclude', () => {
    const loco = new LocationConflation(sample.featureCollection);
    // de-berlin.geojson is not in our fixture features, so registerLocationSets skips it silently
    const objects = loco.registerLocationSets([{ locationSet: { include: ['de'], exclude: ['de-berlin.geojson'] } }]);

    expect(objects[0]!.locationSetID).toBeTruthy();
  });

  it('preserves other properties on objects', () => {
    const loco = new LocationConflation(sample.featureCollection);
    const objects = loco.registerLocationSets([{ id: 'preset-1', name: 'Cafe', locationSet: { include: ['de'] } }]);

    expect(objects[0]!.id).toBe('preset-1');
    expect(objects[0]!.name).toBe('Cafe');
    expect(objects[0]!.locationSetID).toBe('+[Q183]');
  });

  it('accumulates across multiple calls', () => {
    const loco = new LocationConflation(sample.featureCollection);
    const batch1 = [{ locationSet: { include: ['de'] } }];
    const batch2 = [{ locationSet: { include: ['us'] } }];

    loco.registerLocationSets(batch1);
    loco.registerLocationSets(batch2);

    // Both should be in the index (locationSetsAt should return both)
    const results = loco.locationSetsAt([8.68, 49.42]);  // Karlsruhe, Germany
    expect(results.includes('+[Q183]')).toBeTruthy();       // Germany
    expect(results.includes('+[Q30]')).toBeFalsy();       // US should not match Germany point
  });

  it('returns the objects with locationSetID guaranteed', () => {
    const loco = new LocationConflation(sample.featureCollection);
    const objects: HasLocationSet[] = [{ locationSet: { include: ['fr'] } }];

    const result = loco.registerLocationSets(objects);

    expect(result[0]!.locationSetID).toBe('+[Q142]');
    expect(result[0] === objects[0]).toBe(true);  // same reference, mutated in place
  });

  it('silently handles an empty array', () => {
    const loco = new LocationConflation();
    loco.registerLocationSets([]);
  });
});


describe('locationSetsAt', () => {

  it('returns empty array before registerLocationSets is called', () => {
    const loco = new LocationConflation();
    const results = loco.locationSetsAt([8.68, 49.42]);
    expect(results).toEqual([]);
  });

  it('returns locationSetIDs for a point in Germany', () => {
    const loco = new LocationConflation(sample.featureCollection);
    loco.registerLocationSets([
      { locationSet: { include: ['de'] } },    // Germany
      { locationSet: { include: ['us'] } },    // United States
      { locationSet: { include: ['001'] } },   // World (by UN M49 code)
    ]);

    const results = loco.locationSetsAt([8.68, 49.42]);  // Karlsruhe

    expect(results.includes('+[Q183]')).toBeTruthy();   // Germany
    expect(results.includes('+[Q2]')).toBeTruthy();     // World
    expect(results.includes('+[Q30]')).toBeFalsy();  // not US
  });

  it('returns world (+[Q2]) for any point when indexed', () => {
    const loco = new LocationConflation();
    loco.registerLocationSets([{ locationSet: { include: ['Q2'] } }]);

    const results = loco.locationSetsAt([8.68, 49.42]);
    expect(results.includes('+[Q2]')).toBeTruthy();

    const results2 = loco.locationSetsAt([-118.24, 34.05]);  // Los Angeles
    expect(results2.includes('+[Q2]')).toBeTruthy();
  });

  it('applies exclusions correctly', () => {
    const loco = new LocationConflation(sample.featureCollection);
    // Germany minus dc_metro (silly but tests the mechanism with known fixtures)
    // Let's instead use a real exclusion: index two sets - de, and de minus philly_metro (which is in US, so de minus it = de effectively)
    // For a proper exclusion test with these fixtures, let's try: include world, exclude germany
    loco.registerLocationSets([
      { locationSet: { include: ['Q2'], exclude: ['de'] } },  // world except Germany
    ]);

    const karlsruhe = loco.locationSetsAt([8.68, 49.42]);  // in Germany
    // This locationSet excludes Germany, so a point in Germany should NOT be in results
    // The exclude check fires because Germany (Q183) is a CC match for Karlsruhe,
    // and Q183 is in _setsExcluding → removes the locationSetID from results
    expect(karlsruhe.includes('+[Q2]-[Q183]')).toBeFalsy();

    const la = loco.locationSetsAt([-118.24, 34.05]);  // LA, not in Germany
    expect(la.includes('+[Q2]-[Q183]')).toBeTruthy();
  });

  it('resolves custom .geojson features correctly', () => {
    const loco = new LocationConflation(sample.featureCollection);  // includes dc_metro.geojson and philly_metro.geojson
    loco.registerLocationSets([
      { locationSet: { include: ['dc_metro.geojson'] } },
      { locationSet: { include: ['philly_metro.geojson'] } },
      { locationSet: { include: ['us'] } },
    ]);

    // Point in DC metro area (roughly)
    const dcPoint: Vec2 = [-77.0, 38.9];  // inside dc_metro fixture polygon
    const dcResults = loco.locationSetsAt(dcPoint);

    expect(dcResults.includes('+[dc_metro.geojson]')).toBeTruthy();
    expect(dcResults.includes('+[Q30]')).toBeTruthy();          // also in US
    expect(dcResults.includes('+[philly_metro.geojson]')).toBeFalsy();
  });

  it('sorts results by area ascending (smallest first)', () => {
    const loco = new LocationConflation(sample.featureCollection);
    loco.registerLocationSets([
      { locationSet: { include: ['Q2'] } },    // world (~510M km²)
      { locationSet: { include: ['de'] } },    // Germany (~357k km²)
      { locationSet: { include: ['001'] } },   // world alias
    ]);

    const results = loco.locationSetsAt([8.68, 49.42]);

    const qIdx = results.indexOf('+[Q183]');  // Germany
    const worldIdx = results.indexOf('+[Q2]');

    // Germany should come before world (smaller area)
    expect(qIdx).not.toBe(-1);
    expect(worldIdx).not.toBe(-1);
    expect(qIdx).toBeLessThan(worldIdx);
  });
});


describe('rebuildIndex', () => {

  it('updates the spatial index after addFeatures', () => {
    const loco = new LocationConflation();

    // Index a locationSet referencing a .geojson file not yet loaded
    // (it's skipped silently since the file isn't in cache)
    loco.addFeatures({
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        id: 'test_region.geojson',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [[[-10, -10], [10, -10], [10, 10], [-10, 10], [-10, -10]]],
        },
      }],
    });

    loco.registerLocationSets([
      { locationSet: { include: ['test_region.geojson'] } },
    ]);

    const results = loco.locationSetsAt([0, 0]);
    expect(results.includes('+[test_region.geojson]')).toBeTruthy();
  });

  it('can be called explicitly to refresh after addFeatures post-indexing', () => {
    const loco = new LocationConflation();

    // Add a feature and index a locationSet referencing it
    loco.addFeatures({
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        id: 'region_a.geojson',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [[[-10, -10], [10, -10], [10, 10], [-10, 10], [-10, -10]]],
        },
      }],
    });
    loco.registerLocationSets([
      { locationSet: { include: ['region_a.geojson'] } },
    ]);

    let results = loco.locationSetsAt([0, 0]);
    expect(results.includes('+[region_a.geojson]')).toBeTruthy();

    // Add another feature AFTER indexing, then rebuild so it joins the spatial index
    loco.addFeatures({
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        id: 'region_b.geojson',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [[[-5, -5], [5, -5], [5, 5], [-5, 5], [-5, -5]]],
        },
      }],
    });
    // Index an object referencing the new feature, then rebuild
    loco.registerLocationSets([
      { locationSet: { include: ['region_b.geojson'] } },
    ]);
    // registerLocationSets calls rebuildIndex internally; but we can also call it explicitly
    loco.rebuildIndex();

    results = loco.locationSetsAt([0, 0]);
    expect(results.includes('+[region_a.geojson]')).toBeTruthy();
    expect(results.includes('+[region_b.geojson]')).toBeTruthy();
  });
});


describe('getLocationSetArea', () => {

  it('returns the area of an indexed locationSet', () => {
    const loco = new LocationConflation(sample.featureCollection);
    loco.registerLocationSets([{ locationSet: { include: ['de'] } }]);

    const area = loco.getLocationSetArea('+[Q183]');
    expect(typeof area === 'number').toBeTruthy();
    expect(area!).toBeGreaterThan(0);
  });

  it('returns undefined for a locationSet that has not been indexed', () => {
    const loco = new LocationConflation(sample.featureCollection);
    expect(loco.getLocationSetArea('+[Q183]')).toBe(undefined);
  });

  it('sums component areas for multi-include locationSets', () => {
    const loco = new LocationConflation(sample.featureCollection);
    const registered = loco.registerLocationSets([
      { locationSet: { include: ['de'] } },
      { locationSet: { include: ['fr'] } },
      { locationSet: { include: ['de', 'fr'] } },
    ]);

    const deArea = loco.getLocationSetArea('+[Q183]');
    const frArea = loco.getLocationSetArea('+[Q142]');
    const bothArea = loco.getLocationSetArea(registered[2]!.locationSetID);

    expect(deArea && frArea && bothArea).toBeTruthy();
    expect(bothArea).toBe(deArea! + frArea!);
  });
});
