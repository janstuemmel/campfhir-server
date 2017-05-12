const { Bundle, BundleEntry, Primitives } = require('fhir-proof');
const traverse = require('traverse');
const { map, keys, pick, get, concat, forEach } = require('lodash');

const { checkResourceType } = require('../util/check');

const { code } = Primitives;


const MAP_SEARCH = {
  _id: (val) => (elem) => get(elem, 'id') === val,
  subject: (val) => (elem) => get(elem, 'subject.reference') === val,
  code: (val) => (elem) => {

    var match = false;

    // searches the type code recursivly
    traverse(elem).forEach((e) => {
      match = match === false && code.is(e) && e === val;
    });

    return match;
  }
}

module.exports = (req, res) => {

  var type = req.params.type,
      query = req.query;

  if (!checkResourceType(type)) {
    return res.status(404).send(createError(
      'NOT_FOUND',
      'Not a FHIR resource'
    ));
  }

  var filterType = [ (elem) => get(elem, 'resourceType') === type ];

  var searchRules = concat(filterType, collectSearchRules(query));

  var resources = res.provider.getBy(searchRules);

  var entries = map(resources, (r) => {
    return BundleEntry({ resource: r });
  })

  var bundle = Bundle({ type: 'searchset', entry: entries });

  res.send(bundle);
};


function collectSearchRules(query) {

  var rules = [];

  forEach(pick(query, keys(MAP_SEARCH)), (val, key) => {
    rules.push(MAP_SEARCH[key](val))
  });

  return rules;
}

module.exports.collectSearchRules = collectSearchRules;
