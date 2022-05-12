'use strict';

const express = require('express');
const router = express.Router();

const SudokuSolver = require('../controllers/sudoku-solver.js');
const solver = new SudokuSolver();

router.post('/api/check', (req, res) => {
    // Invalid checks
    if(!req.body.puzzle || !req.body.coordinate || !req.body.value) return res.json({error: 'Required field(s) missing'});
    if(req.body.puzzle.length !== 81) return res.json({error: 'Expected puzzle to be 81 characters long'});
    const validator = solver.validate(req.body.puzzle);
    if(!validator.valid) return res.json({error: validator.type});
    if(!req.body.coordinate.match(/^[A-I][1-9]$/)) return res.json({error: 'Invalid coordinate'});
    if(!('123456789'.includes(req.body.value))) return res.json({error: 'Invalid value'});

    // Request is valid, start processing
    const conflictList = [];
    const [row, column] = [req.body.coordinate.charCodeAt(0) - 'A'.charCodeAt(0), req.body.coordinate[1] - 1];
    const isRowValid = solver.checkRowPlacement(req.body.puzzle, row, column, req.body.value);
    const isColumnValid = solver.checkColPlacement(req.body.puzzle, row, column, req.body.value);
    const isRegionValid = solver.checkRegionPlacement(req.body.puzzle, row, column, req.body.value);
    if(!isRowValid) conflictList.push('row');
    if(!isColumnValid) conflictList.push('column');
    if(!isRegionValid) conflictList.push('region');
    if(conflictList.length > 0) return res.json({valid: false, conflict: conflictList});
    res.json({valid: true});
});

router.post('/api/solve', (req, res) => {
    // Invalid checks
    if(!req.body.puzzle) return res.json({error: 'Required field missing'});
    if(req.body.puzzle.length !== 81) return res.json({error: 'Expected puzzle to be 81 characters long'});
    const validator = solver.validate(req.body.puzzle);
    if(!validator.valid) return res.json({error: validator.type});
    
    // Request is valid, start processing
    res.json({solution: solver.solve(req.body.puzzle)});
});

module.exports = router;