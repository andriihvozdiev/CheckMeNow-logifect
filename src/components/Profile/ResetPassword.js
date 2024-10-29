/*
 *   Copyright (c) 2020 Victor Crudu
 *   All rights reserved.
 */

import React, { Component } from 'react';
import { Alert } from 'react-native';
import { View, Text, Button, Input } from 'native-base';
import { isPasswordValid } from '../../utils/validation';
import { Auth } from 'aws-amplify';
import withReduxStore from '../../utils/withReduxStore';
import { styles } from '../registration/styles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../constants/colors';

import biometrics from '../../utils/biometrics';
import { TouchableOpacity } from 'react-native-gesture-handler';

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      oldPassword: '',
      newPassword: '',
      editable: false,
      secureTextEntry: true,
    };
  }

  componentDidMount = () => {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.props.updateNavigation({ profileHeaderShown: true });
    });
  };

  componentWillUnmount = () => {
    this.unsubscribe();
  };

  inputPasswordHandler = (value) => {
    this.setState({
      newPassword: value,
    });
  };

  editPassword = async () => {
    if (this.state.editable) {
      this.setState({ secureTextEntry: !this.state.secureTextEntry });
    } else {
      const user = await Auth.currentAuthenticatedUser();
      this.props.navigation.navigate('CheckSecurityQuestion', {
        question: user.attributes["custom:security_question"],
        to: 'password'
      });
    }
  };

  editPIN = async() => {
    const user = await Auth.currentAuthenticatedUser();
    this.props.navigation.navigate('CheckSecurityQuestion', {
      question: user.attributes["custom:security_question"],
      to: 'pin'
    });
  }

  savePasswordHandler = async () => {
    if (!isPasswordValid(this.state.newPassword)) {
      Alert.alert(
        'Warning',
        'Password should be at least 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character,',
        [{ text: 'OK' }],
      );
      return;
    }

    try {
      const user = await Auth.currentAuthenticatedUser();

      await Auth.changePassword(
        user,
        this.state.oldPassword,
        this.state.newPassword,
      );

      await biometrics.setBiometrics(this.state.email, this.state.newPassword);
      this.setState({ newPassword: '' });
      Alert.alert('Info', 'The password has been changed successfully', [
        {
          text: 'OK',
          onPress: () => this.props.navigation.navigate('Main'),
        },
      ]);
      this.setState({ editable: false });
    } catch (error) {
      Alert.alert('Warning', error.message, [
        {
          text: 'OK',
        },
      ]);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.upperSection}>
          <View style={{ marginTop: '25%' }}>
            <Text style={{ ...styles.h3, textAlign: 'left' }}>Password</Text>
            <View
              style={{
                ...styles.messageInput,
                borderBottomWidth: 1,
                borderBottomColor: Colors.borderColor
              }}>
              <Input
                secureTextEntry={this.state.secureTextEntry}
                editable={this.state.editable}
                placeholder={!this.state.editable ? '**********' : ''}
                onChangeText={this.inputPasswordHandler}
                value={this.state.newPassword}
              />
              <TouchableOpacity onPress={this.editPassword}>
                {!this.state.editable ? (
                  <AntDesign right size={35} name="edit" />
                ) : (
                  <Feather
                    right
                    size={35}
                    name={this.state.secureTextEntry ? 'eye-off' : 'eye'}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={{ marginTop: '5%' }}>
            <Text style={{ ...styles.h3, textAlign: 'left' }}>PIN</Text>
            <View
              style={{
                ...styles.messageInput,
                borderBottomWidth: 1,
                borderBottomColor: Colors.borderColor
              }}>
              <Input
                editable={false}
                placeholder='****'
              />
              <TouchableOpacity onPress={this.editPIN}>
                <AntDesign right size={35} name="edit" />
              </TouchableOpacity>
            </View>
          </View>
          
        </View>

        <View style={styles.bottomSection}>
          {this.state.editable ? (
            <Button style={styles.button} onPress={this.savePasswordHandler}>
              <Text>Save</Text>
            </Button>
          ) : (<Button style={styles.button} onPress={() => this.props.navigation.navigate('Main')}>
            <Text style={styles.buttonTextSize}>Close</Text>
          </Button>)}
        </View>
      </View>
    );
  }
}

export default withReduxStore(ResetPassword);
