import { Store } from 'reflux';

import ResourcesActions from '../actions/resources';

const map = require('lodash/map');
const concat = require('lodash/concat');

class ResourcesStore extends Store {

  constructor() {
    super();
    this.state = { resources: [], err: null };
    this.listenables = ResourcesActions;
  }

  onAddCompleted(data) {

    var resources = concat(this.state.resources, [ data ]);

    this.setState({ resources: resources, err: null });
  }

  onAddFailed(err) {
    this.setState({ resources: this.state.resources, err: err });
  }

  onGetCompleted(data) {

    var resources = map(data.entry, (e) => {
      return e.resource;
    });

    this.setState({ resources: resources, err: null });
  }

  onGetFailed(err) {

    this.setState({ resources: [], err: err });
  }
}

module.exports = ResourcesStore;
