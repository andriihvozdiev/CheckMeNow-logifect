/**
 * Answer Security Question created by Luke
 * on 2021/03/12
 */

import React, { Component } from 'react';
import { StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import { View, Text, Button, Input, Item } from 'native-base';
import { isPasswordValid, isQuestionAnswerValid } from '../../utils/validation';
import { Auth } from 'aws-amplify';
import { styles } from '../registration/styles';
import { sha256 } from 'react-native-sha256';
import biometrics from '../../utils/biometrics';
import Session from '../../utils/Session';
import withReduxStore from '../../utils/withReduxStore';
import { getUniqueId, getManufacturer } from 'react-native-device-info';
import Colors from '../../constants/colors';

class CheckSecurityQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      answer: '',
      isLoading: false
    };
  }

  inputPasswordHandler = (value) => {
    this.setState({
      answer: value,
    });
  };

  checkAnswerHandler = async () => {
    if (!isQuestionAnswerValid(this.state.answer)) {
      Alert.alert(
        'Warning',
        'Answer must be between 3 - 30 characters.',
        [{ text: 'OK' }],
      );
      return;
    }

    try {
      this.setState({ isLoading: true });
      const user = await Auth.currentAuthenticatedUser();
      const hashedAnswer = await sha256(this.state.answer)

      if (user.attributes["custom:security_answer"] == hashedAnswer) {
        this.props.navigation.navigate('CheckOldPasswordInput', {
          to: this.props.route.params.to
        });
      } else {
        Alert.alert('Warning', "Your answer is wrong. Please try again.", [
          {
            text: 'OK',
          },
        ]);
      }

      this.setState({ isLoading: false });

    } catch (error) {
      this.setState({ isLoading: false });
      Alert.alert('Warning', error.message, [
        {
          text: 'OK',
        },
      ]);
    }

  };

  render() {
    return (
      <KeyboardAvoidingView
        behavior="height"
        keyboardVerticalOffset='50'
        style={styles.container}>
        <View style={styles.upperSection}>
          <Text style={styles.h3}>Answer security question</Text>
          <View style={localStyles.input}>
            <Text style={styles.defaultText}>{this.props.route.params.question}</Text>
            <Item style={localStyles.answerInput}>
              <Input
                placeholder="At least 3 characters"
                onChangeText={this.inputPasswordHandler}
                value={this.state.password}
              />
            </Item>
            <Text style={styles.smallText}>Answer must be between 3-30 characters</Text>
          </View>

          <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '5%',
            marginTop: '10%'
          }}>
            <ActivityIndicator
              animating={this.state.isLoading}
              size="large"
              color="#00ff00"
            />
          </View>
        </View>
        <View style={styles.bottomSection}>
          <Button
            disabled={!this.state.answer}
            style={this.state.answer ? styles.button : styles.buttonDisabled}
            onPress={this.checkAnswerHandler}>
            <Text style={this.state.answer ? { ...styles.buttonTextSize, color: 'white' } : { ...styles.buttonTextSize, color: Colors.link }}>Continue</Text>
          </Button>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const localStyles = StyleSheet.create({
  input: {
    width: '100%',
    marginTop: '15%',
  },
  answerInput: {
    marginTop: 50,
    marginBottom: 10,
  }
});


export default withReduxStore(CheckSecurityQuestion);
