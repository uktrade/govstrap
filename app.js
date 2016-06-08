'use strict';

const express = require('express');
const app = express();
const nunjucks = require('express-nunjucks');
const filters = require('./nunjucks/filters');
const config = require('./config');


let nunjucksConfig = {
  autoescape: true
};

if (config.env !== 'production') {
  nunjucksConfig.noCache = true;
}

app.set('view engine', 'html');
app.set('views', [
  `${__dirname}/gallery/views`,
  `${__dirname}/node_modules/govuk_template_jinja/views`,
  `${__dirname}/nunjucks`
]);

nunjucks.setup(nunjucksConfig, app);

// Add extra filters to nunjucks
nunjucks.ready(function(nj) {
  Object.keys(filters).forEach(function(filterName) {
    nj.addFilter(filterName, filters[filterName]);
  });
});


app.use(express.static(`${__dirname}/gallery/public`));
app.use(express.static(`${__dirname}/build`));
app.use(express.static(`${__dirname}/node_modules/govuk_template_jinja/assets`));



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
    hasManager: true,
    accountManager: 'George Clooney',
    advusir: 'Paul',
    advisors: ['George', 'Paul', 'John', 'Ringo'],
    errors: {
      name: 'You must enter a name'
    }
  });
});

app.listen(config.port);
