const uuid = require('uuid/v1'); // time-based
const { keys, indexOf } = require('lodash');
const { Resources } = require('fhir-proof');

module.exports = (req, res) => {

  // check if it is a fhir ressource
  if (!checkResourceType(req.params.type)) {
    return res.status(400).send({ err: true, msg: 'Not a FHIR resource' });
  }

  // check if resourceType is same as expected
  if (req.body.resourceType !== req.params.type) {
    return res.status(400).send({ err: true, msg: 'Wrong resourceType' });
  }

  var resource;

  try {
    resource = NewResource(req.params.type, req.body);
  } catch(err) {
    return res.status(400).send({ err: true, msg: err.message });
  }

  // TODO: error handling
  res.provider.add(resource);

  return res.send({
    err: false,
    msg: 'Resource successfully created',
    data: resource
  });
};


function NewResource(type, data) {
  return Resources[type].extend({}, {
    defaultProps: { id: uuid() }
  })(data);
}

function checkResourceType(type) {
  return indexOf(keys(Resources), type) !== -1;
}
