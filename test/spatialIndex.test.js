import { describe, it } from 'bun:test';
import { strict as assert } from 'bun:assert';
import { LocationConflation } from '../src/location-conflation.ts';

const features = await Bun.file('test/fixtures/features.json').json();


describe('registerLocationSets', () => {

  it('assigns locationSetID to each object', () => {
    const loco = new LocationConflation(features);
    const objects = [
      { locationSet: { include: ['de'] } },
      { locationSet: { include: ['us'] } },
    ];

    loco.registerLocationSets(objects);

    assert.equal(objects[0].locationSetID, '+[Q183]');
    assert.equal(objects[1].locationSetID, '+[Q30]');
  });

  it('handles objects without locationSet (defaults to world)', () => {
    const loco = new LocationConflation(features);
    const objects = [{ id: 'no-locationset' }];

    loco.registerLocationSets(objects);

    assert.equal(objects[0].locationSetID, '+[Q2]');
  });

  it('handles locationSet with empty include (defaults to world)', () => {
    const loco = new LocationConflation(features);
    const objects = [{ locationSet: { include: [] } }];

    loco.registerLocationSets(objects);

    assert.equal(objects[0].locationSetID, '+[Q2]');
  });

  it('handles locationSet with include and exclude', () => {
    const loco = new LocationConflation(features);
    const objects = [{ locationSet: { include: ['de'], exclude: ['de-berlin.geojson'] } }];

    // de-berlin.geojson is not in our fixture features, so registerLocationSets skips it silently
    loco.registerLocationSets(objects);

    assert.ok(objects[0].locationSetID);
  });

  it('preserves other properties on objects', () => {
    const loco = new LocationConflation(features);
    const objects = [{ id: 'preset-1', name: 'Cafe', locationSet: { include: ['de'] } }];

    loco.registerLocationSets(objects);

    assert.equal(objects[0].id, 'preset-1');
    assert.equal(objects[0].name, 'Cafe');
    assert.equal(objects[0].locationSetID, '+[Q183]');
  });

  it('accumulates across multiple calls', () => {
    const loco = new LocationConflation(features);
    const batch1 = [{ locationSet: { include: ['de'] } }];
    const batch2 = [{ locationSet: { include: ['us'] } }];

    loco.registerLocationSets(batch1);
    loco.registerLocationSets(batch2);

    // Both should be in the index (locationSetsAt should return both)
    const results = loco.locationSetsAt([8.68, 49.42]);  // Karlsruhe, Germany
    assert.ok(results.includes('+[Q183]'));       // Germany
    assert.ok(!results.includes('+[Q30]'));       // US should not match Germany point
  });

  it('returns the objects with locationSetID guaranteed', () => {
    const loco = new LocationConflation(features);
    const objects = [{ locationSet: { include: ['fr'] } }];

    const result = loco.registerLocationSets(objects);

    assert.equal(result[0].locationSetID, '+[Q142]');
    assert.equal(result[0], objects[0]);  // same reference, mutated in place
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
    assert.deepEqual(results, []);
  });

  it('returns locationSetIDs for a point in Germany', () => {
    const loco = new LocationConflation(features);
    loco.registerLocationSets([
      { locationSet: { include: ['de'] } },    // Germany
      { locationSet: { include: ['us'] } },    // United States
      { locationSet: { include: ['001'] } },   // World (by UN M49 code)
    ]);

    const results = loco.locationSetsAt([8.68, 49.42]);  // Karlsruhe

    assert.ok(results.includes('+[Q183]'));   // Germany
    assert.ok(results.includes('+[Q2]'));     // World
    assert.ok(!results.includes('+[Q30]'));  // not US
  });

  it('returns world (+[Q2]) for any point when indexed', () => {
    const loco = new LocationConflation();
    loco.registerLocationSets([{ locationSet: { include: ['Q2'] } }]);

    const results = loco.locationSetsAt([8.68, 49.42]);
    assert.ok(results.includes('+[Q2]'));

    const results2 = loco.locationSetsAt([-118.24, 34.05]);  // Los Angeles
    assert.ok(results2.includes('+[Q2]'));
  });

  it('applies exclusions correctly', () => {
    const loco = new LocationConflation(features);
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
    assert.ok(!karlsruhe.includes('+[Q2]-[Q183]'));

    const la = loco.locationSetsAt([-118.24, 34.05]);  // LA, not in Germany
    assert.ok(la.includes('+[Q2]-[Q183]'));
  });

  it('resolves custom .geojson features correctly', () => {
    const loco = new LocationConflation(features);  // includes dc_metro.geojson and philly_metro.geojson
    loco.registerLocationSets([
      { locationSet: { include: ['dc_metro.geojson'] } },
      { locationSet: { include: ['philly_metro.geojson'] } },
      { locationSet: { include: ['us'] } },
    ]);

    // Point in DC metro area (roughly)
    const dcPoint = [-77.0, 38.9];  // inside dc_metro fixture polygon
    const dcResults = loco.locationSetsAt(dcPoint);

    assert.ok(dcResults.includes('+[dc_metro.geojson]'));
    assert.ok(dcResults.includes('+[Q30]'));          // also in US
    assert.ok(!dcResults.includes('+[philly_metro.geojson]'));
  });

  it('sorts results by area ascending (smallest first)', () => {
    const loco = new LocationConflation(features);
    loco.registerLocationSets([
      { locationSet: { include: ['Q2'] } },    // world (~510M km²)
      { locationSet: { include: ['de'] } },    // Germany (~357k km²)
      { locationSet: { include: ['001'] } },   // world alias
    ]);

    const results = loco.locationSetsAt([8.68, 49.42]);

    const qIdx = results.indexOf('+[Q183]');  // Germany
    const worldIdx = results.indexOf('+[Q2]');

    // Germany should come before world (smaller area)
    assert.ok(qIdx !== -1, 'Germany should be in results');
    assert.ok(worldIdx !== -1, 'World should be in results');
    assert.ok(qIdx < worldIdx, 'Germany (smaller) should sort before World (larger)');
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
    assert.ok(results.includes('+[test_region.geojson]'));
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
    assert.ok(results.includes('+[region_a.geojson]'));

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
    assert.ok(results.includes('+[region_a.geojson]'));
    assert.ok(results.includes('+[region_b.geojson]'));
  });
});


describe('getLocationSetArea', () => {

  it('returns the area of an indexed locationSet', () => {
    const loco = new LocationConflation(features);
    loco.registerLocationSets([{ locationSet: { include: ['de'] } }]);

    const area = loco.getLocationSetArea('+[Q183]');
    assert.ok(typeof area === 'number');
    assert.ok(area > 0);
  });

  it('returns undefined for a locationSet that has not been indexed', () => {
    const loco = new LocationConflation(features);
    assert.equal(loco.getLocationSetArea('+[Q183]'), undefined);
  });

  it('sums component areas for multi-include locationSets', () => {
    const loco = new LocationConflation(features);
    const both = [{ locationSet: { include: ['de', 'fr'] } }];
    loco.registerLocationSets([
      { locationSet: { include: ['de'] } },
      { locationSet: { include: ['fr'] } },
      ...both,
    ]);

    const deArea = loco.getLocationSetArea('+[Q183]');
    const frArea = loco.getLocationSetArea('+[Q142]');
    const bothArea = loco.getLocationSetArea(both[0].locationSetID);

    assert.ok(deArea && frArea && bothArea);
    assert.equal(bothArea, deArea + frArea);
  });
});
