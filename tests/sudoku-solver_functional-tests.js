const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Sudoku Solver Functional Tests', () => {
    // Solve a puzzle with valid puzzle string: POST request to /api/solve
    test('POST to /api/solve with valid puzzle', done => {
        chai.request(server)
        .post('/sudoku-solver/api/solve')
        .send({puzzle: '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1'})
        .end(function(err, res) {
            const expected = '218396745753284196496157832531672984649831257827549613962415378185763429374928561';
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'Response should be an object');
            assert.strictEqual(res.body.solution, expected, 'Solution to the puzzle should be ' + expected);
            done();
        });
    });
    // Solve a puzzle with missing puzzle string: POST request to /api/solve
    test('POST to /api/solve with no puzzle property', done => {
        chai.request(server)
        .post('/sudoku-solver/api/solve')
        .send({dummy: true})
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'Response should be an object');
            assert.strictEqual(res.body.error, 'Required field missing', 'Response should be an error message');
            done();
        });
    });
    // Solve a puzzle with invalid characters: POST request to /api/solve
    test('POST to /api/solve with invalid puzzle', done => {
        chai.request(server)
        .post('/sudoku-solver/api/solve')
        .send({puzzle: '.7.89.....5.a..3.4.2..4..1.5689..472...6...,.1.7.5.63873.1.2.8.6.047.1..2.9.387.6'})
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'Response should be an object');
            assert.strictEqual(res.body.error, 'Invalid characters in puzzle', 'Response should be an error message');
            done();
        });
    });
    // Solve a puzzle with incorrect length: POST request to /api/solve
    test('POST to /api/solve with incorrect puzzle length', done => {
        const puzzles = ['..839.7.', '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1.2']
        puzzles.forEach(puzzle => {
            chai.request(server)
            .post('/sudoku-solver/api/solve')
            .send({puzzle})
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body, 'Response should be an object');
                assert.strictEqual(res.body.error, 'Expected puzzle to be 81 characters long', 'Response should be an error message');
            });
        });
        done();
    });
    // Solve a puzzle that cannot be solved: POST request to /api/solve
    test('POST to /api/solve with unsolvable puzzle', done => {
        chai.request(server)
        .post('/sudoku-solver/api/solve')
        .send({puzzle: '9.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'})
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'Response should be an object');
            assert.strictEqual(res.body.error, 'Puzzle cannot be solved', 'Response should be an error message');
            done();
        });
    });
    // Check a puzzle placement with all fields: POST request to /api/check
    test('POST to /api/check with all fields', done => {
        chai.request(server)
        .post('/sudoku-solver/api/check')
        .send({
            puzzle: '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1',
            coordinate: 'A1',
            value: 1
        })
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'Response should be an object');
            assert.isTrue(res.body.valid, 'Value placement should be valid');
            done();
        });
    });
    // Check a puzzle placement with single placement conflict: POST request to /api/check
    test('POST to /api/check with single placement conflict', done => {
        chai.request(server)
        .post('/sudoku-solver/api/check')
        .send({
            puzzle: '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1',
            coordinate: 'A6',
            value: 8
        })
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'Response should be an object');
            assert.isFalse(res.body.valid, 'Value placement should have conflict');
            assert.strictEqual(res.body.conflict.length, 1, 'There should be only 1 conflict');
            assert.strictEqual(res.body.conflict[0], 'row', 'The conflict should be caused by same value in row');
            done();
        });
    });
    // Check a puzzle placement with multiple placement conflicts: POST request to /api/check
    test('POST to /api/check with multiple placement conflicts', done => {
        chai.request(server)
        .post('/sudoku-solver/api/check')
        .send({
            puzzle: '.1839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1',
            coordinate: 'A1',
            value: 1
        })
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'Response should be an object');
            assert.isFalse(res.body.valid, 'Value placement should have conflicts');
            assert.isAbove(res.body.conflict.length, 1, 'There should be more than 1 conflicts');
            done();
        });
    });
    // Check a puzzle placement with all placement conflicts: POST request to /api/check
    test('POST to /api/check with all placement conflicts', done => {
        chai.request(server)
        .post('/sudoku-solver/api/check')
        .send({
            puzzle: '.1839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1',
            coordinate: 'C3',
            value: 1
        })
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'Response should be an object');
            assert.isFalse(res.body.valid, 'Value placement should have conflicts');
            assert.strictEqual(res.body.conflict.length, 3, 'There should exactly 3 conflicts');
            done();
        });
    });
    // Check a puzzle placement with missing required fields: POST request to /api/check
    test('POST to /api/check with missing required fields', done => {
        chai.request(server)
        .post('/sudoku-solver/api/check')
        .send({dummy: true})
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'Response should be an object');
            assert.strictEqual(res.body.error, 'Required field(s) missing', 'Response should be an error message');
            done();
        });
    });
    // Check a puzzle placement with invalid characters: POST request to /api/check
    test('POST to /api/check with invalid characters', done => {
        chai.request(server)
        .post('/sudoku-solver/api/check')
        .send({
            puzzle: '..839.7.575..,..964..1...i...16.29846.9.312.7..754.....62..5.78.8...3.2...492..m1',
            coordinate: 'A1',
            value: 1
        })
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'Response should be an object');
            assert.strictEqual(res.body.error, 'Invalid characters in puzzle', 'Response should be an error message');
            done();
        });
    });
    // Check a puzzle placement with incorrect length: POST request to /api/check
    test('POST to /api/check with incorrect length', done => {
        const puzzles = ['..839.7.', '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1.2']
        puzzles.forEach(puzzle => {
            chai.request(server)
            .post('/sudoku-solver/api/check')
            .send({puzzle, coordinate: 'A1', value: 1})
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body, 'Response should be an object');
                assert.strictEqual(res.body.error, 'Expected puzzle to be 81 characters long', 'Response should be an error message');
            });
        });
        done();
    });
    // Check a puzzle placement with invalid placement coordinate: POST request to /api/check
    test('POST to /api/check with invalid coordinate', done => {
        chai.request(server)
        .post('/sudoku-solver/api/check')
        .send({
            puzzle: '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1',
            coordinate: 'Z0',
            value: 1
        })
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'Response should be an object');
            assert.strictEqual(res.body.error, 'Invalid coordinate', 'Response should be an error message');
            done();
        });
    });
    // Check a puzzle placement with invalid placement value: POST request to /api/check
    test('POST to /api/check with invalid value', done => {
        chai.request(server)
        .post('/sudoku-solver/api/check')
        .send({
            puzzle: '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1',
            coordinate: 'A1',
            value: 10
        })
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'Response should be an object');
            assert.strictEqual(res.body.error, 'Invalid value', 'Response should be an error message');
            done();
        });
    });
});

