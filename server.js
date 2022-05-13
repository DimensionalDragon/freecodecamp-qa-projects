'use strict';

const express     = require('express');
const bodyParser  = require('body-parser');
const expect      = require('chai').expect;
const cors        = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const fccTestingRoutes  = require('./routes/fcctesting.js');
const runner            = require('./test-runner');

let app = express();

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database Connection
mongoose.connect(process.env.DB_URI);
const db = mongoose.connection;
db.on('error', err => console.error('[Error]', err));
db.once('open', () => console.log('Connected to database'));

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
app.get('/:dummy/_api/get-tests', (req, res) => {
  res.redirect('../../_api/get-tests');
});
fccTestingRoutes(app);

//Routing for APIs
// Metric-Imperial Converter Routes
app.get('/metric-imperial-converter', (req, res) => {
  res.sendFile(process.cwd() + '/views/metric-imperial-converter.html');
});
const metricImperialConverterRouter = require('./routes/metricImperialConverter.js');
app.use('/metric-imperial-converter', metricImperialConverterRouter);

// Issue Tracker Routes
app.get('/issue-tracker', (req, res) => {
  res.sendFile(process.cwd() + '/views/issue-tracker.html');
});
const issueTrackerRouter = require('./routes/issueTracker.js');
app.use('/issue-tracker', issueTrackerRouter);

// Personal Library Routes
app.get('/personal-library', (req, res) => {
  res.sendFile(process.cwd() + '/views/personal-library.html');
});
const personalLibraryRouter = require('./routes/personalLibrary.js');
app.use('/personal-library', personalLibraryRouter);

// Sudoku Solver Routes
app.get('/sudoku-solver', (req, res) => {
  res.sendFile(process.cwd() + '/views/sudoku-solver.html');
});
const sudokuSolverRouter = require('./routes/sudokuSolver.js');
app.use('/sudoku-solver', sudokuSolverRouter);

// American-British Translator Routes
app.get('/american-british-translator', (req, res) => {
  res.sendFile(process.cwd() + '/views/american-british-translator.html');
});
const translatorRouter = require('./routes/americanBritishTranslator.js');
app.use('/american-british-translator', translatorRouter);

//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

const port = process.env.PORT || 3000;

//Start our server and tests!
app.listen(port, function () {
  console.log("Listening on port " + port);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
          console.log('Tests are not valid:');
          console.error(e);
      }
    }, 1500);
  }
});

module.exports = app; //for testing
