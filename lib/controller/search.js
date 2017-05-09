const { Bundle, BundleEntry } = require('fhir-proof');
const { map } = require('lodash');

const { checkResourceType } = require('../util/check');

module.exports = (req, res) => {

  var type = req.params.type;

  if (!checkResourceType(type)) {
    return res.status(404).send(createError(
      'NOT_FOUND',
      'Not a FHIR resource'
    ));
  }

  var resources = res.provider.getByType(type);

  var entries = map(resources, (r) => {
    return BundleEntry({ resource: r });
  })

  var bundle = Bundle({ type: 'searchset', entry: entries });

  res.send(bundle);
};
