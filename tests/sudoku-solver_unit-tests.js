const chai = require('chai');
const assert = chai.assert;

const puzzleStrings = require('../controllers/puzzle-strings.js');

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('Sudoku Solver UnitTests', () => {
    // Logic handles a valid puzzle string of 81 characters
    test('Valid Puzzle String', done => {
        puzzleStrings.forEach(([puzzleString]) => {
            assert.isTrue(solver.validate(puzzleString).valid, puzzleString + ' should be a valid puzzle string');
        });
        done();
    });
    // Logic handles a puzzle string with invalid characters (not 1-9 or .)
    test('Invalid Puzzle String', done => {
        const invalidPuzzle = '.7.89.....5.a..3.4.2..4..1.5689..472...6...,.1.7.5.63873.1.2.8.6.047.1..2.9.387.6'
        assert.isFalse(solver.validate(invalidPuzzle).valid, invalidPuzzle + ' should be an invalid puzzle string');
        done();
    });
    // Logic handles a puzzle string that is not 81 characters in length
    test('Puzzle Strings with Length Less Than 81', done => {
        puzzleStrings.forEach(([puzzleString]) => {
            const shortPuzzle = puzzleString.slice(0, 7);
            assert.isFalse(solver.validate(shortPuzzle).valid, shortPuzzle + ' should be an invalid puzzle string');
        });
        done();
    });
    // Logic handles a valid row placement
    test('Valid Row Check', done => {
        const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        assert.isTrue(solver.checkRowPlacement(puzzleString, 0, 1, 3), '3 should be able to be put in row 0 column 1 of puzzleString');
        assert.isTrue(solver.checkRowPlacement(puzzleString, 0, 4, 6), '6 should be able to be put in row 0 column 4 of puzzleString');
        done();
    });
    // Logic handles an invalid row placement
    test('Invalid Row Check', done => {
        const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        assert.isFalse(solver.checkRowPlacement(puzzleString, 0, 1, 1), '1 shouldn\'t be able to be put in row 0 column 1 of puzzleString');
        assert.isFalse(solver.checkRowPlacement(puzzleString, 0, 4, 5), '5 shouldn\'t be able to be put in row 0 column 4 of puzzleString');
        done();
    });
    // Logic handles a valid column placement
    test('Valid Column Check', done => {
        const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        assert.isTrue(solver.checkColPlacement(puzzleString, 0, 1, 3), '3 should be able to be put in row 0 column 1 of puzzleString');
        assert.isTrue(solver.checkColPlacement(puzzleString, 0, 4, 6), '6 should be able to be put in row 0 column 4 of puzzleString');
        done();
    });
    // Logic handles an invalid column placement
    test('Invalid Column Check', done => {
        const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        assert.isFalse(solver.checkColPlacement(puzzleString, 0, 1, 2), '1 shouldn\'t be able to be put in row 0 column 1 of puzzleString');
        assert.isFalse(solver.checkColPlacement(puzzleString, 0, 4, 5), '5 shouldn\'t be able to be put in row 0 column 4 of puzzleString');
        done();
    });
    // Logic handles a valid region (3x3 grid) placement
    test('Valid Region Check', done => {
        const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        assert.isTrue(solver.checkRegionPlacement(puzzleString, 0, 1, 3), '3 should be able to be put in row 0 column 1 of puzzleString');
        assert.isTrue(solver.checkRegionPlacement(puzzleString, 0, 4, 6), '6 should be able to be put in row 0 column 4 of puzzleString');
        done();
    });
    // Logic handles an invalid region (3x3 grid) placement
    test('Invalid Region Check', done => {
        const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        assert.isFalse(solver.checkRegionPlacement(puzzleString, 0, 1, 2), '1 shouldn\'t be able to be put in row 0 column 1 of puzzleString');
        assert.isFalse(solver.checkRegionPlacement(puzzleString, 0, 4, 5), '5 shouldn\'t be able to be put in row 0 column 4 of puzzleString');
        done();
    });
    // Valid puzzle strings pass the solver
    test('Valid Puzzle Solve', done => {
        puzzleStrings.forEach(([puzzleString]) => {
            assert.isString(solver.solve(puzzleString), `The solution to ${puzzleString} should be a string`);
        });
        done();
    });
    // Invalid puzzle strings fail the solver
    test('Invalid Puzzle Solve', done => {
        const invalidPuzzle = '9.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        assert.isFalse(solver.solve(invalidPuzzle), `${invalidPuzzle} should have no solution`);
        done();
    });
    // Solver returns the expected solution for an incomplete puzzle
    test('Puzzle Correct Solution', done => {
        puzzleStrings.forEach(([puzzleString, solutionString]) => {
            assert.strictEqual(solver.solve(puzzleString), solutionString, `The solution to ${puzzleString} should be ${solutionString}`);
        });
        done();
    })
});
