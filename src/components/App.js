/*
 *   Copyright (c) 2020 Victor Crudu
 *   All rights reserved.
 */
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from "../store"
import Navigation from './Navigation';
import AmplifyBridge from '../utils/AmplifyBridge'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.amplifyBridge = new AmplifyBridge(store)
    this.amplifyBridge.subscribeToStore();
  }

  render() {
    return (
      <Provider store={store}>
        <Navigation />
      </Provider>
    );
  }
}
