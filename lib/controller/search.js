const { Bundle, BundleEntry } = require('fhir-proof');
const { map } = require('lodash');

module.exports = (req, res) => {

  var type = req.params.type;

  var resources = res.provider.getByType(type);

  if(!resources) {
    res.status(404).send({
      err: true,
      msg: 'Resources not found'
    });
  }

  var entries = map(resources, (r) => {
    return BundleEntry({ resource: r });
  })

  var bundle = Bundle({ type: 'collection', entry: entries });

  res.send(bundle);
};
