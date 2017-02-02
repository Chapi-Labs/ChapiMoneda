/**
 * Example for FitImage
 * https://github.com/originerd/react-native-fit-image
 */

import {
  AppRegistry,
} from 'react-native';
import React, { Component } from 'react';

import App from './src/components/app';

class ChapiMoneda extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <App/>;
  }
}

AppRegistry.registerComponent('chapimoneda', () => ChapiMoneda);