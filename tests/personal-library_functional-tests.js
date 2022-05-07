/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    /*
    * ----[EXAMPLE TEST]----
    * Each test should completely test the response of the API end-point including response status code!
    */

    this.timeout(10000);
    test('#example Test GET /api/books', function(done) {
        chai.request(server)
        .get('/personal-library/api/books')
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
        });
    });
    /*
    * ----[END of EXAMPLE TEST]----
    */

    suite('Routing tests', function() {
        let postID = '';
        suite('POST /api/books with title => create book object/expect book object', function() {    
            test('Test POST /api/books with title', function(done) {
                chai.request(server)
                .post('/personal-library/api/books')
                .set("accept", "application/json")
                .send({title: 'testing'})
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body, 'Response should be an object');
                    assert.isString(res.body.title, 'Response book should have a title and the title should be a string');
                    assert.property(res.body, '_id', 'Response book should have an _id');
                    postID = res.body._id;
                    done();
                });
            });
      
            test('Test POST /api/books with no title given', function(done) {
                chai.request(server)
                .post('/personal-library/api/books')
                .send({dummy: true})
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.strictEqual(res.body, 'missing required field title', 'Response should be an error message');
                    done();
                });
            });
        });

        suite('GET /api/books => array of books', function() {
            test('Test GET /api/books',  function(done) {
                chai.request(server)
                .get('/personal-library/api/books')
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.isArray(res.body, 'Response should be an array');
                    res.body.forEach(book => {
                        assert.isObject(book, 'Each book in the array should be an object');
                        assert.isString(book.title, 'Response book should have a title and the title should be a string');
                        assert.property(book, '_id', 'Response book should have an _id');
                        assert.isNumber(book.commentcount, 'Response book should have a commentcount and the commentcount should be a number');
                    });
                    done();
                });
            });
        });

        suite('GET /api/books/[id] => book object with [id]', function() {
            test('Test GET /api/books/[id] with id not in db',  function(done) {
                chai.request(server)
                .get('/personal-library/api/books/111111111111111111111111')
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.strictEqual(res.body, 'no book exists', 'Response should be an error message');
                    done();
                });
            });
      
            test('Test GET /api/books/[id] with valid id in db',  function(done){
                chai.request(server)
                .get(`/personal-library/api/books/${postID}`)
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body, 'Response should be an object');
                    assert.isString(res.body.title, 'Response book should have a title and the title should be a string');
                    assert.property(res.body, '_id', 'Response book should have an _id');
                    assert.isArray(res.body.comments, 'Response book should have a comments property which is an array');
                    done();
                });
            });      
        });

        suite('POST /api/books/[id] => add comment/expect book object with id', function() {
            test('Test POST /api/books/[id] with comment', function(done) {
                chai.request(server)
                .post(`/personal-library/api/books/${postID}`)
                .send({comment: 'comment test'})
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body, 'Response should be an object');
                    assert.isString(res.body.title, 'Response book should have a title and the title should be a string');
                    assert.property(res.body, '_id', 'Response book should have an _id');
                    assert.isArray(res.body.comments, 'Response book should have a comments property which is an array');
                    done();
                });
            });

            test('Test POST /api/books/[id] without comment field', function(done) {
                chai.request(server)
                .post(`/personal-library/api/books/${postID}`)
                .send({dummy: true})
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.strictEqual(res.body, 'missing required field comment', 'Response should be an error message');
                    done();
                });
            });

            test('Test POST /api/books/[id] with comment, id not in db', function(done){
                chai.request(server)
                .post('/personal-library/api/books/111111111111111111111111')
                .send({comment: 'comment test'})
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.strictEqual(res.body, 'no book exists', 'Response should be an error message');
                    done();
                });
            });
        });

        suite('DELETE /api/books/[id] => delete book object id', function() {
            test('Test DELETE /api/books/[id] with valid id in db', function(done){
                chai.request(server)
                .delete(`/personal-library/api/books/${postID}`)
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.strictEqual(res.body, 'delete successful', 'Response should be a successful delete message');
                    done();
                });
            });

            test('Test DELETE /api/books/[id] with  id not in db', function(done) {
                chai.request(server)
                .delete('/personal-library/api/books/111111111111111111111111')
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.strictEqual(res.body, 'no book exists', 'Response should be an error message');
                    done();
                });
            });
        });
    });
});