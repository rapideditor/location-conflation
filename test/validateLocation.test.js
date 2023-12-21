import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { LocationConflation } from '../index.mjs';

import features from './fixtures/features.json' assert {type: 'json'};
const loco = new LocationConflation(features);
const locoNS = new LocationConflation(features);
locoNS.strict = false;


test('validateLocation', async t => {

  await t.test('points', async t => {
    await t.test('a valid [lon, lat] array returns a "point" result', t => {
      [[0, 0], [-180, -90], [180, -90], [180, 90]].forEach(val => {
        const result = loco.validateLocation(val);
        assert.equal(typeof result, 'object');
        assert.equal(result.type, 'point');
        assert.equal(result.location, val);
        assert.equal(result.id, '[' + val.toString() + ']');
      });
    });

    await t.test('a valid [lon, lat, radius] array returns a "point" result', t => {
      [[0, 0, 20], [-180, -90, 20], [180, -90, 20], [180, 90, 20]].forEach(val => {
        const result = loco.validateLocation(val);
        assert.equal(typeof result, 'object');
        assert.equal(result.type, 'point');
        assert.equal(result.location, val);
        assert.equal(result.id, '[' + val.toString() + ']');
      });
    });

    await t.test('(strict mode) an invalid [lon, lat, radius?] Array throws an error', t => {
      assert.throws(() => loco.validateLocation([]));
      assert.throws(() => loco.validateLocation(['a']));
      assert.throws(() => loco.validateLocation([0]));
      assert.throws(() => loco.validateLocation([-181, -90]));
      assert.throws(() => loco.validateLocation([-180, 91]));
      assert.throws(() => loco.validateLocation([181, -90]));
      assert.throws(() => loco.validateLocation([180, 91]));
      assert.throws(() => loco.validateLocation([10, 10, null]));
      assert.throws(() => loco.validateLocation([10, 10, -10]));
      assert.throws(() => loco.validateLocation([10, 10, 0]));
      assert.throws(() => loco.validateLocation([10, 10, 10, 10]));
    });

    await t.test('(non strict mode) an invalid [lon, lat, radius?] Array returns null', t => {
      assert.equal(locoNS.validateLocation([]), null);
      assert.equal(locoNS.validateLocation(['a']), null);
      assert.equal(locoNS.validateLocation([0]), null);
      assert.equal(locoNS.validateLocation([-181, -90]), null);
      assert.equal(locoNS.validateLocation([-180, 91]), null);
      assert.equal(locoNS.validateLocation([181, -90]), null);
      assert.equal(locoNS.validateLocation([180, 91]), null);
      assert.equal(locoNS.validateLocation([10, 10, null]), null);
      assert.equal(locoNS.validateLocation([10, 10, -10]), null);
      assert.equal(locoNS.validateLocation([10, 10, 0]), null);
      assert.equal(locoNS.validateLocation([10, 10, 10, 10]), null);
    });
  });


  await t.test('`.geojson` filenames', async t => {
    await t.test('a valid `.geojson` identifier returns a "geojson" result', t => {
      ['philly_metro.geojson', 'dc_metro.geojson'].forEach(val => {
        const result = loco.validateLocation(val);
        assert.equal(typeof result, 'object');
        assert.equal(result.type, 'geojson');
        assert.equal(result.location, val);
        assert.equal(result.id, val);
      });
    });

    await t.test('(strict mode) an invalid `.geojson` identifier throws an error', t => {
      assert.throws(() => loco.validateLocation('philly_metro'));      // missing .geojson
      assert.throws(() => loco.validateLocation('fake.geojson'));      // fake filename
    });

    await t.test('(non strict mode) an invalid `.geojson` identifier returns null', t => {
      assert.equal(locoNS.validateLocation('philly_metro'), null);     // missing .geojson
      assert.equal(locoNS.validateLocation('fake.geojson'), null);     // fake filename
    });

    await t.test('`.geojson` identifiers compare as lowercase', t => {
      const result = loco.validateLocation('PHiLLy_MeTRo.GeoJSoN');
      assert.equal(typeof result, 'object');
      assert.equal(result.type, 'geojson');
      assert.equal(result.location, 'PHiLLy_MeTRo.GeoJSoN');
      assert.equal(result.id, 'philly_metro.geojson');
    });
  });


  await t.test('country coder feature identifiers', async t => {
    await t.test('a valid country coder identifier returns a "countrycoder" result', t => {
      ['GB', 'gb', 'gbr', '826', 826, 'Q145', '🇬🇧', 'united kingdom'].forEach(val => {
        const result = loco.validateLocation(val);
        assert.equal(typeof result, 'object');
        assert.equal(result.type, 'countrycoder');
        assert.equal(result.location, val);
        assert.equal(result.id, 'Q145');
      });
    });

    await t.test('(strict mode) an invalid country coder identifier throws an error', t => {
      assert.throws(() => loco.validateLocation(''));
      assert.throws(() => loco.validateLocation('false'));
      assert.throws(() => loco.validateLocation('null'));
    });

    await t.test('(non strict mode) an invalid country coder identifier returns null', t => {
      assert.equal(locoNS.validateLocation(''), null);
      assert.equal(locoNS.validateLocation('false'), null);
      assert.equal(locoNS.validateLocation('null'), null);
    });
  });

});
