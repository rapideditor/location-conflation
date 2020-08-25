const test = require('tap').test;
const LocationConflation = require('../.');

const features = require('./fixtures/features.json');
const loco = new LocationConflation(features);
const locoNS = new LocationConflation(features).strict(false);


test('resolveLocation', t => {

  t.test('points', t => {
    t.test('a valid [lon,lat] coordinate pair returns a feature match', t => {
      const location = [0, 0];
      const result = loco.resolveLocation(location);
      t.notEqual(result, null);
      t.equal(result.type, 'point');
      t.equal(result.location, location);
      t.type(result.feature, 'object');                     // result includes a `feature`
      t.equal(result.feature.id, '[0,0]');                  // feature has an `id`
      t.type(result.feature.properties, 'object');          // feature has `properties`
      t.equal(result.feature.properties.id, '[0,0]');       // properties has an `id` property
      t.match(result.feature.properties, { area: /\d+/ });  // properties has a numeric `area` property
      t.end();
    });
    t.test('(strict mode) an invalid [lon,lat] coordinate pair throws an error', t => {
      const location = [];
      t.throws(() => loco.resolveLocation(location));
      t.end();
    });
    t.test('(non strict mode) an invalid [lon,lat] coordinate pair returns falsy', t => {
      const location = [];
      t.notOk(locoNS.resolveLocation(location));
      t.end();
    });
    t.end();
  });


  t.test('`.geojson` filenames', t => {
    t.test('a known `.geojson` filename with id returns a feature match', t => {
      const location = 'dc_metro.geojson';
      const result = loco.resolveLocation(location);
      t.notEqual(result, null);
      t.equal(result.type, 'geojson');
      t.equal(result.location, location);
      t.type(result.feature, 'object');                            // result includes a `feature`
      t.equal(result.feature.id, 'dc_metro.geojson');              // feature has an `id`
      t.type(result.feature.properties, 'object');                 // feature has `properties`
      t.equal(result.feature.properties.id, 'dc_metro.geojson');   // properties has an `id` property
      t.match(result.feature.properties, { area: /\d+/ });         // properties has a numeric `area` property
      t.end();
    });
    t.test('a known `.geojson` filename with id property returns a feature match', t => {
      const location = 'philly_metro.geojson';
      const result = loco.resolveLocation(location);
      t.notEqual(result, null);
      t.equal(result.type, 'geojson');
      t.equal(result.location, location);
      t.type(result.feature, 'object');                                // result includes a `feature`
      t.equal(result.feature.id, 'philly_metro.geojson');              // feature has an `id`
      t.type(result.feature.properties, 'object');                     // feature has `properties`
      t.equal(result.feature.properties.id, 'philly_metro.geojson');   // properties has an `id` property
      t.match(result.feature.properties, { area: /\d+/ });             // properties has a numeric `area` property
      t.end();
    });
    t.test('`.geojson` identifiers compare as lowercase', t => {
      const location = 'PHiLLy_MeTRo.GeoJSoN';
      const result = loco.resolveLocation(location);
      t.notEqual(result, null);
      t.equal(result.type, 'geojson');
      t.equal(result.location, location);
      t.type(result.feature, 'object');                                // result includes a `feature`
      t.equal(result.feature.id, 'philly_metro.geojson');              // feature has an `id`
      t.type(result.feature.properties, 'object');                     // feature has `properties`
      t.equal(result.feature.properties.id, 'philly_metro.geojson');   // properties has an `id` property
      t.match(result.feature.properties, { area: /\d+/ });             // properties has a numeric `area` property
      t.end();
    });
    t.test('(strict mode) an invalid `.geojson` filename throws an error', t => {
      const location = 'fake.geojson';
      t.throws(() => loco.resolveLocation(location));
      t.end();
    });
    t.test('(non strict mode) an invalid `.geojson` filename returns falsy', t => {
      const location = 'fake.geojson';
      t.notOk(locoNS.resolveLocation(location));
      t.end();
    });
    t.end();
  });


  t.test('country coder feature identifiers', t => {
    t.test('a valid country coder feature identifier returns a feature match', t => {
      const location = 'gb';
      const result = loco.resolveLocation(location);
      t.notEqual(result, null);
      t.equal(result.type, 'countrycoder');
      t.equal(result.location, location);
      t.type(result.feature, 'object');                       // result includes a `feature`
      t.equal(result.feature.id, 'Q145');                     // feature has an `id`
      t.type(result.feature.properties, 'object');            // feature has `properties`
      t.equal(result.feature.properties.id, 'Q145');          // properties has an `id` property
      t.match(result.feature.properties, { area: /\d+/ });    // properties has a numeric `area` property
      t.end();
    });
    t.test('(strict mode) an invalid country coder feature identifier throws an error', t => {
      const location = 'fake';
      t.throws(() => loco.resolveLocation(location));
      t.end();
    });
    t.test('(non strict mode) an invalid country coder feature identifier returns falsy', t => {
      const location = 'fake';
      t.notOk(locoNS.resolveLocation(location));
      t.end();
    });
    t.end();
  });

  t.end();
});
