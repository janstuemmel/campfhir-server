import React, { Component } from 'react';

const Modal = require('react-bootstrap/lib/Modal');
const Button = require('react-bootstrap/lib/Button');
const DropdownButton = require('react-bootstrap/lib/DropdownButton');
const MenuItem = require('react-bootstrap/lib/MenuItem');

import t from 'tcomb-form';

import { Resources as FhirResources } from 'fhir-proof';

import Resource from './resource';

class Resources extends Component {

  constructor(props) {
    super(props);
    this.state = { showAddResourceModal: false, addResourceModalType: null };
  }

  _closeAddResourceModal() {
    this.setState({ showAddResourceModal: false });
  }

  _openAddResourceModal(type) {
    this.setState({ showAddResourceModal: true, addResourceModalType: type });
  }

  _onSubmit(value) {
    if(value) {
      this._closeAddResourceModal();
    }
  }

  render() {
    return (
      <div>
        <div>
          <DropdownButton title="Add resource"  key="1" id="dd">
            <MenuItem onClick={this._openAddResourceModal.bind(this, 'Observation')}>Observation</MenuItem>
            <MenuItem onClick={this._openAddResourceModal.bind(this, 'Patient')}>Patient</MenuItem>
          </DropdownButton>
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
