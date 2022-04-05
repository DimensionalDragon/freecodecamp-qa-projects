'use strict';

const express = require('express');
const router = express.Router();

const expect = require('chai').expect;
const ConvertHandler = require('../controllers/convertHandler.js');

const convertHandler = new ConvertHandler();
const {getNum, getUnit, getReturnUnit, getString, convert, spellOutUnit} = convertHandler;

router.get('/api/convert', (req, res) => {
  if(!req.query.input) return res.status(400).json({error: 'No input provided'});
  const {input} = req.query;
  const initNum = getNum(input);
  const initUnit = getUnit(input);
  const returnNum = convert(initNum, initUnit);
  const returnUnit = getReturnUnit(initUnit);
  if(!initNum && !initUnit) return res.json({error: 'invalid number and unit'});
  else if(!initUnit) return res.json({error: 'invalid unit'});
  else if(!initNum) return res.json({error: 'invalid number'});
  const resultString = getString(initNum, spellOutUnit(initUnit), returnNum.toFixed(5), spellOutUnit(returnUnit));
  const resultObject = {initNum, initUnit, returnNum: parseFloat(returnNum.toFixed(5)), returnUnit, string: resultString};
  res.json(resultObject);
});

module.exports = router;
