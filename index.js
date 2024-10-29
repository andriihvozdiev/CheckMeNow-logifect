/*
 *   Copyright (c) 2020 Victor Crudu
 *   All rights reserved.
 */
import 'react-native-gesture-handler'
import JailMonkey from 'jail-monkey'
import { AppRegistry } from 'react-native';
import App from './src/components/App';
import JailBroken from './src/components/JailBroken';
import { name as appName } from './app.json';
import Amplify from 'aws-amplify';
import config from './src/aws-exports';


if (!JailMonkey.isJailBroken()) {
    Amplify.configure(config);
    AppRegistry.registerComponent(appName, () => App);
} else {
    AppRegistry.registerComponent(appName, () => JailBroken);
}


