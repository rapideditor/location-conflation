import fs from 'node:fs';
import { test } from 'tap';
import { LocationConflation } from '../index.mjs';

const featuresPath = './test/fixtures/features.json';
const features = JSON.parse(fs.readFileSync(featuresPath));

const loco = new LocationConflation(features);
const locoNS = new LocationConflation(features).strict(false);


test('validateLocationSet', t => {

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
      t.end();
    });
    t.test('(strict mode) fake included countrycoder locations throw an error', t => {
      const locationSet = { include: ['013', 'fake', '005'] };
      t.throws(() => loco.resolveLocationSet(locationSet));
      t.end();
    });
    t.test('(non strict mode) fake included countrycoder locations are ignored', t => {
      const locationSet = { include: ['013', 'fake', '005'] };
      const result = locoNS.resolveLocationSet(locationSet);
      t.not(result, null);
      t.type(result, 'object');
      t.equal(result.type, 'locationset');
      t.equal(result.locationSet, locationSet);
      t.equal(result.id, '+[Q18,Q27611]');
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
      t.end();
    });
    t.test('(strict mode) fake excluded countrycoder locations throw an error', t => {
      const locationSet = { include: ['001'], exclude: ['013', 'fake', '005'] };
      t.throws(() => loco.resolveLocationSet(locationSet));
      t.end();
    });
    t.test('(non strict mode) fake excluded countrycoder locations are ignored', t => {
      const locationSet = { include: ['001'], exclude: ['013', 'fake', '005'] };
      const result = locoNS.resolveLocationSet(locationSet);
      t.not(result, null);
      t.type(result, 'object');
      t.equal(result.type, 'locationset');
      t.equal(result.locationSet, locationSet);
      t.equal(result.id, '+[Q2]-[Q18,Q27611]');
      t.end();
    });

    t.test('(strict mode) missing include throws an error', t => {
      const locationSet = { exclude: ['013', '005'] };
      t.throws(() => loco.resolveLocationSet(locationSet));
      t.end();
    });
    t.test('(non strict mode) missing include is replaced with world', t => {
      const locationSet = { exclude: ['013', '005'] };
      const result = locoNS.resolveLocationSet(locationSet);
      t.not(result, null);
      t.type(result, 'object');
      t.equal(result.type, 'locationset');
      t.equal(result.locationSet, locationSet);
      t.equal(result.id, '+[Q2]-[Q18,Q27611]');
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
      t.end();
    });
    t.test('(strict mode) fake included .geojson locations throw an error', t => {
      const locationSet = { include: ['philly_metro.geojson', 'fake.geojson', 'dc_metro.geojson'] };
      t.throws(() => loco.resolveLocationSet(locationSet));
      t.end();
    });
    t.test('(non strict mode) fake included .geojson locations are ignored', t => {
      const locationSet = { include: ['philly_metro.geojson', 'fake.geojson', 'dc_metro.geojson'] };
      const result = locoNS.resolveLocationSet(locationSet);
      t.not(result, null);
      t.type(result, 'object');
      t.equal(result.type, 'locationset');
      t.equal(result.locationSet, locationSet);
      t.equal(result.id, '+[dc_metro.geojson,philly_metro.geojson]');
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
      t.end();
    });
    t.test('(strict mode) fake excluded .geojson locations throw an error', t => {
      const locationSet = { include: ['001'], exclude: ['philly_metro.geojson', 'fake.geojson', 'dc_metro.geojson'] };
      t.throws(() => loco.resolveLocationSet(locationSet));
      t.end();
    });
    t.test('(non strict mode) fake excluded .geojson locations are ignored', t => {
      const locationSet = { include: ['001'], exclude: ['philly_metro.geojson', 'fake.geojson', 'dc_metro.geojson'] };
      const result = locoNS.resolveLocationSet(locationSet);
      t.not(result, null);
      t.type(result, 'object');
      t.equal(result.type, 'locationset');
      t.equal(result.locationSet, locationSet);
      t.equal(result.id, '+[Q2]-[dc_metro.geojson,philly_metro.geojson]');
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
      t.end();
    });
    t.test('(strict mode) fake included point locations throw an error', t => {
      const locationSet = { include: [[1, 0], [0, 1], [NaN, NaN], [1, 1], [0, 0]] };
      t.throws(() => loco.resolveLocationSet(locationSet));
      t.end();
    });
    t.test('(non strict mode) fake included point locations are ignored', t => {
      const locationSet = { include: [[1, 0], [0, 1], [NaN, NaN], [1, 1], [0, 0]] };
      const result = locoNS.resolveLocationSet(locationSet);
      t.not(result, null);
      t.type(result, 'object');
      t.equal(result.type, 'locationset');
      t.equal(result.locationSet, locationSet);
      t.equal(result.id, '+[[0,0],[0,1],[1,0],[1,1]]');
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
      t.end();
    });
    t.test('(strict mode) fake excluded point locations throw an error', t => {
      const locationSet = { include: ['001'], exclude: [[1, 0], [0, 1], [NaN, NaN], [1, 1], [0, 0]] };
      t.throws(() => loco.resolveLocationSet(locationSet));
      t.end();
    });
    t.test('(non strict mode) fake excluded point locations are ignored', t => {
      const locationSet = { include: ['001'], exclude: [[1, 0], [0, 1], [NaN, NaN], [1, 1], [0, 0]] };
      const result = locoNS.resolveLocationSet(locationSet);
      t.not(result, null);
      t.type(result, 'object');
      t.equal(result.type, 'locationset');
      t.equal(result.locationSet, locationSet);
      t.equal(result.id, '+[Q2]-[[0,0],[0,1],[1,0],[1,1]]');
      t.end();
    });

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
    t.end();
  });

  t.test('force lowercase', t => {
    const locationSet = { include: ['US'], exclude: ['PR'] };
    const result = loco.resolveLocationSet(locationSet);
    t.not(result, null);
    t.type(result, 'object');
    t.equal(result.type, 'locationset');
    t.equal(result.locationSet, locationSet);
    t.equal(result.id, '+[Q30]-[Q1183]');
    t.end();
  });

  t.end();
});
