const test = require('tap').test;
const LocationConflation = require('../.');

const features = require('./fixtures/features.json');
const loco = new LocationConflation(features);


test('validateLocation', t => {

  t.test('points', t => {
    t.test('a valid [lon,lat] coordinate pair returns a "point" result', t => {
      [[0, 0], [-180, -90], [180, -90], [180, 90]].forEach(val => {
        const result = loco.validateLocation(val);
        t.type(result, 'object');
        t.equal(result.type, 'point');
        t.equal(result.id, '[' + val.toString() + ']');
      });
      t.end();
    });
    t.test('an invalid [lon,lat] coordinate pair returns false', t => {
      t.notOk(loco.validateLocation([]));
      t.notOk(loco.validateLocation(['a']));
      t.notOk(loco.validateLocation([0]));
      t.notOk(loco.validateLocation([0, 0, 0]));
      t.notOk(loco.validateLocation([-181, -90]));
      t.notOk(loco.validateLocation([-180, 91]));
      t.notOk(loco.validateLocation([181, -90]));
      t.notOk(loco.validateLocation([180, 91]));
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
        t.equal(result.id, val);
      });
      t.end();
    });
    t.test('an invalid `.geojson` identifier returns false', t => {
      t.notOk(loco.validateLocation('philly_metro'));           // missing .geojson
      t.notOk(loco.validateLocation('fake.geojson'));           // fake filename
      t.end();
    });
    t.test('`.geojson` identifiers compare as lowercase', t => {
      const result = loco.validateLocation('PHiLLy_MeTRo.GeoJSoN');
      t.type(result, 'object');
      t.equal(result.type, 'geojson');
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
        t.equal(result.id, 'Q145');
      });
      t.end();
    });
    t.test('an invalid country coder identifier returns false', t => {
      t.notOk(loco.validateLocation(''));
      t.notOk(loco.validateLocation('false'));
      t.notOk(loco.validateLocation('null'));
      t.end();
    });
    t.end();
  });

  t.end();
});
