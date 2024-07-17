import fs from 'node:fs';
import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { LocationConflation } from '../index.mjs';

const features = JSON.parse(fs.readFileSync('test/fixtures/features.json', 'utf8'));
const loco = new LocationConflation(features);
const locoNS = new LocationConflation(features);
locoNS.strict = false;


test('resolveLocationSet', async t => {

  await t.test('empty locationSet', async t => {
    await t.test('(strict mode) empty locationSet throws an error', t => {
      const locationSet = { };
      assert.throws(() => loco.resolveLocationSet(locationSet));
    });

    await t.test('(non strict mode) empty locationSet defaults to world (Q2)', t => {
      const locationSet = { };
      const result = locoNS.resolveLocationSet(locationSet);
      assert.ok(result instanceof Object);
      assert.equal(result.type, 'locationset');
      assert.equal(result.locationSet, locationSet);
      assert.equal(result.id, '+[Q2]');
      assert.ok(result.feature instanceof Object);                     // result includes a `feature`
      assert.equal(result.feature.id, 'Q2');                           // feature has an `id`
      assert.ok(result.feature.properties instanceof Object);          // feature has `properties`
      assert.equal(result.feature.properties.id, 'Q2');                // properties has an `id` property
      assert.equal(typeof result.feature.properties.area, 'number');   // properties has a numeric `area` property
    });
  });


  await t.test('country coder feature identifiers', async t => {
    await t.test('sorts included countrycoder locations', t => {
      const locationSet = { include: ['013', '005'] };
      const result = loco.resolveLocationSet(locationSet);
      assert.ok(result instanceof Object);
      assert.equal(result.type, 'locationset');
      assert.equal(result.locationSet, locationSet);
      assert.equal(result.id, '+[Q18,Q27611]');
      assert.ok(result.feature instanceof Object);                     // result includes a `feature`
      assert.equal(result.feature.id, '+[Q18,Q27611]');                // feature has an `id`
      assert.ok(result.feature.properties instanceof Object);          // feature has `properties`
      assert.equal(result.feature.properties.id, '+[Q18,Q27611]');     // properties has an `id` property
      assert.equal(typeof result.feature.properties.area, 'number');   // properties has a numeric `area` property
    });

    await t.test('sorts excluded countrycoder locations', t => {
      const locationSet = { include: ['001'], exclude: ['013', '005'] };
      const result = loco.resolveLocationSet(locationSet);
      assert.ok(result instanceof Object);
      assert.equal(result.type, 'locationset');
      assert.equal(result.locationSet, locationSet);
      assert.equal(result.id, '+[Q2]-[Q18,Q27611]');
      assert.ok(result.feature instanceof Object);                        // result includes a `feature`
      assert.equal(result.feature.id, '+[Q2]-[Q18,Q27611]');              // feature has an `id`
      assert.ok(result.feature.properties instanceof Object);             // feature has `properties`
      assert.equal(result.feature.properties.id, '+[Q2]-[Q18,Q27611]');   // properties has an `id` property
      assert.equal(typeof result.feature.properties.area, 'number');      // properties has a numeric `area` property
    });
  });


  await t.test('`.geojson` filenames', async t => {
    await t.test('sorts included .geojson locations', t => {
      const locationSet = { include: ['philly_metro.geojson', 'dc_metro.geojson'] };
      const result = loco.resolveLocationSet(locationSet);
      assert.ok(result instanceof Object);
      assert.equal(result.type, 'locationset');
      assert.equal(result.locationSet, locationSet);
      assert.equal(result.id, '+[dc_metro.geojson,philly_metro.geojson]');
      assert.ok(result.feature instanceof Object);                                               // result includes a `feature`
      assert.equal(result.feature.id, '+[dc_metro.geojson,philly_metro.geojson]');               // feature has an `id`
      assert.ok(result.feature.properties instanceof Object);                                    // feature has `properties`
      assert.equal(result.feature.properties.id, '+[dc_metro.geojson,philly_metro.geojson]');    // properties has an `id` property
      assert.equal(typeof result.feature.properties.area, 'number');                             // properties has a numeric `area` property
    });

    await t.test('sorts excluded .geojson locations', t => {
      const locationSet = { include: ['001'], exclude: ['philly_metro.geojson', 'dc_metro.geojson'] };
      const result = loco.resolveLocationSet(locationSet);
      assert.ok(result instanceof Object);
      assert.equal(result.type, 'locationset');
      assert.equal(result.locationSet, locationSet);
      assert.equal(result.id, '+[Q2]-[dc_metro.geojson,philly_metro.geojson]');
      assert.ok(result.feature instanceof Object);                                                    // result includes a `feature`
      assert.equal(result.feature.id, '+[Q2]-[dc_metro.geojson,philly_metro.geojson]');               // feature has an `id`
      assert.ok(result.feature.properties instanceof Object);                                         // feature has `properties`
      assert.equal(result.feature.properties.id, '+[Q2]-[dc_metro.geojson,philly_metro.geojson]');    // properties has an `id` property
      assert.equal(typeof result.feature.properties.area, 'number');                                  // properties has a numeric `area` property
    });
  });


  await t.test('points', async t => {
    await t.test('sorts included point locations', t => {
      const locationSet = { include: [[1, 0], [0, 1], [1, 1], [0, 0]] };
      const result = loco.resolveLocationSet(locationSet);
      assert.ok(result instanceof Object);
      assert.equal(result.type, 'locationset');
      assert.equal(result.locationSet, locationSet);
      assert.equal(result.id, '+[[0,0],[0,1],[1,0],[1,1]]');
      assert.ok(result.feature instanceof Object);                                 // result includes a `feature`
      assert.equal(result.feature.id, '+[[0,0],[0,1],[1,0],[1,1]]');               // feature has an `id`
      assert.ok(result.feature.properties instanceof Object);                      // feature has `properties`
      assert.equal(result.feature.properties.id, '+[[0,0],[0,1],[1,0],[1,1]]');    // properties has an `id` property
      assert.equal(typeof result.feature.properties.area, 'number');               // properties has a numeric `area` property
    });

    await t.test('sorts excluded point locations', t => {
      const locationSet = { include: ['001'], exclude: [[1, 0], [0, 1], [1, 1], [0, 0]] };
      const result = loco.resolveLocationSet(locationSet);
      assert.ok(result instanceof Object);
      assert.equal(result.type, 'locationset');
      assert.equal(result.locationSet, locationSet);
      assert.equal(result.id, '+[Q2]-[[0,0],[0,1],[1,0],[1,1]]');
      assert.ok(result.feature instanceof Object);                                      // result includes a `feature`
      assert.equal(result.feature.id, '+[Q2]-[[0,0],[0,1],[1,0],[1,1]]');               // feature has an `id`
      assert.ok(result.feature.properties instanceof Object);                           // feature has `properties`
      assert.equal(result.feature.properties.id, '+[Q2]-[[0,0],[0,1],[1,0],[1,1]]');    // properties has an `id` property
      assert.equal(typeof result.feature.properties.area, 'number');                    // properties has a numeric `area` property
    });
  });


  await t.test('(strict mode) included junk locations throw an error', t => {
    const locationSet = { include: ['fake', 'null'] };
    assert.throws(() => loco.resolveLocationSet(locationSet));
  });

  await t.test('(non strict mode) ignores included junk locations', t => {
    const locationSet = { include: ['fake', 'null'] };
    const result = locoNS.resolveLocationSet(locationSet);
    assert.ok(result instanceof Object);
    assert.equal(result.type, 'locationset');
    assert.equal(result.locationSet, locationSet);
    assert.equal(result.id, '+[Q2]');
    assert.ok(result.feature instanceof Object);                     // result includes a `feature`
    assert.equal(result.feature.id, 'Q2');                           // feature has an `id`
    assert.ok(result.feature.properties instanceof Object);          // feature has `properties`
    assert.equal(result.feature.properties.id, 'Q2');                // properties has an `id` property
    assert.equal(typeof result.feature.properties.area, 'number');   // properties has a numeric `area` property
  });

  await t.test('(strict mode) excluded junk locations throw an error', t => {
    const locationSet = { include: ['001'], exclude: ['fake', 'null'] };
    assert.throws(() => loco.resolveLocationSet(locationSet));
  });

  await t.test('(non strict mode) ignores excluded junk locations', t => {
    const locationSet = { include: ['001'], exclude: ['fake', 'null'] };
    const result = locoNS.resolveLocationSet(locationSet);
    assert.ok(result instanceof Object);
    assert.equal(result.type, 'locationset');
    assert.equal(result.locationSet, locationSet);
    assert.equal(result.id, '+[Q2]');
    assert.ok(result.feature instanceof Object);                     // result includes a `feature`
    assert.equal(result.feature.id, 'Q2');                           // feature has an `id`
    assert.ok(result.feature.properties instanceof Object);          // feature has `properties`
    assert.equal(result.feature.properties.id, 'Q2');                // properties has an `id` property
    assert.equal(typeof result.feature.properties.area, 'number');   // properties has a numeric `area` property
  });

  await t.test('sorts included countrycoder < geojson < point', t => {
    const locationSet = { include: ['philly_metro.geojson', [0,0], 'ca'] };
    const result = loco.resolveLocationSet(locationSet);
    assert.ok(result instanceof Object);
    assert.equal(result.type, 'locationset');
    assert.equal(result.locationSet, locationSet);
    assert.equal(result.id, '+[Q16,philly_metro.geojson,[0,0]]');
    assert.ok(result.feature instanceof Object);                                       // result includes a `feature`
    assert.equal(result.feature.id, '+[Q16,philly_metro.geojson,[0,0]]');              // feature has an `id`
    assert.ok(result.feature.properties instanceof Object);                            // feature has `properties`
    assert.equal(result.feature.properties.id, '+[Q16,philly_metro.geojson,[0,0]]');   // properties has an `id` property
    assert.equal(typeof result.feature.properties.area, 'number');                     // properties has a numeric `area` property
  });

  await t.test('sorts excluded countrycoder < geojson < point', t => {
    const locationSet = { include: ['001'], exclude: ['philly_metro.geojson', [0,0], 'ca'] };
    const result = loco.resolveLocationSet(locationSet);
    assert.ok(result instanceof Object);
    assert.equal(result.type, 'locationset');
    assert.equal(result.locationSet, locationSet);
    assert.equal(result.id, '+[Q2]-[Q16,philly_metro.geojson,[0,0]]');
    assert.ok(result.feature instanceof Object);                                            // result includes a `feature`
    assert.equal(result.feature.id, '+[Q2]-[Q16,philly_metro.geojson,[0,0]]');              // feature has an `id`
    assert.ok(result.feature.properties instanceof Object);                                 // feature has `properties`
    assert.equal(result.feature.properties.id, '+[Q2]-[Q16,philly_metro.geojson,[0,0]]');   // properties has an `id` property
    assert.equal(typeof result.feature.properties.area, 'number');                          // properties has a numeric `area` property
  });

});
