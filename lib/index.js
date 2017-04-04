var express = require('express');

var assign = require('lodash/assign');
var forEach = require('lodash/forEach');

var DEFAULT_CONFIG = {
  provider: require('./provider/memory')
};

function _init(options) {

  options = options || {};

  var fhir = express();

  var config = assign({}, DEFAULT_CONFIG, options);

  // set provider to fhir object
  fhir.use((req, res, next) => {
    res.provider = config.provider;
    next();
  });

  // add routes
  forEach(require('./controller'), (c) => {
    fhir[c.method](c.path, c.module);
  });

  return fhir;
}

module.exports = _init;
