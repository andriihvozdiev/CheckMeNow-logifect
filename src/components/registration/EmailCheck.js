import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, Button } from 'native-base';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import { styles } from './styles';

export default class EmailCheck extends Component {
  constructor(props) {
    super(props);
  }

  checkEmailHandler = () => {
    this.props.navigation.navigate('ConfirmationCode');
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.firstScreenContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.h3}>Check your email</Text>
          </View>
          <Text style={styles.defaultText}>
            We have sent an email to
            <Text style={{ fontWeight: 'bold' }}>
              {' '}
              {this.props.route.params.email}
              {'. '}
            </Text>
            Check your inbox including your spam and junk folders. There is a
            code that you need to input in the next screen.
          </Text>
        </View>
        <View style={styles.bottomSection}>
          <Button style={styles.button} onPress={this.checkEmailHandler}>
            <Text style={styles.buttonTextSize}>Confirm Code</Text>
          </Button>
        </View>
      </View>
    );
  }
}
