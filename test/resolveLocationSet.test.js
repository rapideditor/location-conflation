const test = require('tap').test;
const LocationConflation = require('../.');

const features = require('./fixtures/features.json');
const loco = new LocationConflation(features);


test('resolveLocationSet', t => {
  t.test('empty include defaults to world (Q2)', t => {
    const locationSet = { };
    const result = loco.resolveLocationSet(locationSet);
    t.type(result, 'object');
    t.type(result.properties, 'object');
    t.equal(result.properties.id, 'Q2');
    t.match(result.properties, { area: /\d+/ });  // has a numeric area property
    t.end();
  });

  t.test('sorts included countrycoder locations', t => {
    const locationSet = { include: ['013', '005'] };
    const result = loco.resolveLocationSet(locationSet);
    t.type(result, 'object');
    t.type(result.properties, 'object');
    t.equal(result.properties.id, '+[Q18,Q27611]');
    t.match(result.properties, { area: /\d+/ });  // has a numeric area property
    t.end();
  });

  t.test('sorts excluded countrycoder locations', t => {
    const locationSet = { exclude: ['013', '005'] };
    const result = loco.resolveLocationSet(locationSet);
    t.type(result, 'object');
    t.type(result.properties, 'object');
    t.equal(result.properties.id, '+[Q2]-[Q18,Q27611]');
    t.match(result.properties, { area: /\d+/ });  // has a numeric area property
    t.end();
  });

  t.test('sorts included .geojson locations', t => {
    const locationSet = { include: ['philly_metro.geojson', 'dc_metro.geojson'] };
    const result = loco.resolveLocationSet(locationSet);
    t.type(result, 'object');
    t.type(result.properties, 'object');
    t.equal(result.properties.id, '+[dc_metro.geojson,philly_metro.geojson]');
    t.match(result.properties, { area: /\d+/ });  // has a numeric area property
    t.end();
  });

  t.test('sorts excluded .geojson locations', t => {
    const locationSet = { exclude: ['philly_metro.geojson', 'dc_metro.geojson'] };
    const result = loco.resolveLocationSet(locationSet);
    t.type(result, 'object');
    t.type(result.properties, 'object');
    t.equal(result.properties.id, '+[Q2]-[dc_metro.geojson,philly_metro.geojson]');
    t.match(result.properties, { area: /\d+/ });  // has a numeric area property
    t.end();
  });

  t.test('sorts included point locations', t => {
    const locationSet = { include: [[1, 0], [0, 1], [1, 1], [0, 0]] };
    const result = loco.resolveLocationSet(locationSet);
    t.type(result, 'object');
    t.type(result.properties, 'object');
    t.equal(result.properties.id, '+[[0,0],[0,1],[1,0],[1,1]]');
    t.match(result.properties, { area: /\d+/ });  // has a numeric area property
    t.end();
  });

  t.test('sorts excluded point locations', t => {
    const locationSet = { exclude: [[1, 0], [0, 1], [1, 1], [0, 0]] };
    const result = loco.resolveLocationSet(locationSet);
    t.type(result, 'object');
    t.type(result.properties, 'object');
    t.equal(result.properties.id, '+[Q2]-[[0,0],[0,1],[1,0],[1,1]]');
    t.match(result.properties, { area: /\d+/ });  // has a numeric area property
    t.end();
  });

  t.test('ignores included junk locations', t => {
    const locationSet = { include: ['fake', 'null'] };
    const result = loco.resolveLocationSet(locationSet);
    t.type(result, 'object');
    t.type(result.properties, 'object');
    t.equal(result.properties.id, 'Q2');
    t.match(result.properties, { area: /\d+/ });  // has a numeric area property
    t.end();
  });

  t.test('ignores excluded junk locations', t => {
    const locationSet = { exclude: ['fake', 'null'] };
    const result = loco.resolveLocationSet(locationSet);
    t.type(result, 'object');
    t.type(result.properties, 'object');
    t.equal(result.properties.id, 'Q2');
    t.match(result.properties, { area: /\d+/ });  // has a numeric area property
    t.end();
  });

  t.test('sorts included countrycoder < geojson < point', t => {
    const locationSet = { include: ['philly_metro.geojson', [0,0], 'ca'] };
    const result = loco.resolveLocationSet(locationSet);
    t.type(result, 'object');
    t.type(result.properties, 'object');
    t.equal(result.properties.id, '+[Q16,philly_metro.geojson,[0,0]]');
    t.match(result.properties, { area: /\d+/ });  // has a numeric area property
    t.end();
  });

  t.test('sorts excluded countrycoder < geojson < point', t => {
    const locationSet = { exclude: ['philly_metro.geojson', [0,0], 'ca'] };
    const result = loco.resolveLocationSet(locationSet);
    t.type(result, 'object');
    t.type(result.properties, 'object');
    t.equal(result.properties.id, '+[Q2]-[Q16,philly_metro.geojson,[0,0]]');
    t.match(result.properties, { area: /\d+/ });  // has a numeric area property
    t.end();
  });

  t.test('force lowercase', t => {
    const locationSet = { include: ['US'], exclude: ['PR'] };
    const result = loco.resolveLocationSet(locationSet);
    t.type(result, 'object');
    t.type(result.properties, 'object');
    t.equal(result.properties.id, '+[Q30]-[Q1183]');
    t.match(result.properties, { area: /\d+/ });  // has a numeric area property
    t.end();
  });

  t.end();
});
