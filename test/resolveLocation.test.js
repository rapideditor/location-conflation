const test = require('tap').test;
const LocationConflation = require('../.');

const features = require('./fixtures/features.json');
const loco = new LocationConflation(features);


test('resolveLocation', t => {

  t.test('points', t => {
    t.test('a valid [lon,lat] coordinate pair returns a feature match', t => {
      const result = loco.resolveLocation([0, 0]);
      t.notEqual(result, null);
      t.equal(result.type, 'point');
      t.type(result.feature, 'object');
      t.type(result.feature.properties, 'object');
      t.equal(result.feature.id, '[0,0]');                  // has an id
      t.equal(result.feature.properties.id, '[0,0]');       // has an id property
      t.match(result.feature.properties, { area: /\d+/ });  // has a numeric area property
      t.end();
    });
    t.test('an invalid [lon,lat] coordinate pair returns a null match', t => {
      const result = loco.resolveLocation([]);
      t.equal(result, null);
      t.end();
    });
    t.end();
  });


  t.test('`.geojson` filenames', t => {
    t.test('a known `.geojson` filename with id returns a feature match', t => {
      const result = loco.resolveLocation('dc_metro.geojson');
      t.notEqual(result, null);
      t.equal(result.type, 'geojson');
      t.type(result.feature, 'object');
      t.type(result.feature.properties, 'object');
      t.equal(result.feature.id, 'dc_metro.geojson');              // has an id
      t.equal(result.feature.properties.id, 'dc_metro.geojson');   // has an id property
      t.match(result.feature.properties, { area: /\d+/ });         // has a numeric area property
      t.end();
    });
    t.test('a known `.geojson` filename with id property returns a feature match', t => {
      const result = loco.resolveLocation('philly_metro.geojson');
      t.notEqual(result, null);
      t.equal(result.type, 'geojson');
      t.type(result.feature, 'object');
      t.type(result.feature.properties, 'object');
      t.equal(result.feature.id, 'philly_metro.geojson');              // has an id
      t.equal(result.feature.properties.id, 'philly_metro.geojson');   // has an id property
      t.match(result.feature.properties, { area: /\d+/ });             // has a numeric area property
      t.end();
    });
    t.test('`.geojson` identifiers compare as lowercase', t => {
      const result = loco.resolveLocation('PHiLLy_MeTRo.GeoJSoN');
      t.notEqual(result, null);
      t.equal(result.type, 'geojson');
      t.type(result.feature, 'object');
      t.type(result.feature.properties, 'object');
      t.equal(result.feature.id, 'philly_metro.geojson');              // has an id
      t.equal(result.feature.properties.id, 'philly_metro.geojson');   // has an id property
      t.match(result.feature.properties, { area: /\d+/ });             // has a numeric area property
      t.end();
    });
    t.test('an invalid `.geojson` filename returns a null match', t => {
      const result = loco.resolveLocation('fake.geojson');
      t.equal(result, null);
      t.end();
    });
    t.end();
  });


  t.test('country coder feature identifiers', t => {
    t.test('a valid country coder feature identifier returns a feature match', t => {
      const result = loco.resolveLocation('gb');
      t.notEqual(result, null);
      t.equal(result.type, 'countrycoder');
      t.type(result.feature, 'object');
      t.type(result.feature.properties, 'object');
      t.equal(result.feature.id, 'Q145');                   // has an id
      t.equal(result.feature.properties.id, 'Q145');        // has an id property
      t.match(result.feature.properties, { area: /\d+/ });  // has a numeric area property
      t.end();
    });
    t.test('an invalid country coder feature identifier returns a null match', t => {
      const result = loco.resolveLocation('fake');
      t.equal(result, null);
      t.end();
    });
    t.end();
  });

  t.end();
});
