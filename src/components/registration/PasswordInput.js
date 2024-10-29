/*
 *   Copyright (c) 2020 Grigore Crudu
 *   All rights reserved.
 */

import React, { Component } from 'react';
import { Alert, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { View, Text, Button, Input, Item } from 'native-base';
import { isPasswordValid } from '../../utils/validation';
import { Auth } from 'aws-amplify';
import { connect } from 'react-redux';
import { updateUser } from '../../store/actions';
import { styles } from './styles';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../constants/colors';

import biometrics from '../../utils/biometrics';

class PasswordInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      secureTextEntry: true,
    };

    //this.signUp = this.signUp.bind(this);
  }

  inputPasswordHandler = (value) => {
    this.setState({
      password: value,
    });
  };

  editVisiblity = () => {
    this.setState({
      secureTextEntry: !this.state.secureTextEntry,
    });
  };

  checkPasswordHandler = async () => {
    if (!isPasswordValid(this.state.password)) {
      Alert.alert(
        'Warning',
        'Password should be at least 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character.',
        [{ text: 'OK' }],
      );
      return;
    }

    try {
      const user = await Auth.currentAuthenticatedUser();
      const credentials = await biometrics.checkBiometricsTemp();

      await Auth.changePassword(
        user,
        credentials.password, // temporary password
        this.state.password, // new password
      );

      await biometrics.setBiometricsTemp(this.props.user.email.trim(), this.state.password);

      this.props.navigation.navigate('SecurityQuestion');
    } catch (error) {
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
    }
  };

  /* async signUp() {
    try {
      const user = await Auth.signUp({
        username: this.props.user.email.trim(),
        password: this.state.password.trim(),
        attributes: {
          email: this.props.user.email.trim(),
        },
      });

      await biometrics.setBiometricsTemp(this.props.user.email, this.state.password);
    } catch (error) {
      console.log('error signing up:', error);
      throw error;
    }
  } */

  render() {
    return (
      <KeyboardAvoidingView
        behavior="height"
        keyboardVerticalOffset='50'
        style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.upperSection}>
            <Text style={styles.h3}>Choose your password</Text>
            <Item style={styles.input} >
              <Input
                secureTextEntry={this.state.secureTextEntry}
                placeholder="At least 8 characters"
                onChangeText={this.inputPasswordHandler}
                value={this.state.password}
              />
              <TouchableOpacity onPress={this.editVisiblity}>
                <Feather
                  right
                  size={35}
                  name={this.state.secureTextEntry ? 'eye-off' : 'eye'}
                />
              </TouchableOpacity>
            </Item>
            <View style={{ margin: 10 }}>
              <Text style={styles.smallText}>
                Password should be at least 8 to 15 characters
              {'\n'}which contains at least
              {'\n'}one lowercase
              {'\n'}one uppercase
              {'\n'}one numeric
              {'\n'}one special character.
            </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.bottomSection}>
            <Button
              disabled={!this.state.password}
              style={this.state.password ? styles.button : styles.buttonDisabled}
              onPress={this.checkPasswordHandler}>
              <Text style={this.state.password ?
                { ...styles.buttonTextSize, color: 'white' } :
                { ...styles.buttonTextSize, color: Colors.link }}>Continue</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(PasswordInput);
