/*
 *   Copyright (c) 2020 Grigore Crudu
 *   All rights reserved.
 */

import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { View, Text, Button, Input, Item } from 'native-base';
import { isCodeValid } from '../../utils/validation';
import { Auth } from 'aws-amplify';
import { styles } from './styles';
import biometrics from '../../utils/biometrics';
import withReduxStore from '../../utils/withReduxStore';
import Colors from '../../constants/colors';
import { RFValue, RFPercentage } from 'react-native-responsive-fontsize';
import Session from '../../utils/Session';
import {
  CodeField,
  useClearByFocusCell,
  useBlurOnFulfill,
  Cursor
} from 'react-native-confirmation-code-field';
import { getUniqueId, getManufacturer } from 'react-native-device-info';

const ConfirmationCode = (props) => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const ref = useBlurOnFulfill({ code, cellCount: 6 });
  const [propss, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  });

  useEffect(() => {
    const func = async () => {
      if (props.route.params && props.route.params.previous_screen === 'LoginScreen') {
        props.updateUser({
          needConfirmation: true,
        });
        try {
          await Auth.verifyCurrentUserAttribute("email");
        } catch (err) {
          Alert.alert(
            'Warning', err.message);
        }
      }
    }
    func();
  }, []);

  const maskEmail = (email) => {
    const [username, domain] = email.split('@');
    return username[0] + username.substr(1).replace(/./g, '*')
      + '@' + domain[0] + domain.substr(1, domain.lastIndexOf('.')).replace(/./g, '*')
      + domain.substr(domain.lastIndexOf('.'));
  }

  const checkConfirmCodeHandler = async () => {
    if (!isCodeValid(code)) {
      Alert.alert('Warning', 'Please, enter valid Code', [{ text: 'OK' }]);
      return;
    }
    console.log("========", props.route.params)
    if (props.route.params && props.route.params.previous_screen === 'EmailInput') {
      console.log("========")
      checkConfirmCodeForEmailInput()
    } else if (props.route.params && props.route.params.previous_screen === 'SwitchDevice') {
      checkConfirmCodeForDevice()
    } else if (props.route.params && props.route.params.previous_screen === 'LoginScreen') {
      checkConfirmCodeForLoginScreen()
    }


  };

  const checkConfirmCodeForLoginScreen = async () => {
    try {
      setIsLoading(true);
      await Auth.verifyCurrentUserAttributeSubmit("email", code);
      props.navigation.navigate('PinCodeEnrollment');
    } catch (error) {
      Alert.alert('Warning', error.message, [{ text: 'OK' }]);
      setIsLoading(false);
    }
  }

  const checkConfirmCodeForEmailInput = async () => {
    try {
      setIsLoading(true);
      const result = await Auth.confirmSignUp(
        props.user.email,
        code,
      );

      console.log("result")
      console.log(result)
      const credentials = await biometrics.checkBiometricsTemp();
      console.log("CREDENTIALS")
      console.log(credentials);

      await Auth.signIn(credentials.username, credentials.password);

      props.navigation.navigate('PasswordInput');
    } catch (error) {
      console.log("error")
      console.log(error)
      Alert.alert('Warning', error.message, [{ text: 'OK' }]);
      setIsLoading(false);
    }
  }

  const checkConfirmCodeForDevice = async () => {
    try {
      setIsLoading(true);

      await Auth.verifyCurrentUserAttributeSubmit("email", code);
      const user = await Auth.currentAuthenticatedUser();

      await Auth.updateUserAttributes(
        user,
        {
          "custom:device_id": getUniqueId()
        },
      );

      if (user.attributes["custom:security_answer"] === undefined) {
        props.navigation.navigate('SecurityQuestion');
      } else {
        props.navigation.navigate('PinCodeEnrollment');
      }
    } catch (error) {
      Alert.alert('Warning', error.message, [{ text: 'OK' }]);
      setIsLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior="height"
      keyboardVerticalOffset='50'
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.upperSection}>
          <Text style={styles.h3}>Enter the 6-digit code</Text>

          <View style={{ marginTop: 30 }}>
            <Text style={{ ...styles.defaultText, }}>
              {`We have sent an email to ${maskEmail(props.route.params.email)}. Check your inbox including your spam and junk folders.`}
            </Text>
          </View>

          <CodeField
            ref={ref}
            cellCount={6}
            {...propss}
            value={code}
            onChangeText={setCode}
            rootStyle={localStyles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({ index, symbol, isFocused }) => (

              <View
                onLayout={getCellOnLayoutHandler(index)}
                key={index}
                style={[localStyles.cellRoot, isFocused && localStyles.focusCell]}>
                <Text style={styles.cellText}>
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              </View>
            )}
            caretHidden={false} />

          <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '5%',
            marginTop: '10%'
          }}>
            <ActivityIndicator
              animating={isLoading}
              size="large"
              color="#00ff00"
            />
          </View>

        </View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.bottomSection}>
          <Button
            disabled={!code || isLoading}
            style={!code || isLoading ? styles.buttonDisabled : styles.button}
            onPress={checkConfirmCodeHandler}>
            <Text style={!code || isLoading ? { ...styles.buttonTextSize, color: Colors.link } : { ...styles.buttonTextSize, color: 'white' }}>Continue</Text>
          </Button>
        </View>
      </TouchableWithoutFeedback>


    </KeyboardAvoidingView>
  );

}


const localStyles = StyleSheet.create({
  codeFieldRoot: {
    marginTop: 20,
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  cellRoot: {
    width: 40,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  cellText: {
    color: '#000',
    fontSize: 32,
    textAlign: 'center',
  },
  focusCell: {
    borderBottomColor: '#007AFF',
    borderBottomWidth: 2,
  },
});


export default withReduxStore(ConfirmationCode);
