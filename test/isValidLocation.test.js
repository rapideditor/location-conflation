const test = require('tap').test;
const LocationConflation = require('../.');

const features = require('./fixtures/features.json');
const loco = new LocationConflation(features);


test('isValidLocation', t => {

  t.test('points', t => {
    t.test('a valid [lon,lat] coordinate pair returns "point"', t => {
      t.equal('point', loco.isValidLocation([0, 0]));
      t.equal('point', loco.isValidLocation([-180, -90]));
      t.equal('point', loco.isValidLocation([-180, 90]));
      t.equal('point', loco.isValidLocation([180, -90]));
      t.equal('point', loco.isValidLocation([180, 90]));
      t.end();
    });
    t.test('an invalid [lon,lat] coordinate pair returns false', t => {
      t.false(loco.isValidLocation([]));
      t.false(loco.isValidLocation(['a']));
      t.false(loco.isValidLocation([0]));
      t.false(loco.isValidLocation([0, 0, 0]));
      t.false(loco.isValidLocation([-181, -90]));
      t.false(loco.isValidLocation([-180, 91]));
      t.false(loco.isValidLocation([181, -90]));
      t.false(loco.isValidLocation([180, 91]));
      t.end();
    });
    t.end();
  });


  t.test('`.geojson` filenames', t => {
    t.test('a valid `.geojson` filename in this project returns "geojson"', t => {
      t.equal('geojson', loco.isValidLocation('philly_metro.geojson'));
      t.end();
    });
    t.test('an invalid `.geojson` filename in this project returns false', t => {
      t.false(loco.isValidLocation('philly_metro'));           // missing .geojson
      t.false(loco.isValidLocation('fake.geojson'));           // fake filename
      t.end();
    });
    t.end();
  });


  t.test('country coder feature identifiers', t => {
    t.test('a valid country coder feature identifier returns "countrycoder"', t => {
      t.equal('countrycoder', loco.isValidLocation('GB'));
      t.equal('countrycoder', loco.isValidLocation('gb'));
      t.equal('countrycoder', loco.isValidLocation('GBR'));
      t.equal('countrycoder', loco.isValidLocation('gbr'));
      t.equal('countrycoder', loco.isValidLocation('826'));
      t.equal('countrycoder', loco.isValidLocation(826));
      t.equal('countrycoder', loco.isValidLocation('Q145'));
      t.equal('countrycoder', loco.isValidLocation('🇬🇧'));
      t.equal('countrycoder', loco.isValidLocation('united kingdom'));
      t.end();
    });
    t.test('an invalid country coder feature identifier returns false', t => {
      t.false(loco.isValidLocation(''));
      t.false(loco.isValidLocation('false'));
      t.false(loco.isValidLocation('null'));
      t.end();
    });
    t.end();
  });

  t.end();
});
