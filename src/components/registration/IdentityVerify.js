import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, Button } from 'native-base';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import Colors from '../../constants/colors';
import { styles } from './styles';

export default class IdentityVerify extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.upperSection}>
          <View style={{ flex: 1 }}>
            <Text style={styles.h3}>Your identity Verification</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.defaultText}>
              {'    '} In order to give you access to your medical data that is
            needed to generate the vaccine certificate, we will need to verify
            your identity. Would you like to do it now?
          </Text>
          </View>
        </View>
        <View style={styles.bottomSection}>
          <Button
            primary
            onPress={() => this.props.navigation.push('PersonalDetails')}
            block>
            <Text style={styles.buttonTextSize}>Continue</Text>
          </Button>

          <Text
            style={styles.noThanks}
            onPress={() => this.props.navigation.push('Main')}>
            No thanks
          </Text>
        </View>
      </View>
    );
  }
}
