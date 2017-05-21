import { createActions } from 'reflux';
import fetch from 'node-fetch';

const config = require('../../config.json');

const Actions = createActions({
  'add': { children: [ 'completed', 'failed' ] },
  'get': { children: [ 'completed', 'failed' ] }
});

Actions.add.listen((resourceType, data) => {

  const url = [ config.endpoint, resourceType ].join('/');

  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data, replaceNull),
    url: url
  })
  .then((response) => {
    return response.json();
  })
  .then((data) => {

    // if(data.err) {
    //   return Actions.add.failed(data);
    // }

    Actions.add.completed(data);
  })
  .catch(Actions.add.failed);

});

Actions.get.listen((resourceType) => {

  const url = [ config.endpoint, resourceType ].join('/');

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

function replaceNull(key, value) {
  if (value === null) return undefined;
  return value;
}
