import React from 'react';
import { MemoryRouter as Router } from 'react-router-dom';

import { mount, render } from 'enzyme';

import App from '../../../app/components/app';


describe('appSpec', () => {

  it('should mount app with router', () => {

    // when
    const wrapper = mount(
      <Router>
        <App />
      </Router>
    );

    // then
    expect(wrapper.exists()).toBe(true);

  });


  it('should route to a resource', () => {

    // when
    const wrapper = mount(
      <Router initialEntries={[ '/resources/Observation/1' ]}>
        <App />
      </Router>
    );

    // then
    expect(wrapper.find('Resource').exists()).toBe(true);
  });


  it('should route to Home', () => {

    // when
    const wrapper = mount(
      <Router initialEntries={[ '/' ]}>
        <App />
      </Router>
    );

    // then
    expect(wrapper.find('Home').exists()).toBe(true);
  });


  it('should route to notFound', () => {

    // when
    const wrapper = mount(
      <Router initialEntries={[ '/idonotexist' ]}>
        <App />
      </Router>
    );

    // then
    expect(wrapper.find('notFound').exists()).toBe(true);
  });


  it('should naviagte from / to /resources', () => {

    // when
    const wrapper = mount(
      <Router initialEntries={[ '/' ]}>
        <App />
      </Router>
    );

    // when
    wrapper.instance().history.push('/resources')

    // then
    expect(wrapper.find('Resources').exists()).toBe(true);
  });

});
