import { createActions } from 'reflux';
import fetch from 'node-fetch';

const config = require('../../config.json');

const Actions = createActions({
  'get': { children: [ 'completed', 'failed' ] }
});

Actions.get.listen((resourceType, id) => {
  const url = [ config.endpoint, resourceType, id ].join('/');

  fetch(url, {
    method: 'GET',
    url: url
  })
  .then((response) => {
    return response.json();
  })
  .then(Actions.get.completed)
  .catch(Actions.get.failed);
});

module.exports = Actions;
