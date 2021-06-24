import { test } from 'tap';
import LocationConflation from '../index.mjs';

import features from './fixtures/features.json';
const loco = new LocationConflation(features);
const locoNS = new LocationConflation(features).strict(false);


test('validateLocation', t => {

  t.test('points', t => {
    t.test('a valid [lon, lat] array returns a "point" result', t => {
      [[0, 0], [-180, -90], [180, -90], [180, 90]].forEach(val => {
        const result = loco.validateLocation(val);
        t.type(result, 'object');
        t.equal(result.type, 'point');
        t.equal(result.location, val);
        t.equal(result.id, '[' + val.toString() + ']');
      });
      t.end();
    });
    t.test('a valid [lon, lat, radius] array returns a "point" result', t => {
      [[0, 0, 20], [-180, -90, 20], [180, -90, 20], [180, 90, 20]].forEach(val => {
        const result = loco.validateLocation(val);
        t.type(result, 'object');
        t.equal(result.type, 'point');
        t.equal(result.location, val);
        t.equal(result.id, '[' + val.toString() + ']');
      });
      t.end();
    });
    t.test('(strict mode) an invalid [lon, lat, radius?] Array throws an error', t => {
      t.throws(() => loco.validateLocation([]));
      t.throws(() => loco.validateLocation(['a']));
      t.throws(() => loco.validateLocation([0]));
      t.throws(() => loco.validateLocation([-181, -90]));
      t.throws(() => loco.validateLocation([-180, 91]));
      t.throws(() => loco.validateLocation([181, -90]));
      t.throws(() => loco.validateLocation([180, 91]));
      t.throws(() => loco.validateLocation([10, 10, null]));
      t.throws(() => loco.validateLocation([10, 10, -10]));
      t.throws(() => loco.validateLocation([10, 10, 0]));
      t.throws(() => loco.validateLocation([10, 10, 10, 10]));
      t.end();
    });
    t.test('(non strict mode) an invalid [lon, lat, radius?] Array returns falsy', t => {
      t.notOk(locoNS.validateLocation([]));
      t.notOk(locoNS.validateLocation(['a']));
      t.notOk(locoNS.validateLocation([0]));
      t.notOk(locoNS.validateLocation([-181, -90]));
      t.notOk(locoNS.validateLocation([-180, 91]));
      t.notOk(locoNS.validateLocation([181, -90]));
      t.notOk(locoNS.validateLocation([180, 91]));
      t.notOk(locoNS.validateLocation([10, 10, null]));
      t.notOk(locoNS.validateLocation([10, 10, -10]));
      t.notOk(locoNS.validateLocation([10, 10, 0]));
      t.notOk(locoNS.validateLocation([10, 10, 10, 10]));
      t.end();
    });
    t.end();
  });


  t.test('`.geojson` filenames', t => {
    t.test('a valid `.geojson` identifier returns a "geojson" result', t => {
      ['philly_metro.geojson', 'dc_metro.geojson'].forEach(val => {
        const result = loco.validateLocation(val);
        t.type(result, 'object');
        t.equal(result.type, 'geojson');
        t.equal(result.location, val);
        t.equal(result.id, val);
      });
      t.end();
    });
    t.test('(strict mode) an invalid `.geojson` identifier throws an error', t => {
      t.throws(() => loco.validateLocation('philly_metro'));      // missing .geojson
      t.throws(() => loco.validateLocation('fake.geojson'));      // fake filename
      t.end();
    });
    t.test('(non strict mode) an invalid `.geojson` identifier returns falsy', t => {
      t.notOk(locoNS.validateLocation('philly_metro'));           // missing .geojson
      t.notOk(locoNS.validateLocation('fake.geojson'));           // fake filename
      t.end();
    });
    t.test('`.geojson` identifiers compare as lowercase', t => {
      const result = loco.validateLocation('PHiLLy_MeTRo.GeoJSoN');
      t.type(result, 'object');
      t.equal(result.type, 'geojson');
      t.equal(result.location, 'PHiLLy_MeTRo.GeoJSoN');
      t.equal(result.id, 'philly_metro.geojson');
      t.end();
    });
    t.end();
  });


  t.test('country coder feature identifiers', t => {
    t.test('a valid country coder identifier returns a "countrycoder" result', t => {
      ['GB', 'gb', 'gbr', '826', 826, 'Q145', '🇬🇧', 'united kingdom'].forEach(val => {
        const result = loco.validateLocation(val);
        t.type(result, 'object');
        t.equal(result.type, 'countrycoder');
        t.equal(result.location, val);
        t.equal(result.id, 'Q145');
      });
      t.end();
    });
    t.test('(strict mode) an invalid country coder identifier throws an error', t => {
      t.throws(() => loco.validateLocation(''));
      t.throws(() => loco.validateLocation('false'));
      t.throws(() => loco.validateLocation('null'));
      t.end();
    });
    t.test('(non strict mode) an invalid country coder identifier returns falsy', t => {
      t.notOk(locoNS.validateLocation(''));
      t.notOk(locoNS.validateLocation('false'));
      t.notOk(locoNS.validateLocation('null'));
      t.end();
    });
    t.end();
  });

  t.end();
});
