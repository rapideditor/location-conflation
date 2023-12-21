import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { LocationConflation } from '../index.mjs';

import features from './fixtures/features.json' assert {type: 'json'};
const loco = new LocationConflation(features);
const locoNS = new LocationConflation(features);
locoNS.strict = false;


test('validateLocationSet', async t => {

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
    });

    await t.test('(strict mode) fake included countrycoder locations throw an error', t => {
      const locationSet = { include: ['013', 'fake', '005'] };
      assert.throws(() => loco.resolveLocationSet(locationSet));
    });

    await t.test('(non strict mode) fake included countrycoder locations are ignored', t => {
      const locationSet = { include: ['013', 'fake', '005'] };
      const result = locoNS.resolveLocationSet(locationSet);
      assert.ok(result instanceof Object);
      assert.equal(result.type, 'locationset');
      assert.equal(result.locationSet, locationSet);
      assert.equal(result.id, '+[Q18,Q27611]');
    });

    await t.test('sorts excluded countrycoder locations', t => {
      const locationSet = { include: ['001'], exclude: ['013', '005'] };
      const result = loco.resolveLocationSet(locationSet);
      assert.ok(result instanceof Object);
      assert.equal(result.type, 'locationset');
      assert.equal(result.locationSet, locationSet);
      assert.equal(result.id, '+[Q2]-[Q18,Q27611]');
    });

    await t.test('(strict mode) fake excluded countrycoder locations throw an error', t => {
      const locationSet = { include: ['001'], exclude: ['013', 'fake', '005'] };
      assert.throws(() => loco.resolveLocationSet(locationSet));
    });

    await t.test('(non strict mode) fake excluded countrycoder locations are ignored', t => {
      const locationSet = { include: ['001'], exclude: ['013', 'fake', '005'] };
      const result = locoNS.resolveLocationSet(locationSet);
      assert.ok(result instanceof Object);
      assert.equal(result.type, 'locationset');
      assert.equal(result.locationSet, locationSet);
      assert.equal(result.id, '+[Q2]-[Q18,Q27611]');
    });

    await t.test('(strict mode) missing include throws an error', t => {
      const locationSet = { exclude: ['013', '005'] };
      assert.throws(() => loco.resolveLocationSet(locationSet));
    });

    await t.test('(non strict mode) missing include is replaced with world', t => {
      const locationSet = { exclude: ['013', '005'] };
      const result = locoNS.resolveLocationSet(locationSet);
      assert.ok(result instanceof Object);
      assert.equal(result.type, 'locationset');
      assert.equal(result.locationSet, locationSet);
      assert.equal(result.id, '+[Q2]-[Q18,Q27611]');
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
    });

    await t.test('(strict mode) fake included .geojson locations throw an error', t => {
      const locationSet = { include: ['philly_metro.geojson', 'fake.geojson', 'dc_metro.geojson'] };
      assert.throws(() => loco.resolveLocationSet(locationSet));
    });

    await t.test('(non strict mode) fake included .geojson locations are ignored', t => {
      const locationSet = { include: ['philly_metro.geojson', 'fake.geojson', 'dc_metro.geojson'] };
      const result = locoNS.resolveLocationSet(locationSet);
      assert.ok(result instanceof Object);
      assert.equal(result.type, 'locationset');
      assert.equal(result.locationSet, locationSet);
      assert.equal(result.id, '+[dc_metro.geojson,philly_metro.geojson]');
    });

    await t.test('sorts excluded .geojson locations', t => {
      const locationSet = { include: ['001'], exclude: ['philly_metro.geojson', 'dc_metro.geojson'] };
      const result = loco.resolveLocationSet(locationSet);
      assert.ok(result instanceof Object);
      assert.equal(result.type, 'locationset');
      assert.equal(result.locationSet, locationSet);
      assert.equal(result.id, '+[Q2]-[dc_metro.geojson,philly_metro.geojson]');
    });

    await t.test('(strict mode) fake excluded .geojson locations throw an error', t => {
      const locationSet = { include: ['001'], exclude: ['philly_metro.geojson', 'fake.geojson', 'dc_metro.geojson'] };
      assert.throws(() => loco.resolveLocationSet(locationSet));
    });

    await t.test('(non strict mode) fake excluded .geojson locations are ignored', t => {
      const locationSet = { include: ['001'], exclude: ['philly_metro.geojson', 'fake.geojson', 'dc_metro.geojson'] };
      const result = locoNS.resolveLocationSet(locationSet);
      assert.ok(result instanceof Object);
      assert.equal(result.type, 'locationset');
      assert.equal(result.locationSet, locationSet);
      assert.equal(result.id, '+[Q2]-[dc_metro.geojson,philly_metro.geojson]');
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
    });

    await t.test('(strict mode) fake included point locations throw an error', t => {
      const locationSet = { include: [[1, 0], [0, 1], [NaN, NaN], [1, 1], [0, 0]] };
      assert.throws(() => loco.resolveLocationSet(locationSet));
    });

    await t.test('(non strict mode) fake included point locations are ignored', t => {
      const locationSet = { include: [[1, 0], [0, 1], [NaN, NaN], [1, 1], [0, 0]] };
      const result = locoNS.resolveLocationSet(locationSet);
      assert.ok(result instanceof Object);
      assert.equal(result.type, 'locationset');
      assert.equal(result.locationSet, locationSet);
      assert.equal(result.id, '+[[0,0],[0,1],[1,0],[1,1]]');
    });

    await t.test('sorts excluded point locations', t => {
      const locationSet = { include: ['001'], exclude: [[1, 0], [0, 1], [1, 1], [0, 0]] };
      const result = loco.resolveLocationSet(locationSet);
      assert.ok(result instanceof Object);
      assert.equal(result.type, 'locationset');
      assert.equal(result.locationSet, locationSet);
      assert.equal(result.id, '+[Q2]-[[0,0],[0,1],[1,0],[1,1]]');
    });

    await t.test('(strict mode) fake excluded point locations throw an error', t => {
      const locationSet = { include: ['001'], exclude: [[1, 0], [0, 1], [NaN, NaN], [1, 1], [0, 0]] };
      assert.throws(() => loco.resolveLocationSet(locationSet));
    });

    await t.test('(non strict mode) fake excluded point locations are ignored', t => {
      const locationSet = { include: ['001'], exclude: [[1, 0], [0, 1], [NaN, NaN], [1, 1], [0, 0]] };
      const result = locoNS.resolveLocationSet(locationSet);
      assert.ok(result instanceof Object);
      assert.equal(result.type, 'locationset');
      assert.equal(result.locationSet, locationSet);
      assert.equal(result.id, '+[Q2]-[[0,0],[0,1],[1,0],[1,1]]');
    });
  });


  await t.test('sorts included countrycoder < geojson < point', t => {
    const locationSet = { include: ['philly_metro.geojson', [0,0], 'ca'] };
    const result = loco.resolveLocationSet(locationSet);
    assert.ok(result instanceof Object);
    assert.equal(result.type, 'locationset');
    assert.equal(result.locationSet, locationSet);
    assert.equal(result.id, '+[Q16,philly_metro.geojson,[0,0]]');
  });

  await t.test('sorts excluded countrycoder < geojson < point', t => {
    const locationSet = { include: ['001'], exclude: ['philly_metro.geojson', [0,0], 'ca'] };
    const result = loco.resolveLocationSet(locationSet);
    assert.ok(result instanceof Object);
    assert.equal(result.type, 'locationset');
    assert.equal(result.locationSet, locationSet);
    assert.equal(result.id, '+[Q2]-[Q16,philly_metro.geojson,[0,0]]');
  });

  await t.test('force lowercase', t => {
    const locationSet = { include: ['US'], exclude: ['PR'] };
    const result = loco.resolveLocationSet(locationSet);
    assert.ok(result instanceof Object);
    assert.equal(result.type, 'locationset');
    assert.equal(result.locationSet, locationSet);
    assert.equal(result.id, '+[Q30]-[Q1183]');
  });

});
