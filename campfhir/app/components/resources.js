import React from 'react';
import { Component } from 'reflux';

import { Link } from 'react-router-dom';

const Modal = require('react-bootstrap/lib/Modal');
const Button = require('react-bootstrap/lib/Button');
const DropdownButton = require('react-bootstrap/lib/DropdownButton');
const MenuItem = require('react-bootstrap/lib/MenuItem');
const Table = require('react-bootstrap/lib/Table');

import t from 'tcomb-form';
import { Resources as FhirResources } from 'fhir-proof';

import Resource from './resource';
import ResourcesActions from '../actions/resources';
import ResourcesStore from '../stores/resources';

import moment from 'moment';

class Resources extends Component {

  constructor(props) {
    super(props);
    this.store = ResourcesStore;
    this.state = { showAddResourceModal: false, addResourceModalType: null };
  }

  componentDidMount() {
    ResourcesActions.get(this.props.match.params.resourceType);
  }

  componentWillReceiveProps(nextProps) {
    if( nextProps.match.params.resourceType !== this.props.match.params.resourceType ) {
      ResourcesActions.get(nextProps.match.params.resourceType);
    }
  }


  _closeAddResourceModal() {
    this.setState({ showAddResourceModal: false });
  }

  _openAddResourceModal(type, e) {
    this.setState({ showAddResourceModal: true, addResourceModalType: type });
  }

  _onSubmit(value) {
    if(value) {
      ResourcesActions.add(this.props.match.params.resourceType, value);
      this._closeAddResourceModal();
    }
  }

  _getResources() {
    return this.state.resources.map((r, i) => {
      return (
        <tr key={ 'resource_' + i }>
          <td><code>{r.id}</code></td>
          <td>{moment(r.meta.lastUpdated).format('LLL')}</td>
          <td><Link to={[
            '/resources',
            this.props.match.params.resourceType,
            r.id
          ].join('/')}>View File</Link></td>
        </tr>
      );
    });
  }

  render() {
    return (
      <div>
        <div style={{ marginBottom: 10 }}>
          <Button onClick={this._openAddResourceModal.bind(this, this.props.match.params.resourceType)} bsStyle="primary">
            Add {this.props.match.params.resourceType}
          </Button>
        </div>
        <div>
          <Table striped bordered condensed hover>
            <thead>
              <tr>
                <th>id</th>
                <th>lastUpdated</th>
                <th>File</th>
              </tr>
            </thead>
            <tbody>
              { this._getResources() }
            </tbody>
          </Table>
        </div>
        <div>
          <AddResourceModal
            show={this.state.showAddResourceModal}
            onHide={this._closeAddResourceModal.bind(this)}
            onSubmit={this._onSubmit.bind(this)}
            resourceType={this.state.addResourceModalType}
            />
        </div>
      </div>
    );
  }
}

class AddResourceModal extends Component {

  _onSubmit(e) {
    e.preventDefault();
    const value = this.refs.form.getValue();
    this.props.onSubmit(value);
  }

  render() {

    const value = {
      resourceType: this.props.resourceType,
    };

    const options = {
      fields: {
        resourceType: { disabled: true },
        id: { disabled: true }
      }
    };

    return (
      <Modal show={this.props.show} bsSize="large" onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Add resource</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={this._onSubmit.bind(this)}>
            <t.form.Form ref="form" type={FhirResources[this.props.resourceType]} options={options} value={value}/>
            <div className="form-group">
              <button type="submit" className="btn btn-primary">Save</button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    );
  }
}

module.exports = Resources;
