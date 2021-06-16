import fs from 'node:fs';
import { test } from 'tap';
import LocationConflation from '../index.mjs';

const featuresPath = './test/fixtures/features.json';
const features = JSON.parse(fs.readFileSync(featuresPath));

const loco = new LocationConflation(features);
const locoNS = new LocationConflation(features).strict(false);


test('resolveLocationSet', t => {

  t.test('empty locationSet', t => {
    t.test('(strict mode) empty locationSet throws an error', t => {
      const locationSet = { };
      t.throws(() => loco.resolveLocationSet(locationSet));
      t.end();
    });

    t.test('(non strict mode) empty locationSet defaults to world (Q2)', t => {
      const locationSet = { };
      const result = locoNS.resolveLocationSet(locationSet);
      t.not(result, null);
      t.type(result, 'object');
      t.equal(result.type, 'locationset');
      t.equal(result.locationSet, locationSet);
      t.equal(result.id, '+[Q2]');
      t.type(result.feature, 'object');                      // result includes a `feature`
      t.equal(result.feature.id, 'Q2');                      // feature has an `id`
      t.type(result.feature.properties, 'object');           // feature has `properties`
      t.equal(result.feature.properties.id, 'Q2');           // properties has an `id` property
      t.match(result.feature.properties, { area: /\d+/ });   // properties has a numeric `area` property
      t.end();
    });

    t.end();
  });


  t.test('country coder feature identifiers', t => {
    t.test('sorts included countrycoder locations', t => {
      const locationSet = { include: ['013', '005'] };
      const result = loco.resolveLocationSet(locationSet);
      t.not(result, null);
      t.type(result, 'object');
      t.equal(result.type, 'locationset');
      t.equal(result.locationSet, locationSet);
      t.equal(result.id, '+[Q18,Q27611]');
      t.type(result.feature, 'object');                          // result includes a `feature`
      t.equal(result.feature.id, '+[Q18,Q27611]');               // feature has an `id`
      t.type(result.feature.properties, 'object');               // feature has `properties`
      t.equal(result.feature.properties.id, '+[Q18,Q27611]');    // properties has an `id` property
      t.match(result.feature.properties, { area: /\d+/ });       // properties has a numeric `area` property
      t.end();
    });

    t.test('sorts excluded countrycoder locations', t => {
      const locationSet = { include: ['001'], exclude: ['013', '005'] };
      const result = loco.resolveLocationSet(locationSet);
      t.not(result, null);
      t.type(result, 'object');
      t.equal(result.type, 'locationset');
      t.equal(result.locationSet, locationSet);
      t.equal(result.id, '+[Q2]-[Q18,Q27611]');
      t.type(result.feature, 'object');                               // result includes a `feature`
      t.equal(result.feature.id, '+[Q2]-[Q18,Q27611]');               // feature has an `id`
      t.type(result.feature.properties, 'object');                    // feature has `properties`
      t.equal(result.feature.properties.id, '+[Q2]-[Q18,Q27611]');    // properties has an `id` property
      t.match(result.feature.properties, { area: /\d+/ });            // properties has a numeric `area` property
      t.end();
    });

    t.end();
  });


  t.test('`.geojson` filenames', t => {
    t.test('sorts included .geojson locations', t => {
      const locationSet = { include: ['philly_metro.geojson', 'dc_metro.geojson'] };
      const result = loco.resolveLocationSet(locationSet);
      t.not(result, null);
      t.type(result, 'object');
      t.equal(result.type, 'locationset');
      t.equal(result.locationSet, locationSet);
      t.equal(result.id, '+[dc_metro.geojson,philly_metro.geojson]');
      t.type(result.feature, 'object');                                                     // result includes a `feature`
      t.equal(result.feature.id, '+[dc_metro.geojson,philly_metro.geojson]');               // feature has an `id`
      t.type(result.feature.properties, 'object');                                          // feature has `properties`
      t.equal(result.feature.properties.id, '+[dc_metro.geojson,philly_metro.geojson]');    // properties has an `id` property
      t.match(result.feature.properties, { area: /\d+/ });                                  // properties has a `numeric` area property
      t.end();
    });

    t.test('sorts excluded .geojson locations', t => {
      const locationSet = { include: ['001'], exclude: ['philly_metro.geojson', 'dc_metro.geojson'] };
      const result = loco.resolveLocationSet(locationSet);
      t.not(result, null);
      t.type(result, 'object');
      t.equal(result.type, 'locationset');
      t.equal(result.locationSet, locationSet);
      t.equal(result.id, '+[Q2]-[dc_metro.geojson,philly_metro.geojson]');
      t.type(result.feature, 'object');                                                          // result includes a `feature`
      t.equal(result.feature.id, '+[Q2]-[dc_metro.geojson,philly_metro.geojson]');               // feature has an `id`
      t.type(result.feature.properties, 'object');                                               // feature has `properties`
      t.equal(result.feature.properties.id, '+[Q2]-[dc_metro.geojson,philly_metro.geojson]');    // properties has an `id` property
      t.match(result.feature.properties, { area: /\d+/ });                                       // properties has a numeric `area` property
      t.end();
    });

    t.end();
  });


  t.test('points', t => {
    t.test('sorts included point locations', t => {
      const locationSet = { include: [[1, 0], [0, 1], [1, 1], [0, 0]] };
      const result = loco.resolveLocationSet(locationSet);
      t.not(result, null);
      t.type(result, 'object');
      t.equal(result.type, 'locationset');
      t.equal(result.locationSet, locationSet);
      t.equal(result.id, '+[[0,0],[0,1],[1,0],[1,1]]');
      t.type(result.feature, 'object');                                       // result includes a `feature`
      t.equal(result.feature.id, '+[[0,0],[0,1],[1,0],[1,1]]');               // feature has an `id`
      t.type(result.feature.properties, 'object');                            // feature has `properties`
      t.equal(result.feature.properties.id, '+[[0,0],[0,1],[1,0],[1,1]]');    // properties has an `id` property
      t.match(result.feature.properties, { area: /\d+/ });                    // properties has a numeric `area` property
      t.end();
    });

    t.test('sorts excluded point locations', t => {
      const locationSet = { include: ['001'], exclude: [[1, 0], [0, 1], [1, 1], [0, 0]] };
      const result = loco.resolveLocationSet(locationSet);
      t.not(result, null);
      t.type(result, 'object');
      t.equal(result.type, 'locationset');
      t.equal(result.locationSet, locationSet);
      t.equal(result.id, '+[Q2]-[[0,0],[0,1],[1,0],[1,1]]');
      t.type(result.feature, 'object');                                            // result includes a `feature`
      t.equal(result.feature.id, '+[Q2]-[[0,0],[0,1],[1,0],[1,1]]');               // feature has an `id`
      t.type(result.feature.properties, 'object');                                 // feature has `properties`
      t.equal(result.feature.properties.id, '+[Q2]-[[0,0],[0,1],[1,0],[1,1]]');    // properties has an `id` property
      t.match(result.feature.properties, { area: /\d+/ });                         // properties has a numeric `area` property
      t.end();
    });

    t.end();
  });


  t.test('(strict mode) included junk locations throw an error', t => {
    const locationSet = { include: ['fake', 'null'] };
    t.throws(() => loco.resolveLocationSet(locationSet));
    t.end();
  });

  t.test('(non strict mode) ignores included junk locations', t => {
    const locationSet = { include: ['fake', 'null'] };
    const result = locoNS.resolveLocationSet(locationSet);
    t.not(result, null);
    t.type(result, 'object');
    t.equal(result.type, 'locationset');
    t.equal(result.locationSet, locationSet);
    t.equal(result.id, '+[Q2]');
    t.type(result.feature, 'object');                      // result includes a `feature`
    t.equal(result.feature.id, 'Q2');                      // feature has an `id`
    t.type(result.feature.properties, 'object');           // feature has `properties`
    t.equal(result.feature.properties.id, 'Q2');           // properties has an `id` property
    t.match(result.feature.properties, { area: /\d+/ });   // properties has a numeric `area` property
    t.end();
  });

  t.test('(strict mode) excluded junk locations throw an error', t => {
    const locationSet = { include: ['001'], exclude: ['fake', 'null'] };
    t.throws(() => loco.resolveLocationSet(locationSet));
    t.end();
  });

  t.test('(non strict mode) ignores excluded junk locations', t => {
    const locationSet = { include: ['001'], exclude: ['fake', 'null'] };
    const result = locoNS.resolveLocationSet(locationSet);
    t.not(result, null);
    t.type(result, 'object');
    t.equal(result.type, 'locationset');
    t.equal(result.locationSet, locationSet);
    t.equal(result.id, '+[Q2]');
    t.type(result.feature, 'object');                      // result includes a `feature`
    t.equal(result.feature.id, 'Q2');                      // feature has an `id`
    t.type(result.feature.properties, 'object');           // feature has `properties`
    t.equal(result.feature.properties.id, 'Q2');           // properties has an `id` property
    t.match(result.feature.properties, { area: /\d+/ });   // properties has a numeric `area` property
    t.end();
  });

  t.test('sorts included countrycoder < geojson < point', t => {
    const locationSet = { include: ['philly_metro.geojson', [0,0], 'ca'] };
    const result = loco.resolveLocationSet(locationSet);
    t.not(result, null);
    t.type(result, 'object');
    t.equal(result.type, 'locationset');
    t.equal(result.locationSet, locationSet);
    t.equal(result.id, '+[Q16,philly_metro.geojson,[0,0]]');
    t.type(result.feature, 'object');                                              // result includes a `feature`
    t.equal(result.feature.id, '+[Q16,philly_metro.geojson,[0,0]]');               // feature has an `id`
    t.type(result.feature.properties, 'object');                                   // feature has `properties`
    t.equal(result.feature.properties.id, '+[Q16,philly_metro.geojson,[0,0]]');    // properties has an `id` property
    t.match(result.feature.properties, { area: /\d+/ });                           // properties has a numeric `area` property
    t.end();
  });

  t.test('sorts excluded countrycoder < geojson < point', t => {
    const locationSet = { include: ['001'], exclude: ['philly_metro.geojson', [0,0], 'ca'] };
    const result = loco.resolveLocationSet(locationSet);
    t.not(result, null);
    t.type(result, 'object');
    t.equal(result.type, 'locationset');
    t.equal(result.locationSet, locationSet);
    t.equal(result.id, '+[Q2]-[Q16,philly_metro.geojson,[0,0]]');
    t.type(result.feature, 'object');                                                   // result includes a `feature`
    t.equal(result.feature.id, '+[Q2]-[Q16,philly_metro.geojson,[0,0]]');               // feature has an `id`
    t.type(result.feature.properties, 'object');                                        // feature has `properties`
    t.equal(result.feature.properties.id, '+[Q2]-[Q16,philly_metro.geojson,[0,0]]');    // properties has an `id` property
    t.match(result.feature.properties, { area: /\d+/ });                                // properties has a numeric `area` property
    t.end();
  });

  t.end();
});
