'use strict';

const express = require('express');
const app = express();
const nunjucks = require('express-nunjucks');
const filters = require('../nunjucks/filters/index');
const config = require('./config');
const path = require('path');
const compression = require('compression');

let nunjucksConfig = {
  autoescape: true
};

if (config.env !== 'production') {
  nunjucksConfig.noCache = true;
}

app.use(compression());
app.set('view engine', 'html');
app.set('views', [
  path.resolve('./gallery/views'),
  path.resolve('./node_modules/govuk_template_jinja/views'),
  path.resolve('./nunjucks')
]);

nunjucks.setup(nunjucksConfig, app);

// Add extra filters to nunjucks
nunjucks.ready(function(nj) {
  Object.keys(filters).forEach(function(filterName) {
    nj.addFilter(filterName, filters[filterName]);
  });
});

app.use('/images', express.static(path.resolve('./images')));
app.use('/images', express.static(path.resolve('./node_modules/govuk_frontend_toolkit/images')));
app.use('/fonts', express.static(path.resolve('./node_modules/govuk_template_mustache/assets/stylesheets')));
app.use(express.static(path.resolve('./public')));
app.use(express.static(path.resolve('./node_modules/govuk_template_jinja/assets')));


app.get('/', function(req, res) {
  res.render('index', {
    subject: 'test subject',
    asset_path: '/',
    name: 'Fred Smith',
    job: 'Developer',
    jobDescription: 'Description',
    countryOfInterest: ['Country 1', 'Country 2'],
    address: {
      address1: 'Address1',
      address2: 'Address2',
      city: 'City',
      postcode: 'SL4 4QR'
    },
    primaryContact: true,
    hasManager: false,
    accountManager: 'George Clooney',
    advisor: 'Paul',
    advisors: ['George', 'Paul', 'John', 'Ringo'],
    sectors: ['Automotive'],
    SECTOR_OPTIONS: ['Automotive', 'Investment'],
    errors: {
      name: 'You must enter a name'
    }
  });
});

app.listen(config.port);
