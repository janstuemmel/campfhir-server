const { Resources } = require('fhir-proof');
const { keys, indexOf } = require('lodash');

module.exports.checkResourceType = (type) => {
  return indexOf(keys(Resources), type) !== -1;
};
