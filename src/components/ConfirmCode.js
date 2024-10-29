/*
 *   Copyright (c) 2020 Victor Crudu
 *   All rights reserved.
 */

import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Button, Input, Item, Text } from 'native-base';
import Auth from '@aws-amplify/auth';
import { styles } from '../components/registration/styles';
import { ActionMessage, ErrorMessage } from '../utils/component_utils';
import { isEmailValid, isCodeValid } from '../utils/validation';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import { updateUser } from '../store/actions';
import Session from '../utils/Session';
import biometrics from '../utils/biometrics';
import withReduxStore from '../utils/withReduxStore';

class ConfirmCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      code: '',
      signinSuccess: true,
      actionMessage: '',
      isLoading: false,
    };

    this.setSigninSuccess = this.setSigninSuccess.bind(this);
    this.setSigninErrorMessage = this.setSigninErrorMessage.bind(this);
    this.confirmSignUp = this.confirmSignUp.bind(this);
  }

  onEmailChange(value) {
    this.setState({
      email: value.trim(),
    });
  }

  onCodeChange(value) {
    this.setState({
      code: value.replace(/[^0-9]/g, ''),
    });
  }

  setSigninSuccess(value) {
    this.setState({
      signinSuccess: value,
    });
  }

  setSigninErrorMessage(error) {
    this.setState({
      actionMessage: error.message,
    });
  }

  async confirmSignUp() {
    this.setState({
      validation: true,
    });

    if (!isEmailValid(this.state.email) || !isCodeValid(this.state.code))
      return;

    try {

      await Auth.confirmSignUp(this.state.email, this.state.code);

      Alert.alert(
        'Information',
        'The account was activated successfuly.',
        [{
          text: 'OK', onPress: () => {
            biometrics.checkBiometricsTemp().then((credentials) => {

              if (credentials) {
                this.setState({ isLoading: true });
                Session.signIn(credentials.username,
                  credentials.password,
                  this.props.initUserFromDb,
                  this.props.updateUser).catch((err) => {
                    this.props.navigation.push('Login');
                  });
              }
            })
          }
        }],
        { cancelable: false },
      );
    } catch (error) {
      this.setSigninErrorMessage(error);
      this.setState({ isLoading: false });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.firstScreenContainer}>
          <Text style={styles.h3}>Confirm Sign Up</Text>
          <View style={{ marginTop: 30 }}>
            <Text>Email *</Text>
            <Item regular style={{ marginTop: 10 }}>
              <Input
                autoCapitalize="none"
                placeholder="Enter your email"
                value={this.state.email}
                onChangeText={this.onEmailChange.bind(this)}
              />
            </Item>
          </View>
          <ErrorMessage
            show={this.state.validation && !isEmailValid(this.state.email)}>
            Email is not valid
          </ErrorMessage>
          <View style={{ marginTop: 30 }}>
            <Text>Confirmation Code *</Text>
            <Item regular style={{ marginTop: 10 }}>
              <Input
                placeholder="Enter your confirmation code"
                value={this.state.code}
                onChangeText={this.onCodeChange.bind(this)}
              />
            </Item>
          </View>
          <ErrorMessage
            show={this.state.validation && !isCodeValid(this.state.code)}>
            Code is not valid
          </ErrorMessage>

          <View style={{ marginTop: 10 }}>
            <Button
              disabled={!this.state.code || !this.state.email || this.state.isLoading}
              onPress={this.confirmSignUp}
              style={{ marginTop: 10, height: 50 }}
              block>
              <Text> CONFIRM </Text>
            </Button>
          </View>
          <View style={styles.additionalOptions}>
            <Text
              style={styles.link}
              onPress={() => this.props.navigation.push('ResendCode')}>
              Resend Code
            </Text>
            <Text
              style={styles.link}
              onPress={() => this.props.navigation.push('Login')}>
              Back to Sign In
            </Text>
          </View>
          <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '5%',
            marginTop: '5%',
          }}>
            <ActivityIndicator
              animating={this.state.isLoading}
              size="large"
              color="#00ff00"
            />
          </View>
          <ActionMessage
            show={this.state.actionMessage}
            text={this.state.actionMessage}
          />
        </View>
      </View>
    );
  }
}

export default withReduxStore(ConfirmCode);
