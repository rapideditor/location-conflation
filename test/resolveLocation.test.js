import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { LocationConflation } from '../index.mjs';

import features from './fixtures/features.json' assert {type: 'json'};
const loco = new LocationConflation(features);
const locoNS = new LocationConflation(features);
locoNS.strict = false;

test('resolveLocation', async t => {

  await t.test('points', async t => {
    await t.test('a valid [lon, lat] Array returns a feature match', t => {
      const location = [0, 0];
      const result = loco.resolveLocation(location);
      assert.ok(result instanceof Object);
      assert.equal(result.type, 'point');
      assert.equal(result.location, location);
      assert.ok(result.feature instanceof Object);               // result includes a `feature`
      assert.equal(result.feature.id, '[0,0]');                  // feature has an `id`
      assert.ok(result.feature.properties instanceof Object);    // feature has `properties`
      assert.equal(result.feature.properties.id, '[0,0]');       // properties has an `id` property
      assert.equal(result.feature.properties.area, 1963.5);      // area = Pi * 25 * 25
    });

    await t.test('a valid [lon, lat, radius] Array returns a feature match', t => {
      const location = [0, 0, 100];
      const result = loco.resolveLocation(location);
      assert.ok(result instanceof Object);
      assert.equal(result.type, 'point');
      assert.equal(result.location, location);
      assert.ok(result.feature instanceof Object);               // result includes a `feature`
      assert.equal(result.feature.id, '[0,0,100]');              // feature has an `id`
      assert.ok(result.feature.properties instanceof Object);    // feature has `properties`
      assert.equal(result.feature.properties.id, '[0,0,100]');   // properties has an `id` property
      assert.equal(result.feature.properties.area, 31415.93);    // area = Pi * 100 * 100
    });

    await t.test('(strict mode) an invalid [lon, lat] Array throws an error', t => {
      const location = [];
      assert.throws(() => loco.resolveLocation(location));
    });

    await t.test('(non strict mode) an invalid [lon, lat] Array returns null', t => {
      const location = [];
      assert.equal(locoNS.resolveLocation(location), null);
    });
  });


  await t.test('`.geojson` filenames', async t => {
    await t.test('a known `.geojson` filename with id returns a feature match', t => {
      const location = 'dc_metro.geojson';
      const result = loco.resolveLocation(location);
      assert.ok(result instanceof Object);
      assert.equal(result.type, 'geojson');
      assert.equal(result.location, location);
      assert.ok(result.feature instanceof Object);                      // result includes a `feature`
      assert.equal(result.feature.id, 'dc_metro.geojson');              // feature has an `id`
      assert.ok(result.feature.properties instanceof Object);           // feature has `properties`
      assert.equal(result.feature.properties.id, 'dc_metro.geojson');   // properties has an `id` property
      assert.equal(typeof result.feature.properties.area, 'number');    // properties has a numeric `area` property
    });

    await t.test('a known `.geojson` filename with id property returns a feature match', t => {
      const location = 'philly_metro.geojson';
      const result = loco.resolveLocation(location);
      assert.ok(result instanceof Object);
      assert.equal(result.type, 'geojson');
      assert.equal(result.location, location);
      assert.ok(result.feature instanceof Object);                          // result includes a `feature`
      assert.equal(result.feature.id, 'philly_metro.geojson');              // feature has an `id`
      assert.ok(result.feature.properties instanceof Object);               // feature has `properties`
      assert.equal(result.feature.properties.id, 'philly_metro.geojson');   // properties has an `id` property
      assert.equal(typeof result.feature.properties.area, 'number');        // properties has a numeric `area` property
    });

    await t.test('`.geojson` identifiers compare as lowercase', t => {
      const location = 'PHiLLy_MeTRo.GeoJSoN';
      const result = loco.resolveLocation(location);
      assert.ok(result instanceof Object);
      assert.equal(result.type, 'geojson');
      assert.equal(result.location, location);
      assert.ok(result.feature instanceof Object);                          // result includes a `feature`
      assert.equal(result.feature.id, 'philly_metro.geojson');              // feature has an `id`
      assert.ok(result.feature.properties instanceof Object);               // feature has `properties`
      assert.equal(result.feature.properties.id, 'philly_metro.geojson');   // properties has an `id` property
      assert.equal(typeof result.feature.properties.area, 'number');        // properties has a numeric `area` property
    });

    await t.test('(strict mode) an invalid `.geojson` filename throws an error', t => {
      const location = 'fake.geojson';
      assert.throws(() => loco.resolveLocation(location));
    });

    await t.test('(non strict mode) an invalid `.geojson` filename returns null', t => {
      const location = 'fake.geojson';
      assert.equal(locoNS.resolveLocation(location), null);
    });
  });


  await t.test('country coder feature identifiers', async t => {
    await t.test('a valid country coder feature identifier returns a feature match', t => {
      const location = 'gb';
      const result = loco.resolveLocation(location);
      assert.ok(result instanceof Object);
      assert.equal(result.type, 'countrycoder');
      assert.equal(result.location, location);
      assert.ok(result.feature instanceof Object);                     // result includes a `feature`
      assert.equal(result.feature.id, 'Q145');                         // feature has an `id`
      assert.ok(result.feature.properties instanceof Object);          // feature has `properties`
      assert.equal(result.feature.properties.id, 'Q145');              // properties has an `id` property
      assert.equal(typeof result.feature.properties.area, 'number');   // properties has a numeric `area` property
    });

    await t.test('(strict mode) an invalid country coder feature identifier throws an error', t => {
      const location = 'fake';
      assert.throws(() => loco.resolveLocation(location));
    });

    await t.test('(non strict mode) an invalid country coder feature identifier returns null', t => {
      const location = 'fake';
      assert.equal(locoNS.resolveLocation(location), null);
    });
  });

});
