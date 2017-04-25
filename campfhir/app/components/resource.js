import React from 'react';
import { Component } from 'reflux';

import ResourceStore from '../stores/resource';
import ResourceActions from '../actions/resource';

class Resource extends Component {

  constructor(props) {
    super(props);
    this.store = ResourceStore;
  }

  componentDidMount() {
    ResourceActions.get(
      this.props.match.params.resourceType,
      this.props.match.params.id
    );
  }

  render() {
    return (
      <div>
        <div style={{ marginBottom: 10 }}>
          <span>Resource </span>
          <span><code>{this.props.match.params.resourceType}</code></span>
          <span> with id </span>
          <span><code>{this.props.match.params.id}</code></span>
        </div>
        <div><pre>{JSON.stringify(this.state.data, null, '  ')}</pre></div>
      </div>
    );
  }
}

module.exports = Resource;
