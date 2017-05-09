const Url = require('url');
const uuid = require('uuid/v1'); // time-based
const { keys, indexOf } = require('lodash');

const { Resources, Resource, Http } = require('fhir-proof');
const { Meta } = Resource;

const { createError } = require('../util/operationOutcome');

module.exports = (req, res) => {

  // check if it is a fhir ressource
  if (!checkResourceType(req.params.type)) {
    return res.status(404).send(createError(
      'NOT_FOUND',
      'Not a FHIR resource'
    ));
  }

  // check if resourceType is same as expected
  if (req.body.resourceType !== req.params.type) {
    return res.status(404).send(createError(
      'NOT_FOUND',
      'Wrong resourceType'
    ));
  }

  var ResourceType, resource;

  try {

    ResourceType = Resources[req.params.type];
    resource = ResourceType(req.body);

    // init Meta
    var meta = Meta({
      versionId: uuid(),
      lastUpdated: new Date().toISOString()
    });

    // set id and meta, ignore existing ones
    resource = ResourceType.update(resource, {
      id: { $set: uuid() },
      meta: { $set: meta }
    });

  } catch(err) {

    return res.status(400).send(createError(
      'BAD_REQUEST',
      'Cannot create resource'
    ));
  }

  // TODO: error handling
  res.provider.add(resource);

  var url = Url.format({
    protocol: req.protocol,
    host: req.get('host'),
    pathname: req.originalUrl
  });

  url = [ url, resource.id, '_history', resource.meta.versionId ].join('/');

  res.set('Location', url);

  return res.send(resource);
};


function checkResourceType(type) {
  return indexOf(keys(Resources), type) !== -1;
}
