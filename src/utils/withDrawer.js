import * as React from 'react';
import {Button, View} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import SignOut from '../components/registration/SignOut';
import IdentityNavigation from '../components/identity/IdentityNavigation';
import {connect} from 'react-redux';
import {updateNavigation} from '../store/actions';

const Drawer = createDrawerNavigator();

export function withDrawer(WrappedComponent) {
  return class extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
      return (
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen name="Home" component={WrappedComponent} />
          <Drawer.Screen
            name="Personal Details"
            component={IdentityNavigation}
          />
          <Drawer.Screen name="Sign Out" component={SignOut} />
        </Drawer.Navigator>
      );
    }
  };
}
