import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PersonalDetails from '../registration/PersonalDetails';
import IdentityVerify from '../registration/IdentityVerify';
import TypeOfDocument from '../registration/TypeOfDocument';
import ScanDocument from '../registration/ScanDocument';
import VideoSelfie from '../registration/VideoSelfie';
import IdentityProcessing from '../registration/IdentityProcessing';
import DocumentIsReadable from '../registration/DocumentIsReadable';
import withReduxStore from '../../utils/withReduxStore';
import HeaderImage from '../HeaderImage';

const Stack = createStackNavigator();

class IdentityNavigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Stack.Navigator
        headerMode="screen"
        screenOptions={{ headerShown: true, headerBackTitleVisible: false }}
        initialRouteName="IdentityVerify">
        <Stack.Screen
          name="IdentityVerify"
          component={IdentityVerify}
          options={{
            title: () => <HeaderImage />,
          }}
        />
        <Stack.Screen
          name="PersonalDetails"
          component={PersonalDetails}
          options={{ title: () => <HeaderImage /> }}
        />
        <Stack.Screen
          name="TypeOfDocument"
          component={TypeOfDocument}
          options={{ title: () => <HeaderImage /> }}
        />
        <Stack.Screen
          name="ScanDocument"
          component={ScanDocument}
          options={{ title: 'Scan Document' }}
        />
        <Stack.Screen
          name="DocumentIsReadable"
          component={DocumentIsReadable}
          options={{ title: () => <HeaderImage /> }}
        />
        <Stack.Screen
          name="VideoSelfie"
          component={VideoSelfie}
          options={{ title: 'Take a video selfie' }}
        />
        <Stack.Screen
          name="IdentityProcessing"
          component={IdentityProcessing}
          options={{ title: () => <HeaderImage /> }}
        />
      </Stack.Navigator>
    );
  }
}

export default withReduxStore(IdentityNavigation);
