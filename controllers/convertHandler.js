class ConvertHandler {

  getNum(input) {
    if(!input || !input.match(/\d/)) return 1;
    if(input.includes('/')) {
      const splittedFraction = input.split('/');
      if(splittedFraction.length !== 2) return null;
      return parseFloat(splittedFraction[0]) / parseFloat(splittedFraction[1]);
    }
    return parseFloat(input);
  };
  
  getUnit(input) {
    const validUnits = ['gal', 'L', 'mi', 'km', 'lbs', 'kg'];
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const result = input.toLowerCase().split('').reduce((result, character) => letters.includes(character) ? result + character : result, '');
    if(result === 'l') return 'L';
    return validUnits.includes(result) ? result : null;
  };
  
  getReturnUnit(initUnit) {
    if(initUnit === 'gal') return 'L';
    if(initUnit === 'L') return 'gal';
    if(initUnit === 'mi') return 'km';
    if(initUnit === 'km') return 'mi';
    if(initUnit === 'lbs') return 'kg';
    if(initUnit === 'kg') return 'lbs';
    return null;
  };

  spellOutUnit(unit) {
    if(unit === 'gal') return 'gallons';
    if(unit === 'L') return 'liters';
    if(unit === 'mi') return 'miles';
    if(unit === 'km') return 'kilometers';
    if(unit === 'lbs') return 'pounds';
    if(unit === 'kg') return 'kilograms';
    return null;
  };
  
  convert(initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    if(initUnit === 'gal') return (initNum * galToL);
    if(initUnit === 'L') return (initNum / galToL);
    if(initUnit === 'mi') return (initNum * miToKm);
    if(initUnit === 'km') return (initNum / miToKm);
    if(initUnit === 'lbs') return (initNum * lbsToKg);
    if(initUnit === 'kg') return (initNum / lbsToKg);
    return null;
  };
  
  getString(initNum, initUnit, returnNum, returnUnit) {
    return `${initNum} ${initUnit} converts to ${returnNum} ${returnUnit}`;
  };
  
}

module.exports = ConvertHandler;
