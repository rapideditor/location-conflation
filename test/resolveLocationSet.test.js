const test = require('tap').test;
const LocationConflation = require('../.');

const features = require('./fixtures/features.json');
const loco = new LocationConflation(features);


test('resolveLocationSet', t => {

  t.test('empty include defaults to "world" ("001")', t => {
    let locationSet = { };
    let result = loco.resolveLocationSet(locationSet);
    t.equal(result.properties.id, '001');
    t.end();
  });

  t.test('sorts included countrycoder locations', t => {
    let locationSet = { include: ['013', '005'] };
    let result = loco.resolveLocationSet(locationSet);
    t.equal(result.properties.id, '+["005","013"]');
    t.end();
  });

  t.test('sorts excluded countrycoder locations', t => {
    let locationSet = { exclude: ['013', '005'] };
    let result = loco.resolveLocationSet(locationSet);
    t.equal(result.properties.id, '+["001"]-["005","013"]');
    t.end();
  });

  t.test('sorts included .geojson locations', t => {
    let locationSet = { include: ['philly_metro.geojson', 'dc_metro.geojson'] };
    let result = loco.resolveLocationSet(locationSet);
    t.equal(result.properties.id, '+["dc_metro.geojson","philly_metro.geojson"]');
    t.end();
  });

  t.test('sorts excluded .geojson locations', t => {
    let locationSet = { exclude: ['philly_metro.geojson', 'dc_metro.geojson'] };
    let result = loco.resolveLocationSet(locationSet);
    t.equal(result.properties.id, '+["001"]-["dc_metro.geojson","philly_metro.geojson"]');
    t.end();
  });

  t.test('sorts included point locations', t => {
    let locationSet = { include: [[1, 0], [0, 1], [1, 1], [0, 0]] };
    let result = loco.resolveLocationSet(locationSet);
    t.equal(result.properties.id, '+[[0,0],[0,1],[1,0],[1,1]]');
    t.end();
  });

  t.test('sorts excluded point locations', t => {
    let locationSet = { exclude: [[1, 0], [0, 1], [1, 1], [0, 0]] };
    let result = loco.resolveLocationSet(locationSet);
    t.equal(result.properties.id, '+["001"]-[[0,0],[0,1],[1,0],[1,1]]');
    t.end();
  });

  t.test('ignores included junk locations', t => {
    let locationSet = { include: ['fake', 'null'] };
    let result = loco.resolveLocationSet(locationSet);
    t.equal(result.properties.id, '001');
    t.end();
  });

  t.test('ignores excluded junk locations', t => {
    let locationSet = { exclude: ['fake', 'null'] };
    let result = loco.resolveLocationSet(locationSet);
    t.equal(result.properties.id, '001');
    t.end();
  });

  t.test('sorts included countrycoder < geojson < point', t => {
    let locationSet = { include: ['philly_metro.geojson', [0,0], 'ca'] };
    let result = loco.resolveLocationSet(locationSet);
    t.equal(result.properties.id, '+["ca","philly_metro.geojson",[0,0]]');
    t.end();
  });

  t.test('sorts excluded countrycoder < geojson < point', t => {
    let locationSet = { exclude: ['philly_metro.geojson', [0,0], 'ca'] };
    let result = loco.resolveLocationSet(locationSet);
    t.equal(result.properties.id, '+["001"]-["ca","philly_metro.geojson",[0,0]]');
    t.end();
  });

  t.test('force lowercase', t => {
    let locationSet = { include: ['US'], exclude: ['PR'] };
    let result = loco.resolveLocationSet(locationSet);
    t.equal(result.properties.id, '+["us"]-["pr"]');
    t.end();
  });

  t.end();
});
