const placeholder = (req, res) => res.send('OK');

module.exports = [
  { name: 'conformance', method: 'get', path: '/', module: placeholder },
  { name: 'read', method: 'get', path: '/:type/:id', module: require('./read') },
  { name: 'create', method: 'post', path: '/:type', module: require('./create') },
];
