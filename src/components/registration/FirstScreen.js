/*
 *   Copyright (c) 2020 Grigore Crudu
 *   All rights reserved.
 */

import React, { Component } from 'react';
import { View, Button, Text } from 'native-base';
import { StyleSheet, ActivityIndicator } from 'react-native';
import Lounge from './Lounge';
import { styles } from './styles';
import withReduxStore from './../../utils/withReduxStore';
import biometrics from '../../utils/biometrics';
import Session from '../../utils/Session';
import * as Keychain from 'react-native-keychain';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import {vw, vh } from 'react-native-expo-viewport-units';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';

class FirstScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    }
  }

  componentDidMount = async () => {
    this.setState({ isLoading: false })
    const haveBiometry = await Keychain.hasInternetCredentials("amplify")

    console.log("haveBiometry")
    console.log(haveBiometry)

    if (!haveBiometry)
      biometrics.getPin().then(credentials => {
        if (credentials) {
          this.props.navigation.navigate('EnterPinCode');
        }
      })
    else
      biometrics.checkBiometrics().then((credentials) => {
        if (credentials) {
          console.log('credentials');
          console.log(credentials);
          Session.signIn(credentials.username.trim(),
            credentials.password.trim(),
            this.props.initUserFromDb,
            this.props.updateUser);
        } else {
          this.props.navigation.navigate('EnterPinCode');
        }
      });
  }

  handleLogin = () => {
    biometrics.checkBiometrics().then((cred) => {
      if (cred) {
        this.setState({ isLoading: true })
        Session.signIn(cred.username.trim(),
          cred.password.trim(),
          this.props.initUserFromDb,
          this.props.updateUser).catch(
            (error) => {
              if (error.code === "UserNotConfirmedException")
                this.props.navigation.push('ConfirmCode');
              else
                this.props.navigation.push('Login');
            });
      } else {
        biometrics.getPin().then(credentials => {
          if (credentials) {
            this.props.navigation.push('EnterPinCode');
          } else {
            this.props.navigation.push('Login')
          }
        });
      }
    });
  }

  render() {
    return (
      <View style={{ ...styles.firstScreenContainer, paddingHorizontal: 0 }} >
        <ScrollView style={{ flex: 1, marginBottom: vh(3), backgroundColor: 'white' }} showsVerticalScrollIndicator={false}>
          <View style={{ paddingBottom: vh(3) }}>
            <View style={localStyles.logoContainer}>
              <Lounge />
            </View>
            <View style={localStyles.logoText}>
              <Text style={{ fontSize: RFValue(30), fontWeight: 'bold' }}>Check
                <Text style={{ fontSize: RFValue(30), fontWeight: '300' }}>Me
                  <Text style={{ fontSize: RFValue(30), fontWeight: 'bold' }}>Now</Text>
                </Text>
              </Text>
            </View>
            <View>
              <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: vh(1) }}>
                <ActivityIndicator
                  animating={this.state.isLoading}
                  size="large"
                  color="#00ff00"
                />
              </View>
            </View>
            <View style={{ paddingHorizontal: vh(2) }}>
              <View>
                <Text style={localStyles.firstScreenText}>
                  Free to enrol and use.
                </Text>
              </View>
              <View style={{ paddingTop: vh(1) }}>
                <Text style={localStyles.firstScreenText}>
                  CheckMeNow will send you reminders and notifications when your vaccination is
                  completed and when sufficient time has passed for substantial
                  immunity to develop.
                </Text>
              </View>
              <View style={{ paddingTop: vh(1) }}>
                <Text style={localStyles.firstScreenText}>
                  At this point it will automatically generate a secure QR code.
                </Text>
              </View>
              <View style={{ paddingTop: vh(1) }}>
                <Text style={localStyles.firstScreenText}>
                  This QR code will provide you access to businesses who have signed up.
                </Text>
              </View>
            </View>

          </View>
        </ScrollView>

        <View style={localStyles.bottomContainer}>
          <Button
            disabled={this.state.isLoading}
            style={styles.button}
            onPress={() => {
              this.props.navigation.push('TermsAndConditions');
            }}>
            <Text style={styles.buttonTextSize}>I'm new to CheckMeNow</Text>
          </Button>
          <View style={localStyles.loginTextContainer}>
            <TouchableOpacity onPress={() => this.handleLogin()} disabled={this.state.isLoading}>
              <Text style={{ ...styles.link, ...styles.buttonTextSize }}>
                I'm an existing user
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const localStyles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: vh(5),
  },
  bottomContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  logoText: {
    paddingTop: vh(3),
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: vh(2)
  },
  defaultText: {
    fontSize: RFPercentage(2.4),
    fontFamily: 'Avenir Next Medium',
  },
  firstScreenText: {
    fontSize: vw(4.6),
    fontFamily: 'Avenir Next Medium',
  }
});

export default withReduxStore(FirstScreen);
