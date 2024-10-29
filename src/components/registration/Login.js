/*
 *   Copyright (c) 2020 Victor Crudu
 *   All rights reserved.
 */

import React, { Component } from 'react';
import { View, ActivityIndicator, Keyboard, StyleSheet, TouchableOpacity } from 'react-native';
import { Container, Content, Button, Input, Item, Text } from 'native-base';
import Auth from '@aws-amplify/auth';
import { styles } from './styles';
import { ActionMessage, ErrorMessage } from '../../utils/component_utils';
import { isEmailValid, isPasswordValid } from '../../utils/validation';
import { Alert } from 'react-native';
import biometrics from '../../utils/biometrics';
import withReduxStore from '../../utils/withReduxStore';
import Session from '../../utils/Session';
import { CommonActions } from '@react-navigation/native';
import { getUniqueId, getManufacturer, getDeviceId } from 'react-native-device-info';
import Feather from 'react-native-vector-icons/Feather';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import Colors from '../../constants/colors';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      signinSuccess: true,
      signinErrorMessage: '',
      validation: false,
      forgotPassword: false,
      isLoading: false,
      disabled: true,
      secureTextEntry: true,
    };

    this.setSigninSuccess = this.setSigninSuccess.bind(this);
    this.setSigninErrorMessage = this.setSigninErrorMessage.bind(this);
    this.signIn = this.signIn.bind(this);
  }

  componentDidMount = () => {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.props.navigation.dispatch(state => {
        const routes = state.routes.filter(r => r.name == 'Login');
        return CommonActions.reset({
          ...state,
          routes,
          index: 0,
        });
      });
    });
  }

  componentWillUnmount = () => {
    this.unsubscribe();
  };

  editVisiblity = () => {
    this.setState({
      secureTextEntry: !this.state.secureTextEntry,
    });
  };

  onEmailChange(value) {
    if (isEmailValid(value) && this.state.password) {
      // enable button
      this.setState({ disabled: false })
    } else {
      // disable button
      this.setState({ disabled: true })
    }

    this.setState({
      email: value.trim(),
    });
  }

  onPasswordChange(value) {
    if (isEmailValid(this.state.email) && value) {
      // enable button
      this.setState({ disabled: false })
    } else {
      // disable button
      this.setState({ disabled: true })
    }

    this.setState({
      password: value,
    });
  }

  setSigninSuccess(value) {
    this.setState({
      signinSuccess: value,
    });
  }

  setSigninErrorMessage(error) {
    if (error.code == 'UserNotConfirmedException') {
      Alert.alert(
        'Warning',
        'You need to confirm the registration with a confirmation code that you have received. Resend the confirmation code if you do not have one.',
        [
          {
            text: 'OK',
            onPress: () => this.props.navigation.push('ConfirmCode'),
          },
        ],
        { cancelable: false },
      );
    }
    this.setState({
      signinErrorMessage: error.message,
    });
  }

  signIn = () => {
    Keyboard.dismiss()
    this.setState({
      validation: true,
    });
    if (!isEmailValid(this.state.email) ||
      !isPasswordValid(this.state.password)) return;
    this.setState({ isLoading: true })
    Session.signIn(this.state.email.trim(),
      this.state.password.trim(),
      this.props.initUserFromDb,
      this.props.updateUser)
      .then(async () => {
        await biometrics.setBiometricsTemp(this.state.email.trim(), this.state.password.trim());
        const user = await Auth.currentAuthenticatedUser();
        if (user.attributes["email"] === "admin@logifect.com") {
          this.props.navigation.navigate('PinCodeEnrollment');
          this.setState({ isLoading: false })
          return;
        }
        if (getUniqueId() !== user.attributes["custom:device_id"] &&
          user.attributes["custom:device_id"] !== undefined) {
          this.props.navigation.navigate('SwitchDevice')
        } else {
          if (user.attributes["custom:security_answer"] === undefined) {
            this.props.navigation.navigate('SecurityQuestion');
          } else {
            this.props.navigation.navigate('PinCodeEnrollment');
          }
          /*this.props.navigation.navigate('ConfirmationCode', {
            email: this.state.email,
            previous_screen: 'LoginScreen'
          });*/
        }
        this.setState({ isLoading: false })
      })
      .catch((err) => {
        this.setState({ isLoading: false })
        this.setSigninErrorMessage(err)
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={localStyles.upperContainer}>
          <Text style={styles.h3}>Sign in to your account</Text>
          <View style={{ marginTop: 30 }}>
            <Text style={styles.defaultText}>Email *</Text>
            <Item regular style={{ marginTop: 10 }}>
              <Input
                autoCapitalize="none"
                placeholder="Enter your username"
                value={this.state.email}
                onChangeText={this.onEmailChange.bind(this)}
                keyboardType="email-address"
              />
            </Item>
          </View>
          <ErrorMessage
            show={this.state.validation && !isEmailValid(this.state.email)}>
            Email is not valid
          </ErrorMessage>
          <View style={{ marginTop: 30 }}>
            <Text style={styles.defaultText}>Password *</Text>
            <Item regular style={{ marginTop: 10, paddingRight: 10 }}>
              <Input
                placeholder="Enter your password"
                secureTextEntry={this.state.secureTextEntry}
                value={this.state.password}
                onChangeText={this.onPasswordChange.bind(this)}
              />
              <TouchableOpacity onPress={this.editVisiblity}>
                <Feather
                  right
                  size={35}
                  name={this.state.secureTextEntry ? 'eye-off' : 'eye'}
                />
              </TouchableOpacity>
            </Item>
          </View>
          <ErrorMessage
            show={
              this.state.validation && !isPasswordValid(this.state.password)
            }>
            Password is not valid
          </ErrorMessage>

          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: '5%' }}>
            <ActivityIndicator
              animating={this.state.isLoading}
              size="large"
              color="#00ff00"
            />
          </View>
          <ActionMessage
            show={this.state.signinErrorMessage}
            text={this.state.signinErrorMessage}
          />
        </View>
        <View style={localStyles.bottomContainer}>
          <View style={{ marginTop: '10%', width: '100%' }}>
            <Button
              primary
              disabled={this.state.disabled}
              onPress={this.signIn}
              style={!this.state.disabled ? localStyles.button : localStyles.buttonDisabled}
            >
              <Text uppercase={false} style={this.state.disabled ?
                { ...styles.buttonTextSize, color: Colors.link } :
                { ...styles.buttonTextSize, color: 'white' }}>Sign in</Text>
            </Button>
          </View>
          <View style={{ ...styles.additionalOptions, width: '100%' }}>
            <Text
              style={{ ...styles.link, ...styles.buttonTextSize }}
              onPress={() => this.props.navigation.navigate('EmailInput', { forgotPassword: true })}>
              Forgot Password
            </Text>
            <Text
              style={{ ...styles.link, ...styles.buttonTextSize }}
              onPress={() => this.props.navigation.navigate('TermsAndConditions')}>
              Sign Up
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const localStyles = StyleSheet.create({
  upperContainer: {
    flex: 4.5,
    backgroundColor: 'white',
    paddingTop: vh(3),
    paddingHorizontal: vw(5),
  },
  bottomContainer: {
    flex: 1.5,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: vw(4)
  },
  button: {
    width: '95%',
    marginTop: 10,
    height: vh(7),
    shadowOpacity: 0.2,
    shadowOffset: { width: 3, height: 3 },
    backgroundColor: '#136AC7',
    borderRadius: 5,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonDisabled: {
    width: '95%',
    marginTop: 10,
    height: vh(7),
    shadowOpacity: 0.2,
    shadowOffset: { width: 3, height: 3 },
    backgroundColor: '#FFF',
    borderRadius: 5,
    justifyContent: 'center',
    alignSelf: 'center'
  },
});

export default withReduxStore(Login);
