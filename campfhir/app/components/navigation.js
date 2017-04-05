import React from 'react';
import { Link, Route } from 'react-router-dom';

const Navbar = require('react-bootstrap/lib/Navbar');
const Nav = require('react-bootstrap/lib/Nav');
const Glyphicon = require('react-bootstrap/lib/Glyphicon');
const MenuItem = require('react-bootstrap/lib/MenuItem');

module.exports = (props) => (
  <Navbar fluid={true} staticTop={true}>
    <Navbar.Header>
      <Navbar.Brand>
        <Glyphicon glyph="fire" />
          <span style={{marginLeft: 10}}>CampFhir</span>
        </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav>
        {props.children}
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

module.exports.NavigationLink = ({to, children}) => (
  <Route exact path={to} children={({match}) => (
    <li role="presentation" className={match ? 'active' : ''}>
      <Link to={to}>{children}</Link>
    </li>
  )} />
);
