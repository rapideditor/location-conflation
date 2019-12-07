const test = require('tap').test;
const LocationConflation = require('../.');

const features = require('./fixtures/features.json');
const loco = new LocationConflation(features);


test('getIdentifier', t => {

  t.test('empty include defaults to "world" ("001")', t => {
    let locations = { };
    t.equal(loco.getIdentifier(locations), '+["001"]');
    t.end();
  });

  t.test('sorts included countrycoder locations', t => {
    let locations = { include: ['013', '005'] };
    t.equal(loco.getIdentifier(locations), '+["005","013"]');
    t.end();
  });

  t.test('sorts excluded countrycoder locations', t => {
    let locations = { exclude: ['013', '005'] };
    t.equal(loco.getIdentifier(locations), '+["001"]-["005","013"]');
    t.end();
  });

  t.test('sorts included .geojson locations', t => {
    let locations = { include: ['philly_metro.geojson', 'dc_metro.geojson'] };
    t.equal(loco.getIdentifier(locations), '+["dc_metro.geojson","philly_metro.geojson"]');
    t.end();
  });

  t.test('sorts excluded .geojson locations', t => {
    let locations = { exclude: ['philly_metro.geojson', 'dc_metro.geojson'] };
    t.equal(loco.getIdentifier(locations), '+["001"]-["dc_metro.geojson","philly_metro.geojson"]');
    t.end();
  });

  t.test('sorts included point locations', t => {
    let locations = { include: [[1, 0], [0, 1], [1, 1], [0, 0]] };
    t.equal(loco.getIdentifier(locations), '+[[0,0],[0,1],[1,0],[1,1]]');
    t.end();
  });

  t.test('sorts excluded point locations', t => {
    let locations = { exclude: [[1, 0], [0, 1], [1, 1], [0, 0]] };
    t.equal(loco.getIdentifier(locations), '+["001"]-[[0,0],[0,1],[1,0],[1,1]]');
    t.end();
  });

  t.test('ignores included junk locations', t => {
    let locations = { include: ['fake', 'null'] };
    t.equal(loco.getIdentifier(locations), '+["001"]');
    t.end();
  });

  t.test('ignores excluded junk locations', t => {
    let locations = { exclude: ['fake', 'null'] };
    t.equal(loco.getIdentifier(locations), '+["001"]');
    t.end();
  });

  t.test('sorts included countrycoder < geojson < point', t => {
    let locations = { include: ['philly_metro.geojson', [0,0], 'ca'] };
    t.equal(loco.getIdentifier(locations), '+["ca","philly_metro.geojson",[0,0]]');
    t.end();
  });

  t.test('sorts excluded countrycoder < geojson < point', t => {
    let locations = { exclude: ['philly_metro.geojson', [0,0], 'ca'] };
    t.equal(loco.getIdentifier(locations), '+["001"]-["ca","philly_metro.geojson",[0,0]]');
    t.end();
  });

  t.test('force lowercase', t => {
    let locations = { include: ['US'], exclude: ['PR'] };
    t.equal(loco.getIdentifier(locations), '+["us"]-["pr"]');
    t.end();
  });

  t.end();
});
