import { createActions } from 'reflux';
import fetch from 'node-fetch';

const Actions = createActions({
  'get': { children: [ 'completed', 'failed' ] }
});

Actions.get.listen((id) => {
  Actions.get.completed({});
});

module.exports = Actions;
