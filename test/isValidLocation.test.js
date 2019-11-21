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
    t.test('a valid [lon,lat] coordinate pair returns true', t => {
      t.true(loco.isValidLocation([0, 0]));
      t.true(loco.isValidLocation([-180, -90]));
      t.true(loco.isValidLocation([-180, 90]));
      t.true(loco.isValidLocation([180, -90]));
      t.true(loco.isValidLocation([180, 90]));
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
    t.test('a valid `.geojson` filename in this project returns true', t => {
      t.true(loco.isValidLocation('philly_metro.geojson', features));
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
    t.test('a valid country coder feature identifier returns true', t => {
      t.true(loco.isValidLocation('GB'));
      t.true(loco.isValidLocation('gb'));
      t.true(loco.isValidLocation('GBR'));
      t.true(loco.isValidLocation('gbr'));
      t.true(loco.isValidLocation('826'));
      t.true(loco.isValidLocation(826));
      t.true(loco.isValidLocation('Q145'));
      t.true(loco.isValidLocation('🇬🇧'));
      t.true(loco.isValidLocation('united kingdom'));
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
