const test = require('tap').test;
const loco = require('../.');

const features = {
  philly_metro: {
    type: 'Feature',
    id: 'philly_metro',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-75.7, 40.3],
          [-75.3, 40.4],
          [-74.7, 40.3],
          [-74.45, 40.1],
          [-74.9, 39.55],
          [-75.5, 39.55],
          [-75.8, 39.7218],
          [-76.23, 39.7211],
          [-75.7, 40.3]
        ]
      ]
    }
  }
};


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
      t.equal('geojson', loco.isValidLocation('philly_metro.geojson', features));
      t.end();
    });
    t.test('an invalid `.geojson` filename in this project returns false', t => {
      t.false(loco.isValidLocation('philly_metro.geojson'));        // no features to check it against
      t.false(loco.isValidLocation('philly_metro', features));  // missing .geojson
      t.false(loco.isValidLocation('fake.geojson', features));  // fake filename
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
