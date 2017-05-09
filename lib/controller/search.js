const { Bundle, BundleEntry } = require('fhir-proof');
const { map, concat, forEach, indexOf, keys, filter, pick, mapKeys, assign } = require('lodash');

const { checkResourceType } = require('../util/check');

const MAP_SEARCH_QUERY = {
  '_id': 'id',
  'subject': 'subject.reference',
  'code': 'code.coding.code'
};

module.exports = (req, res) => {

  var type = req.params.type,
      query = req.query;

  if (!checkResourceType(type)) {
    return res.status(404).send(createError(
      'NOT_FOUND',
      'Not a FHIR resource'
    ));
  }

  var searchRules = assign({'resourceType': type},collectSearchRules(query));

  var resources = res.provider.getBy(searchRules);

  var entries = map(resources, (r) => {
    return BundleEntry({ resource: r });
  })

  var bundle = Bundle({ type: 'searchset', entry: entries });

  res.send(bundle);
};


function collectSearchRules(query) {

  return mapKeys(pick(query, keys(MAP_SEARCH_QUERY)), (val, key) => {
    return MAP_SEARCH_QUERY[key];
  });
}

module.exports.collectSearchRules = collectSearchRules;
