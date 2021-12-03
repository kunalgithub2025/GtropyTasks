import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { ShowCovidData } from './components/showData';

import './custom.css'

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
            <Route exact path='/' component={ShowCovidData} />
            <Route path="/home" component={Home} />
      </Layout>
    );
  }
}
