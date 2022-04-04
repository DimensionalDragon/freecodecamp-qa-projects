const chaiHttp = require('chai-http');
const chai = require('chai');
let assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Metric-Imperial Converter Functional Tests', function() {
    suite('HTTP Requests', function() {
        // Convert a valid input such as 10L: GET request to /api/convert.
        test('Test GET /api/convert with valid input', function (done) {
          chai
            .request(server)
            .get('/metric-imperial-converter/api/convert?input=10L')
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.type, 'application/json');
              assert.approximately(res.body.returnNum, 10 / 3.78541, 0.0001);
              assert.equal(res.body.returnUnit, 'gal');
              done();
            });
        });
        // Convert an invalid input such as 32g: GET request to /api/convert.
        test('Test GET /api/convert with invalid input unit', function (done) {
          chai
            .request(server)
            .get('/metric-imperial-converter/api/convert?input=32g')
            .end(function (err, res) {
              assert.equal(res.type, 'application/json');
              assert.isOk(res.body.error);
              done();
            });
        });
        // Convert an invalid number such as 3/7.2/4kg: GET request to /api/convert.
        test('Test GET /api/convert with invalid input number', function (done) {
          chai
            .request(server)
            .get('/metric-imperial-converter/api/convert?input=3/7.2/4kg')
            .end(function (err, res) {
              assert.equal(res.type, 'application/json');
              assert.isOk(res.body.error);
              done();
            });
        });
        // Convert an invalid number AND unit such as 3/7.2/4kilomegagram: GET request to /api/convert.
        test('Test GET /api/convert with invalid input number and unit', function (done) {
          chai
            .request(server)
            .get('/metric-imperial-converter/api/convert?input=3/7.2/4kilomegagram')
            .end(function (err, res) {
              assert.equal(res.type, 'application/json');
              assert.isOk(res.body.error);
              done();
            });
        });
        // Convert with no number such as kg: GET request to /api/convert
        test('Test GET /api/convert with no number provided', function (done) {
            chai
              .request(server)
              .get('/metric-imperial-converter/api/convert?input=kg')
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.approximately(res.body.returnNum, 1 / 0.453592, 0.0001);
                assert.equal(res.body.returnUnit, 'lbs');
                done();
              });
          });
    });
});
