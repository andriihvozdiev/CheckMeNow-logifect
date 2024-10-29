/**
 * Answer Security Question created by Luke
 * on 2021/03/12
 */

import React, { Component } from 'react';
import { StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { View, Text, Button, Input, Item } from 'native-base';
import { isPasswordValid, isQuestionAnswerValid } from '../../utils/validation';
import { Auth } from 'aws-amplify';
import { styles } from './styles';
import { sha256 } from 'react-native-sha256';
import biometrics from '../../utils/biometrics';
import Session from '../../utils/Session';
import withReduxStore from '../../utils/withReduxStore';
import { getUniqueId, getManufacturer } from 'react-native-device-info';
import Colors from '../../constants/colors';

class AnswerSecurityQuestion extends Component {
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
      const credentials = await biometrics.checkBiometricsTemp();

      const hashedAnswer = await sha256(this.state.answer)

      await Auth.updateUserAttributes(
        user,
        {
          "custom:security_question": this.props.route.params.question,
          "custom:security_answer": hashedAnswer,
          "custom:device_id": getUniqueId()
        },
      );

      await Session.init(user.attributes["email"],
        this.props.initUserFromDb,
        this.props.updateUser);

      this.setState({ isLoading: false });

      //await biometrics.setBiometrics(credentials.username, credentials.password)

      this.props.navigation.navigate('PinCodeEnrollment');
    } catch (error) {
      this.setState({ isLoading: false });
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

  render() {
    return (
      <KeyboardAvoidingView
        behavior="height"
        keyboardVerticalOffset='50'
        style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.bottomSection}>
            <Button
              disabled={!this.state.answer}
              style={this.state.answer ? styles.button : styles.buttonDisabled}
              onPress={this.checkAnswerHandler}>
              <Text style={this.state.answer ?
                { ...styles.buttonTextSize, color: 'white' } :
                { ...styles.buttonTextSize, color: Colors.link }}>Continue</Text>
            </Button>
          </View>
        </TouchableWithoutFeedback>
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


export default withReduxStore(AnswerSecurityQuestion);
