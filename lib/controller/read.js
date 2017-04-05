module.exports = (req, res) => {

  var type = req.params.type,
      id = req.params.id;

  var resource = res.provider.getById(id);

  if(!resource) {
    res.status(404).send({
      err: true,
      msg: 'Resource not found'
    });
  }

  res.send(resource);
};
