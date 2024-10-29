/*
 *   Copyright (c) 2020 Grigore Crudu
 *   All rights reserved.
 */

import React, { Component } from 'react';
import { StyleSheet, Alert, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { View, Text, Button, Input, Item } from 'native-base';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import { isEmailValid } from '../../utils/validation';
import { connect } from 'react-redux';
import { updateUser } from '../../store/actions';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { styles } from './styles';
import { Auth } from 'aws-amplify';

import Colors from '../../constants/colors';
import withReduxStore from '../../utils/withReduxStore';
import biometrics from '../../utils/biometrics';

class EmailInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      disabled: true,
    };
  }

  inputEmailHandler = (value) => {
    if (isEmailValid(value)) {
      // enable button
      this.setState({ disabled: false })
    } else {
      // disable button
      this.setState({ disabled: true })
    }

    this.setState({
      email: value.trim(),
    });
  };

  checkEmailHandler = async () => {
    if (!isEmailValid(this.state.email)) {
      Alert.alert('Warning', 'Please, enter a valid email', [{ text: 'OK' }]);
      return;
    }

    if (this.props.route.params && this.props.route.params.forgotPassword) {
      try {
        await this.forgotPasswordForRegister(false)
        return;
      } catch (error) {
        this.showWarning(error);
        return;
      }
    }
    this.props.updateUser({ email: this.state.email });
    try {
      const result = await this.signUp();
      this.props.navigation.navigate('ConfirmationCode', {
        email: this.state.email,
        previous_screen: 'EmailInput'
      });
    } catch (error) {
      if (error.code === 'UsernameExistsException') {
        try {
          await this.signIn()
          const currentUser = await Auth.currentAuthenticatedUser();
          if (currentUser.attributes['custom:security_answer'] == undefined || currentUser.attributes['custom:device_id'] == undefined) {
            await this.forgotPasswordForRegister(true);
          } else {
            this.showWarning(error);
          }
        } catch (signInError) {
          if (signInError.code === 'UserNotConfirmedException') {
            try {
              await this.resendSignUp()
            } catch (err) {
              this.showWarning(err)
            }
          } else {
            this.showWarning(error)
          }
        }

      } else {
        this.showWarning(error)
      }
    }
  };

  async forgotPasswordForRegister(isSignUp) {
    await Auth.forgotPassword(this.state.email);
    this.props.navigation.navigate('ConfirmationCodeForForgotPassword', {
      email: this.state.email,
      isSignUp: isSignUp
    });
  }

  showWarning(error) {

    Alert.alert('Warning', error.message, [
      {
        text: 'OK',
        onPress: () => {
          if (error.code === 'UsernameExistsException') {
            this.props.navigation.navigate('Login');
          }
        },
      },
    ]);
  };

  async signUp() {
    try {
      const temporaryPassword = Math.random().toString(36).slice(-4).toLowerCase() + Math.random().toString(36).slice(-4).toUpperCase() + "!" + Math.random().toString().slice(-4)
      const user = await Auth.signUp({
        username: this.state.email,
        password: temporaryPassword,
        attributes: {
          email: this.state.email,
        },
      });
      await biometrics.setBiometricsTemp(this.state.email, temporaryPassword);

    } catch (error) {
      console.log('error signing up:', error);
      throw error;
    }
  }

  async signIn() {
    try {
      const credentials = await biometrics.checkBiometricsTemp();
      const user = await Auth.signIn(credentials.username, credentials.password);
    } catch (error) {
      console.log('error signing in:', error);
      throw error;
    }
  }

  async resendSignUp() {
    try {
      const user = await Auth.resendSignUp(
        this.state.email
      );
      this.props.updateUser({
        needConfirmation: true,
      });
      this.props.navigation.navigate('ConfirmationCode', {
        email: this.state.email,
        previous_screen: 'EmailInput'
      });
    } catch (error) {
      console.log('error resend sign up:', error);
      throw error;
    }
  }

  render() {
    return (
      <KeyboardAvoidingView
        behavior="height"
        keyboardVerticalOffset='50'
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.upperSection}>
            <Text style={styles.h3}>What's your email address?</Text>
            <Item>
              <Input
                style={styles.input}
                autoFocus={true}
                autoCapitalize="none"
                placeholder="Enter your email"
                onChangeText={this.inputEmailHandler}
                value={this.state.email}
                keyboardType="email-address" />
            </Item>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.bottomSection}>
            <Button
              disabled={this.state.disabled}
              style={!this.state.disabled ? styles.button : styles.buttonDisabled}
              onPress={this.checkEmailHandler}>
              <Text style={!this.state.disabled ? { ...styles.buttonTextSize, color: 'white' } : { ...styles.buttonTextSize, color: Colors.link }}>Continue</Text>
            </Button>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  // Action
  return {
    // update user
    updateUser: (user) => dispatch(updateUser(user)),
  };
};

export default withReduxStore(EmailInput);
