/*
 *   Copyright (c) 2020 Grigore Crudu
 *   All rights reserved.
 */

import React, { Component } from 'react';
import { KeyboardAvoidingView, Alert, TouchableOpacity, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { View, Text, Button, Input, Item } from 'native-base';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import { isPasswordValid, isCodeValid } from '../../utils/validation';
import { Auth } from 'aws-amplify';
import { styles } from './styles';
import Feather from 'react-native-vector-icons/Feather';

import biometrics from '../../utils/biometrics';
import Session from '../../utils/Session';
import withReduxStore from '../../utils/withReduxStore';
import Colors from '../../constants/colors';

class forgotPasswordInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            secureTextEntry: true,
            isLoading: false,
        };
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
                'Password should be at least 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character,',
                [{ text: 'OK' }],
            );
            return;
        }

        try {
            await Auth.forgotPasswordSubmit(
                this.props.route.params.email.trim(),
                this.props.route.params.code.trim(),
                this.state.password.trim()
            );

            this.setState({ isLoading: true });
            await biometrics.setBiometricsTemp(this.props.route.params.email.trim(), this.state.password.trim());

            const credentials = await biometrics.checkBiometricsTemp();
            await Auth.signIn(credentials.username, credentials.password);

            if (this.props.route.params.isSignUp) {
                this.props.navigation.navigate('SecurityQuestion');
                return;
            }

            const user = await Auth.currentAuthenticatedUser();
            await Session.init(user.attributes["email"],
                this.props.initUserFromDb,
                this.props.updateUser);

            //await biometrics.setBiometrics(credentials.username, credentials.password)

            //await biometrics.resetBiometrics();
            await biometrics.resetPin();

            this.props.navigation.navigate('PinCodeEnrollment');
        } catch (error) {
            Alert.alert('Warning', error.message, [{ text: 'OK' }]);
            this.props.navigation.navigate('ConfirmationCodeForForgotPassword');
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

                        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: '5%' }}>
                            <ActivityIndicator
                                animating={this.state.isLoading}
                                size="large"
                                color="#00ff00"
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.bottomSection}>
                    <Button
                        disabled={this.state.isLoading || !this.state.password}
                        style={this.state.password ? styles.button : styles.buttonDisabled}
                        onPress={this.checkPasswordHandler}>
                        <Text style={this.state.password ?
                            { ...styles.buttonTextSize, color: 'white' } :
                            { ...styles.buttonTextSize, color: Colors.link }}>Continue</Text>
                    </Button>
                </View>
            </KeyboardAvoidingView>
        );
    }
}



export default withReduxStore(forgotPasswordInput);
