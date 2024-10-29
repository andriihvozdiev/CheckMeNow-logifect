import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Profile from './Profile';
import PersonalDetails from '../registration/PersonalDetails';
import MyDetails from './MyDetails';
import ResetPassword from './ResetPassword';
import DemoScenarios from './DemoScenarios';
import TermsAndConditions from './TermsAndConditions';
import AccountCancelation from './AccountCancelation';
import withReduxStore from '../../utils/withReduxStore';
import { vh } from 'react-native-expo-viewport-units';

const Stack = createStackNavigator();

const ProfileNavigation = (props) => {
  return (
    <Stack.Navigator
      headerMode="screen"
      initialRouteName="Profile"
      screenOptions={{
        headerShown: props.navigationData.profileHeaderShown,
        headerBackTitleVisible: false,
      }}>

      <Stack.Screen
        name="Profile"
        component={Profile} />

      <Stack.Screen
        name="My Details"
        component={MyDetails}
        options={{ title: '' }}
      />

      <Stack.Screen
        name="Reset password"
        component={ResetPassword}
        options={{ title: '' }}
      />

      <Stack.Screen
        name="Demo Scenarios" >
        {(props) => <DemoScenarios {...props} />}
      </Stack.Screen>

      {/*<Stack.Screen
        name="App settings"
        component={Profile}
      />*/}

      <Stack.Screen
        name="Account Cancelation"
        component={AccountCancelation}
        options={{ title: '' }}
      />

      <Stack.Screen
        name="Terms and Conditions"
        component={TermsAndConditions}
        options={{ title: '' }}
      />
    </Stack.Navigator>
  );
};

export default withReduxStore(ProfileNavigation);
