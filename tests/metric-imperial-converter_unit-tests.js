const chai = require('chai');
let assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');

let convertHandler = new ConvertHandler();

suite('Metric-Imperial Converter Unit Tests', function(){
    suite('Input Read', function() {
        // convertHandler should correctly read a whole number input.
        test('Whole Number Input', function(done) {
            const result = convertHandler.getNum('64gal');
            assert.equal(result, 64, result + ' should be equal to 64');
            done();
        });
        // convertHandler should correctly read a decimal number input.
        test('Decimal Number Input', function(done) {
            const result = convertHandler.getNum('0.8L');
            assert.equal(result, 0.8, result + ' should be equal to 0.8');
            done();
        });
        // convertHandler should correctly read a fractional input.
        test('Fractional Number Input', function(done) {
            const result = [convertHandler.getNum('1/2mi'), convertHandler.getNum('1/3lbs')];
            assert.equal(result[0], 0.5, result[0] + ' should be equal to 0.5'); // Terminating
            assert.approximately(result[1], 0.3333, 0.001, result[1] + ' should be approximately 0.3333...'); // Non-Terminating
            done();
        });
        // convertHandler should correctly read a fractional input with a decimal.
        test('Decimal Fractional Number Input', function(done) {
            const result = [convertHandler.getNum('0.1/0.2km'), convertHandler.getNum('1/0.5lbs'), convertHandler.getNum('0.5/2mi')];
            assert.equal(result[0], 0.5, result[0] + ' should be equal to 0.5'); // Decimal / Decimal
            assert.equal(result[1], 2, result[1] + ' should be equal to 2'); // Integer / Decimal
            assert.equal(result[2], 0.25, result[2] + ' should be equal to 0.25'); // Decimal / Integer
            done();
        });
        // convertHandler should correctly return an error on a double-fraction (i.e. 3/2/3).
        test('Double Fraction Number Input', function(done) {
            const result = convertHandler.getNum('3/2/3L');
            assert.isNull(result, result + ' should return null');
            done();
        });
        // convertHandler should correctly default to a numerical input of 1 when no numerical input is provided.
        test('Null Input', function(done) {
            const result = convertHandler.getNum();
            assert.equal(result, 1, 'null input should return 1');
            done();
        });
        // convertHandler should correctly read each valid input unit.
        test('Valid Unit Input', function(done) {
            const units = ['gal', 'L', 'mi', 'km', 'lbs', 'kg'];
            const result = units.map(unit => convertHandler.getUnit('50' + unit));
            result.forEach((unit, i) => assert.equal(unit, units[i], unit + ' should be equal to ' + unit));
            done();
        });
        // convertHandler should correctly return an error for an invalid input unit.
        test('Invalid Unit Input', function(done) {
            const result = convertHandler.getUnit('50cm');
            assert.isNull(result, 'cm should be an invalid unit and should return null');
            done();
        });
        // convertHandler should return the correct return unit for each valid input unit.
        test('Valid Return Unit', function(done) {
            const unitPairs = [['L', 'gal'], ['km', 'mi'], ['kg', 'lbs']];
            unitPairs.forEach(pair => {
                assert.equal(convertHandler.getReturnUnit(pair[0]), pair[1], pair[0] + ' should have ' + pair[1] + ' as return unit');
                assert.equal(convertHandler.getReturnUnit(pair[1]), pair[0], pair[1] + ' should have ' + pair[0] + ' as return unit');
            });
            done();
        });
        // convertHandler should correctly return the spelled-out string unit for each valid input unit.
        test('Valid Spelled Out Unit', function(done) {
            const unitSpelling = [['L', 'liters'], ['gal', 'gallons'], ['km', 'kilometers'], ['mi', 'miles'], ['kg', 'kilograms'], ['lbs', 'pounds']];
            unitSpelling.forEach(unit => assert.equal(convertHandler.spellOutUnit(unit[0]), unit[1], unit[0] + ' should spell out to be ' + unit[1]));
            done();
        });
    })
    suite('Unit Conversion', function() {
        // convertHandler should correctly convert gal to l.
        test('gal to l Conversion', function(done) {
            const result = convertHandler.convert(1, 'gal');
            assert.approximately(result, 3.78541, 0.00001, '1gal should be approximately 3.78541L');
            done();
        });
        // convertHandler should correctly convert l to gal.
        test('l to gal Conversion', function(done) {
            const result = convertHandler.convert(3.78541, 'L');
            assert.approximately(result, 1, 0.00001, '3.78541L should be approximately 1gal');
            done();
        });
        // convertHandler should correctly convert mi to km.
        test('mi to km Conversion', function(done) {
            const result = convertHandler.convert(1, 'mi');
            assert.approximately(result, 1.60934, 0.00001, '1mi should be approximately 1.60934km');
            done();
        });
        // convertHandler should correctly convert km to mi.
        test('km to mi Conversion', function(done) {
            const result = convertHandler.convert(1.60934, 'km');
            assert.approximately(result, 1, 0.00001, '1.60934km should be approximately 1mi');
            done();
        });
        // convertHandler should correctly convert lbs to kg.
        test('lbs to kg Conversion', function(done) {
            const result = convertHandler.convert(1, 'lbs');
            assert.approximately(result, 0.453592, 0.00001, '1lbs should be approximately 0.453592kg');
            done();
        });     
        // convertHandler should correctly convert kg to lbs.
        test('kg to lbs Conversion', function(done) {
            const result = convertHandler.convert(0.453592, 'kg');
            assert.approximately(result, 1, 0.00001, '0.453592kg should be approximately 1lbs');
            done();
        });
    })
});