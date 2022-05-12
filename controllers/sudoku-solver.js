const ERRORS = {
    INVALID_CHARACTERS: 'Invalid characters in puzzle',
    UNSOLVABLE: 'Puzzle cannot be solved'
}

class SudokuSolver {
    validate(puzzleString) {
        const validMatch = puzzleString.match(/^[123456789\.]{81}$/);
        if(!validMatch) return {valid: false, type: ERRORS.INVALID_CHARACTERS};
        for(let i = 0; i < 81; i++) {
            const [row, column] = [Math.floor(i / 9), i % 9];
            if(puzzleString[i] !== '.' && !this.checkPlacement(puzzleString, row, column, puzzleString[i])) {
                return {valid: false, type: ERRORS.UNSOLVABLE};
            }
        }
        return {valid: true};
    }
  
    checkRowPlacement(puzzleString, row, column, value) {
        for(let i = 0; i < 9; i++) {
            if(puzzleString[9 * row + i] == value && i !== column) return false;
        }
        return true;
    }
  
    checkColPlacement(puzzleString, row, column, value) {
        for(let i = 0; i < 9; i++) {
            if(puzzleString[9 * i + column] == value && i !== row) return false;
        }
        return true;
    }
  
    checkRegionPlacement(puzzleString, row, column, value) {
        const [gridRow, gridColumn] = [Math.floor(row / 3), Math.floor(column / 3)];
        for(let i = gridRow * 3; i < gridRow * 3 + 3; i++) {
            for(let j = gridColumn * 3; j < gridColumn * 3 + 3; j++) {
                if(puzzleString[9 * i + j] == value && !(i === row && j === column)) return false;
            }
        }
        return true;
    }

    checkPlacement(puzzleString, row, column, value) {
        return (
            this.checkRowPlacement(puzzleString, row, column, value) &&
            this.checkColPlacement(puzzleString, row, column, value) &&
            this.checkRegionPlacement(puzzleString, row, column, value)
        );
    }
  
    solve(puzzleString) {
        if(!this.validate(puzzleString).valid) return false;
        let emptyCell = puzzleString.indexOf('.');
        if(emptyCell === -1) return puzzleString;
        const [emptyRow, emptyColumn] = [Math.floor(emptyCell / 9), emptyCell % 9];
        for(let guess = 1; guess <= 9; guess++) { // Try all values (1 - 9)
            if(this.checkPlacement(puzzleString, emptyRow, emptyColumn, guess)) { // If valid
                puzzleString = puzzleString.substring(0, emptyCell) + guess + puzzleString.substring(emptyCell + 1); // "Try" placing guess to current cell   
                const nextStep = this.solve(puzzleString); // Find next empty cell to "try" by recursion
                if(!nextStep.includes('.')) return nextStep; // Solved, start chain reaction of sending solved solutions to previous calls
                puzzleString = puzzleString.substring(0, emptyCell) + '.' + puzzleString.substring(emptyCell + 1); // Unsolved, delete current cell and continue
            }
        }
        return puzzleString;
    }
}
  
module.exports = SudokuSolver;