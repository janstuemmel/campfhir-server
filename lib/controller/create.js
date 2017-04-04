module.exports = (req, res) => {

  // TODO
  // add real type checking :)
  if (req.params.type !== 'Observation') {

    return res.status(400).send({
      err: true,
      msg: 'Not a FHIR resource',
    });
  }

  var resource = { resourceType: req.params.type };

  try {

    res.provider.add(resource);

  } catch (err) {
    // some err handling
  }

  return res.send({
    err: false,
    msg: 'Resource successfully added',
    data: resource
  });
};
