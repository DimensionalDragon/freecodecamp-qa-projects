const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    // Translation with text and locale fields: POST request to /api/translate
    test('POST to /api/translate with valid text and locale', done => {
        chai.request(server)
        .post('/american-british-translator/api/translate')
        .send({text: 'Mangoes are my favorite fruit.', locale: 'american-to-british'})
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'Response should be an object');
            assert.strictEqual(res.body.text, 'Mangoes are my favorite fruit.', 'Text should be the same as reqested');
            assert.strictEqual(res.body.translation, 'Mangoes are my <span class="highlight">favourite</span> fruit.', 'Translation should be correct');
            done();
        });
    });
    // Translation with text and invalid locale field: POST request to /api/translate
    test('POST to /api/translate with valid text and invalid locale', done => {
        chai.request(server)
        .post('/american-british-translator/api/translate')
        .send({text: 'Mangoes are my favorite fruit.', locale: 'american-to-indonesian'})
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'Response should be an object');
            assert.strictEqual(res.body.error, 'Invalid value for locale field', 'Response should be an error message');
            done();
        });
    });
    // Translation with missing text field: POST request to /api/translate
    test('POST to /api/translate with missing text', done => {
        chai.request(server)
        .post('/american-british-translator/api/translate')
        .send({locale: 'american-to-british'})
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'Response should be an object');
            assert.strictEqual(res.body.error, 'Required field(s) missing', 'Response should be an error message');
            done();
        });
    });
    // Translation with missing locale field: POST request to /api/translate
    test('POST to /api/translate with missing locale', done => {
        chai.request(server)
        .post('/american-british-translator/api/translate')
        .send({text: 'Mangoes are my favorite fruit.'})
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'Response should be an object');
            assert.strictEqual(res.body.error, 'Required field(s) missing', 'Response should be an error message');
            done();
        });
    });
    // Translation with empty text: POST request to /api/translate
    test('POST to /api/translate with empty text', done => {
        chai.request(server)
        .post('/american-british-translator/api/translate')
        .send({text: '', locale: 'american-to-british'})
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'Response should be an object');
            assert.strictEqual(res.body.error, 'No text to translate', 'Response should be an error message');
            done();
        });
    });
    // Translation with text that needs no translation: POST request to /api/translate
    test('POST to /api/translate with no translations needed', done => {
        chai.request(server)
        .post('/american-british-translator/api/translate')
        .send({text: 'SaintPeter and nhcarrigan give their regards!', locale: 'american-to-british'})
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'Response should be an object');
            assert.strictEqual(res.body.text, 'SaintPeter and nhcarrigan give their regards!', 'Text should be the same as reqested');
            assert.strictEqual(res.body.translation, 'Everything looks good to me!', 'Translation shouldn\'t be necessary');
            done();
        });
    });
});
