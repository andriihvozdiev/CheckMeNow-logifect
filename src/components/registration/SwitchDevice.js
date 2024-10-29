/*
 *   Copyright (c) 2020 Grigore Crudu
 *   All rights reserved.
 */

import React, { Component } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { View, Text, Button } from 'native-base';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { styles } from './styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import withReduxStore from '../../utils/withReduxStore';
import { Auth } from 'aws-amplify';
import biometrics from '../../utils/biometrics';

class SwitchDevice extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  handleNoThanks = () => {
    Auth.signOut();
    biometrics.resetBiometrics();
    this.props.updateUser({ sessionState: 'signOut' });
  }

  handleSwitchDevice = async () => {
    try {
      this.props.updateUser({
        needConfirmation: true,
      });

      const credentials = await biometrics.checkBiometricsTemp();
      await Auth.verifyCurrentUserAttribute("email")
      this.props.navigation.navigate('ConfirmationCode', {
        email: credentials.username,
        previous_screen: 'SwitchDevice'
      });
    } catch (error) {
      console.log('error resend code: ', error.code);
      Alert.alert(
        "Failed",
        error.message
      )
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.upperSection}>
          <View style={{ flex: 1 }}>
            <Text style={styles.h3}>Wrong Device</Text>
          </View>
          <View style={{ flex: 2 }}>
            <Text style={styles.defaultText}>
              We have enrolled into our service with another mobile device.
              If you want to move your account to another mobile device,
              you will have to link your identity to the electronic health records again using the Linkage Key, Account ID and the GP ODS Code that are provided by your GP.
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.defaultText}>
              Would you like to do transfer the account to another device?
            </Text>
          </View>
        </View>
        <View style={styles.bottomSection}>
          <Button
            primary
            style={styles.button}
            onPress={() => this.handleSwitchDevice()}>
            <Text style={styles.buttonTextSize}>Switch device</Text>
          </Button>


          <Text style={{ ...styles.noThanks, ...styles.link }} onPress={() => this.handleNoThanks()}>
            No thanks
                </Text>
        </View>

      </View>
    );
  }
}

const localStyles = StyleSheet.create({
  descriptionText: {
    fontSize: RFValue(17),
    fontFamily: 'Avenir Next Medium',
    marginTop: 30,
    marginHorizontal: 20,
    lineHeight: 24
  },
  bottomButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20
  },
});

export default withReduxStore(SwitchDevice);
