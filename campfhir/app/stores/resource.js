import { Store } from 'reflux';

import ResourceActions from '../actions/resource';

class ResourceStore extends Store {

  constructor() {
    super();
    this.state = { data: {}, err: null };
    this.listenables = ResourceActions;
  }

  onGetCompleted(data) {
    this.setState({ data: data, err: null });
  }

  onGetFailed(err) {
    this.setState({ data: {}, err: err });
  }
}

module.exports = ResourceStore;
