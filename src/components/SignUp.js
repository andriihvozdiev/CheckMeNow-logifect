/*
 *   Copyright (c) 2020 Victor Crudu
 *   All rights reserved.
 */

import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import {
    Container,
    Content,
    Button,
    Input,
    Item,
    Picker,
    Text
} from 'native-base'

import Auth from '@aws-amplify/auth';
import { phone_codes } from '../model/phone_codes'
import { country_codes } from '../model/country_codes'
import { isEmailValid } from '../utils/validation'
import { isPasswordValid } from '../utils/validation'
import { isPhoneNumberValid } from '../utils/validation'
import { styles } from '../components/registration/styles'
import { ErrorMessage } from '../utils/component_utils'
import { globalStorage } from '../store/globalStorage'

export default class SignUp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            signinSuccess: true,
            signinErrorMessage: '',
            validation: false,
            isFormValid: false,
            phoneCode: '+44',
            isFormReady: false
        }

        this.setSigninSuccess = this.setSigninSuccess.bind(this)
        this.setSigninErrorMessage = this.setSigninErrorMessage.bind(this)
        this.signUp = this.signUp.bind(this)
        this.validateForm = this.validateForm.bind(this)
        this.isFormReady = this.isFormReady.bind(this)
    }

    onEmailChange(value) {
        this.setState({
            email: value.trim(),
            isFormReady: this.isFormReady()
        })
    }

    onPasswordChange(value) {
        this.setState({
            password: value,
            isFormReady: this.isFormReady()
        })
    }

    isFormReady() {
        return !!this.state.name &&
            !!this.state.password &&
            !!this.state.email &&
            !!this.state.phoneNumber
    }

    onNameChange(value) {
        this.setState({
            name: value,
            isFormReady: this.isFormReady()
        })
    }

    onPhoneCodeChange(value) {
        if (value.indexOf('+') == -1) {
            value = '+' + value
        }
        this.setState({
            phoneCode: value,
            isFormReady: this.isFormReady()
        })
    }

    onPhoneNumberChanged(value) {
        this.setState({
            phoneNumber: value.replace(/[^0-9]/g, ''),
            isFormReady: this.isFormReady()
        });
    }

    setSigninSuccess(value) {
        this.setState({
            signinSuccess: value
        })
    }

    setSigninErrorMessage(value) {
        alert(value)
        this.setState({
            signinErrorMessage: value
        })
    }

    validateForm() {
        const isValid = isEmailValid(this.state.email) &&
            isPasswordValid(this.state.password) &&
            isPhoneNumberValid(this.state.phoneNumber)
        this.setState({
            validation: true,
            isFormValid: isValid
        })
    }

    async signUp() {
        this.validateForm()
        if (!this.state.isFormValid) {
            return
        }
        try {
            globalStorage.user = await Auth.signUp({
                username: this.state.email,
                password: this.state.password,
                attributes: {
                    name: this.state.name,
                    phone_number: this.state.phoneCode + this.state.phoneNumber   // optional - E.164 number convention
                }
            })

            this.props.navigation.push('Login')
        } catch (error) {
            this.setSigninErrorMessage(error)
        }
    }

    async confirmSignUp() {
        try {
            await Auth.confirmSignUp(username, code);
        } catch (error) {
            this.setSigninErrorMessage(error)
        }
    }

    render() {

        return (
            <Container style={styles.container}>
                <Content>
                    <Text style={styles.h3}>Create your account now</Text>
                    <View style={{ marginTop: 20 }}>
                        <Text>Name *</Text>
                        <Item error={this.state.validation && !this.state.name}
                            regular
                            style={{ marginTop: 10 }}>
                            <Input
                                placeholder='Name'
                                value={this.state.name}
                                onChangeText={this.onNameChange.bind(this)} />
                        </Item>
                        <ErrorMessage show={this.state.validation && !this.state.name}>
                            Name is not valid
                            </ErrorMessage>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <Text>Email *</Text>
                        <Item error={this.state.validation && !isEmailValid(this.state.email)}
                            regular
                            style={{ marginTop: 10 }}>
                            <Input
                                placeholder='Email'
                                value={this.state.email}
                                onChangeText={this.onEmailChange.bind(this)} />
                        </Item>
                        <ErrorMessage show={this.state.validation && !isEmailValid(this.state.email)}>
                            Email is not valid
                            </ErrorMessage>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <Text>Password *</Text>
                        <Item error={this.state.validation && !isPasswordValid(this.state.password)} regular style={{ marginTop: 10 }}>
                            <Input
                                placeholder='Password'
                                secureTextEntry
                                value={this.state.password}
                                onChangeText={this.onPasswordChange.bind(this)} />
                        </Item>
                    </View>
                    <ErrorMessage show={this.state.validation && !isPasswordValid(this.state.password)}>
                        Password is not valid
                            </ErrorMessage>
                    <View style={{ marginTop: 20 }}>
                        <Text>Phone Number *</Text>
                        <View style={{ marginTop: 30, flexDirection: 'row' }}>
                            <Picker
                                mode="dropdown"
                                placeholder="44"
                                placeholderStyle={{ color: "#bfc6ea" }}
                                placeholderIconColor="#007aff"
                                style={{ width: 100, marginTop: 10 }}
                                selectedValue={this.state.phoneCode}
                                onValueChange={this.onPhoneCodeChange.bind(this)}
                            >
                                {
                                    [...Object.keys(phone_codes)].sort((a, b) => {
                                        if (country_codes[a] > country_codes[b]) return 1;
                                        if (country_codes[a] < country_codes[b]) return -1;
                                        return 0
                                    }).map(key =>
                                        <Picker.Item
                                            label={phone_codes[key]}
                                            value={phone_codes[key]}
                                            textStyle={{ color: 'blue' }}
                                        />
                                    )
                                }
                            </Picker>
                            <Item error={this.state.validation && !isPhoneNumberValid(this.state.phoneNumber)} regular style={{ marginTop: 10, flexGrow: 1 }}>
                                <Input
                                    placeholder='Phone Number'
                                    value={this.state.phoneNumber}
                                    onChangeText={this.onPhoneNumberChanged.bind(this)} />
                            </Item>
                        </View>
                    </View>
                    <ErrorMessage show={this.state.validation && !isPhoneNumberValid(this.state.phoneNumber)}>
                        Phone number is not valid
                            </ErrorMessage>

                    <View style={{ marginTop: 10 }}>
                        <Button disabled={!this.state.isFormReady} onPress={this.signUp} style={{ marginTop: 10, height: 50 }} block><Text> SIGN UP </Text></Button>
                    </View>
                    <View style={styles.additionalOptions}>
                        <Text style={styles.link} onPress={() => this.props.navigation.push('ConfirmCode')}>Confirm a Code</Text>
                        <Text style={styles.link} onPress={() => this.props.navigation.push('Login')}>Sign In</Text>
                    </View>
                </Content>
            </Container>
        )
    }
}