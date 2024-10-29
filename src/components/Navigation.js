/*
 *   Copyright (c) 2020 Victor Crudu
 *   All rights reserved.
 */
import React, { Component } from 'react';
import HeaderImage from './HeaderImage';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './registration/Login';
import SignUp from './SignUp';
import Main from './Main';
import ConfirmCode from './ConfirmCode';
import ResendCode from './ResendCode';

import FirstScreen from './registration/FirstScreen';
import TermsAndConditions from './registration/TermsAndConditions';
import EmailInput from './registration/EmailInput';
import PasswordInput from './registration/PasswordInput';
import SecurityQuestion from './registration/SecurityQuestion';
import AnswerSecurityQuestion from './registration/AnswerSecurityQuestion';
import ForgotPasswordInput from './registration/ForgotPasswordInput';
import ConfirmationCodeForForgotPassword from './registration/ConfirmationCodeForForgotPassword';
import EmailCheck from './registration/EmailCheck';
import ConfirmationCode from './registration/ConfirmationCode';
import BiometricsEnrollment from './registration/BiometricsEnrollment';
import SetPinCode from './registration/SetPinCode';
import EnterPinCode from './registration/EnterPinCode';
import PinCodeEnrollment from './registration/PinCodeEnrollment';

import SwitchDevice from './registration/SwitchDevice';

import IdentityNavigation from './identity/IdentityNavigation';
import WizardNoVaccine from './noVaccine/WizardNoVaccine';
import WizardVaccineAppointment from './noVaccine/WizardVaccineAppointment';
import WizardNoNhsLinkage from './noVaccine/WizardNoNhsLinkage';
import WizardAppointmentDetails from './noVaccine/WizardAppointmentDetails';
import WizardSecondVaccine from './noVaccine/WizardSecondVaccine';
import WizardCheckVaccinationRecords from './noVaccine/WizardCheckVaccinationRecords';

import WizardMyDetails from './Profile/WizardMyDetails';
import WizardConsents from './Profile/WizardConsents';
import WizardResetPassword from './Profile/WizardResetPassword';
import WizardDemoScenarios from './Profile/WizardDemoScenarios';
import WizardTermsAndConditions from './Profile/WizardTermsAndConditions';
import WizardAccountCancelation from './Profile/WizardAccountCancelation';
import WizardImmunityPass from './immunityPass/WizardImmunityPass';
import WizardCertificateDetails from './immunityPass/WizardCertificateDetails';
import biometrics from '../utils/biometrics';
import withReduxStore from '../utils/withReduxStore';
import Session from '../utils/Session';
import { styles } from './styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Auth from '@aws-amplify/auth';


const Stack = createStackNavigator();
const navigationRef = React.createRef();

class Navigation extends Component {

  constructor(props) {
    super(props);
    this.state = {};

  }

  componentDidUpdate = () => {
    console.log("DidUpdate")
    console.log(this.props.user)
  }

  componentDidMount() {

  }

  setHeaderRight = () => {
    return (
      <TouchableOpacity
        onPress={() => {

          this.signOutHandler()

        }}
      >
        <MaterialIcons
          style={styles.closeIcon}
          name={"close"}
          size={30}
        />
      </TouchableOpacity>
    );
  };

  signOutHandler = () => {
    if (this.props.user && this.props.user.sessionState === 'signIn') {
      Auth.signOut();
      biometrics.resetBiometrics();
      this.props.updateUser({ sessionState: 'signOut' });
    } else {
      navigationRef.current?.navigate('FirstScreen');
    }
  }

  render() {
    return (
      <NavigationContainer ref={navigationRef}>
        {this.props.user && this.props.user.sessionState === 'signIn' ? (
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}

            headerMode="screen"
            initialRouteName="Main">

            {/*//--------Home Wizards------- */}
            <Stack.Screen
              name="Main"
              component={Main}
              options={{
                title: 'Check me now'
              }}
            />
            <Stack.Screen
              name="SwitchDevice"
              component={SwitchDevice}

              options={{
                headerShown: true,
                headerTitleAlign: 'center',
                headerTitle: () => <HeaderImage />,
                headerLeft: () => <MaterialIcons
                  name={"arrow-back"}
                  size={30}
                  onPress={() => this.signOutHandler()}
                />
              }}
            />
            <Stack.Screen
              name="ConfirmationCode"
              component={ConfirmationCode}
              options={{
                headerShown: true,
                headerLeft: null,
                headerRight: () => this.setHeaderRight(),
                headerTitleAlign: 'center',
                headerTitle: () => <HeaderImage />
              }}
            />
            <Stack.Screen
              name="SecurityQuestion"
              component={SecurityQuestion}
              options={{
                headerShown: true,
                headerLeft: null,
                headerRight: () => this.setHeaderRight(),
                headerTitleAlign: 'center',
                headerTitle: () => <HeaderImage />
              }}
            />
            <Stack.Screen
              name="AnswerSecurityQuestion"
              component={AnswerSecurityQuestion}
              options={{
                headerShown: true,
                headerLeft: null,
                headerRight: () => this.setHeaderRight(),
                headerTitleAlign: 'center',
                headerTitle: () => <HeaderImage />
              }}
            />
            <Stack.Screen
              name="IdentityNavigation"
              component={IdentityNavigation}
              options={{ title: 'Identity' }}
            />
            <Stack.Screen
              name="WizardNoVaccine"
              component={WizardNoVaccine}
              options={{ title: 'No Vaccine' }}
            />
            <Stack.Screen
              name="WizardVaccineAppointment"
              component={WizardVaccineAppointment}
              options={{ title: 'Vaccine Appointment' }}
            />
            <Stack.Screen
              name="WizardNoNhsLinkage"
              component={WizardNoNhsLinkage}
              options={{ title: 'Vaccine Explanation' }}
            />
            <Stack.Screen
              name="WizardAppointmentDetails"
              component={WizardAppointmentDetails}
              options={{ title: 'Appointment Details' }}
            />

            <Stack.Screen
              name="WizardCheckVaccinationRecords"
              component={WizardCheckVaccinationRecords}
              options={{ title: 'Check Vaccination Records' }}
            />
            <Stack.Screen
              name="WizardSecondVaccine"
              component={WizardSecondVaccine}
              options={{ title: 'Second Vaccine Dose' }}
            />

            {/*//--------Profile Wizards------- */}
            <Stack.Screen
              name="WizardMyDetails"
              component={WizardMyDetails}
              options={{ title: 'Profile My Details' }}
            />
            <Stack.Screen
              name="WizardResetPassword"
              component={WizardResetPassword}
              options={{ title: 'Profile Reset Password' }}
            />
            <Stack.Screen
              name="WizardDemoScenarios"
              component={WizardDemoScenarios}
              options={{ title: 'Profile Demo Scenarios' }}
            />
            <Stack.Screen
              name="WizardTermsAndConditions"
              component={WizardTermsAndConditions}
              options={{ title: 'Profile Terms And Conditions' }}
            />
            <Stack.Screen
              name="WizardAccountCancelation"
              component={WizardAccountCancelation}
              options={{ title: 'Profile Account Cancellation' }}
            />
            <Stack.Screen
              name="WizardConsents"
              component={WizardConsents}
              options={{ title: 'Profile Consents' }}
            />

            <Stack.Screen
              name="WizardImmunityPass"
              component={WizardImmunityPass}
              options={{ title: 'Immunity Passport Generation' }}
            />
            <Stack.Screen
              name="WizardCertificateDetails"
              component={WizardCertificateDetails}
              options={{ title: 'Vaccine Certificate Details' }}
            />
            <Stack.Screen
              name="BiometricsEnrollment"
              component={BiometricsEnrollment}
              options={{ title: '' }}
            />
            <Stack.Screen
              name="PinCodeEnrollment"
              component={PinCodeEnrollment}
              options={{ title: '' }}
            />
            <Stack.Screen
              name="SetPinCode"
              component={SetPinCode}
              options={{ title: '' }}
            />

          </Stack.Navigator>
        ) : (
          <Stack.Navigator
            headerMode="screen"
            initialRouteName="FirstScreen"
            screenOptions={{
              headerShown: true,
              headerBackTitleVisible: false,
              headerRight: () => this.setHeaderRight(),
              headerTitleAlign: 'center',
              headerTitle: () => <HeaderImage />
            }}>
            <Stack.Screen
              name="FirstScreen"
              component={FirstScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="TermsAndConditions"
              component={TermsAndConditions}
              options={{ headerRight: null }}
            />
            <Stack.Screen
              name="EmailInput"
              component={EmailInput}
            />
            <Stack.Screen
              name="ConfirmationCode"
              component={ConfirmationCode}
              options={{ headerLeft: null, title: '' }}
            />
            <Stack.Screen
              name="PasswordInput"
              component={PasswordInput}
              options={{ headerLeft: null }}
            />
            <Stack.Screen
              name="SecurityQuestion"
              component={SecurityQuestion}
              options={{ title: '' }}
            />
            <Stack.Screen
              name="AnswerSecurityQuestion"
              component={AnswerSecurityQuestion}
              options={{ title: '' }}
            />
            <Stack.Screen
              name="ForgotPasswordInput"
              component={ForgotPasswordInput}
            />
            <Stack.Screen
              name="ConfirmationCodeForForgotPassword"
              component={ConfirmationCodeForForgotPassword}
            />
            <Stack.Screen
              name="EmailCheck"
              component={EmailCheck}
            />
            <Stack.Screen
              name="EnterPinCode"
              component={EnterPinCode}
            />
            <Stack.Screen
              name="Login"
              component={Login}
            />
            <Stack.Screen
              name="ConfirmCode"
              component={ConfirmCode}
            />
            <Stack.Screen
              name="ResendCode"
              component={ResendCode}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUp}
              options={{ title: 'Sign up' }}
            />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    );
  }
}

export default withReduxStore(Navigation);
