import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Navigation, { NavigationLink } from './navigation';
import Resources from './resources';
import Resource from './resource';

const notFound = () => <div>404 - Page not found</div>;
const Home = () => <div>Home</div>;

class App extends Component {
  render() {
    return (
      <div style={styles.wrapper}>
        <Navigation>
          <NavigationLink to="/">Home</NavigationLink>
          <NavigationLink to="/resources">Resources</NavigationLink>
        </Navigation>
        <div style={styles.content}>
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/resources" component={Resources} />
            <Route exact path="/resources/:resourceType/:id" component={Resource} />
            <Route component={notFound} />
          </Switch>
        </div>
      </div>
    );
  }
}

module.exports = App;

const styles = {
  wrapper: {},
  content: {
    margin: '0 auto',
    maxWidth: 1280, // wxga / 720p
    paddingLeft: 10,
    paddingRight: 10
  }
};
