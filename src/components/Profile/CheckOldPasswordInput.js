/*
 *   Copyright (c) 2020 Grigore Crudu
 *   All rights reserved.
 */

import React, { Component } from 'react';
import { KeyboardAvoidingView, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { View, Text, Button, Input, Item } from 'native-base';
import { isPasswordValid } from '../../utils/validation';
import { Auth } from 'aws-amplify';
import { styles } from '../registration/styles';
import Feather from 'react-native-vector-icons/Feather';
import biometrics from '../../utils/biometrics';
import withReduxStore from '../../utils/withReduxStore';
import Colors from '../../constants/colors';

class CheckOldPasswordInput extends Component {
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
            const credentials = await biometrics.checkBiometricsTemp()

            if (credentials !== null && credentials.password === this.state.password) {
                await Auth.verifyCurrentUserAttribute("email")
                
                this.props.navigation.navigate('ConfirmationCodeForResetPassword', {
                    email: credentials.username,
                    to: this.props.route.params.to
                });
            } else {
                Alert.alert('Warning', "Wrong old password!", [{ text: 'OK' }]);
            }
        } catch (error) {
            Alert.alert('Warning', error.message, [{ text: 'OK' }]);
        }
    };



    render() {
        return (
            <KeyboardAvoidingView
                behavior="height"
                keyboardVerticalOffset='50'
                style={styles.container}>
                <View style={styles.upperSection}>
                    <Text style={styles.h3}>Please input your old password</Text>
                    <Item style={{ ...styles.input, marginTop: 50 }} >
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
                <View style={styles.bottomSection}>
                    <Button
                        disabled={this.state.isLoading || !this.state.password}
                        style={this.state.password ? styles.button : styles.buttonDisabled}
                        onPress={this.checkPasswordHandler}>
                        <Text style={this.state.password ? { ...styles.buttonTextSize, color: 'white' } : { ...styles.buttonTextSize, color: Colors.link }}>Continue</Text>
                    </Button>
                </View>
            </KeyboardAvoidingView>
        );
    }
}



export default withReduxStore(CheckOldPasswordInput);
