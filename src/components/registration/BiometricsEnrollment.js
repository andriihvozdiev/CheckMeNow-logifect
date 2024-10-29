
/*
 *   Copyright (c) 2020 Victor Crudu
 *   All rights reserved.
 */

import React, { Component } from 'react';
import { Alert, ActivityIndicator, Platform } from 'react-native';
import { View, Text, Button, Input, Item } from 'native-base';
import { styles } from './styles';
import biometrics from '../../utils/biometrics';
import withReduxStore from '../../utils/withReduxStore';
import * as Keychain from 'react-native-keychain';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FACE_ID, TOUCH_ID } from '../../constants/biometryType';
import { CommonActions } from '@react-navigation/native';

class BiometricsEnrollment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: '',
            isLoading: false
        };
    }

    componentDidMount = async () => {
        /*this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.props.navigation.dispatch(state => {
                const routes = state.routes.filter(r => r.name == 'BiometricsEnrollment');
                return CommonActions.reset({
                    ...state,
                    routes,
                    index: 0,
                });
            });
        });*/
        const BiometryType = await Keychain.getSupportedBiometryType();
        this.setState({ type: BiometryType });
        console.log("BiometryType");
        console.log(this.state.type);
    }

    componentWillUnmount = () => {
        //this.unsubscribe();
    };

    saveBiometrics = async () => {
        try {
            this.setState({ isLoading: true });
            const credentials = await biometrics.checkBiometricsTemp();
            const setBio = await biometrics.setBiometrics(credentials.username, credentials.password);
            console.log("setBio")
            console.log(setBio)
            this.setState({ isLoading: false });
            const checkCredentials = await biometrics.checkBiometrics();
            console.log("BIOMETRICS");
            console.log(checkCredentials);
            if (checkCredentials) {
                this.navigateToMainScreen();
            } else {
                await biometrics.resetBiometrics();
                Alert.alert("Warning", "Biometrics enrolment failure.", [
                    {
                        text: 'OK',
                        onPress: () => this.navigateToMainScreen(),
                    },
                ]);
            }

        }
        catch (error) {
            Alert.alert('Warning', error.message, [
                {
                    text: 'OK',
                    onPress: () => {
                        this.props.navigation.navigate('Login');
                    },
                },
            ]);
        }
    };

    navigateToMainScreen = () => {
        this.props.navigation.navigate('Main');
    };


    biometryType = (type) => {
        if (type === TOUCH_ID)
            if (Platform.OS === 'ios')
                return 'Touch ID'; else return 'Fingerprint';
        else if (Platform.OS === 'ios') return 'Face ID'; else return 'Face';
    }


    render() {
        return (
            <View style={styles.container} >
                <View style={styles.upperSection}>
                    <View style={{ flex: 1, marginTop: '15%' }}>
                        <Text style={styles.h3}>Security & Biometrics</Text>
                    </View>
                    <View style={{ flex: 3 }}>
                        {
                            this.state.type === "TouchID" || this.state.type === "Fingerprint" ?
                                <Text style={styles.defaultText}>
                                    In order to avoid using password every time when opening
                                the application you can use {this.biometryType(TOUCH_ID)} to open it.
                                Would you like to use {this.biometryType(TOUCH_ID)}?
                            </Text> :
                                this.state.type === "FaceID" || this.state.type === "Face" ?
                                    <Text style={styles.defaultText}>
                                        In order to avoid using password every time when opening the
                                    application you can use {this.biometryType(FACE_ID)} to open it.
                                    Would you like to use {this.biometryType(FACE_ID)}?
                                </Text> : null
                        }
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
                        disabled={this.state.isLoading}
                        primary
                        onPress={this.saveBiometrics}
                        style={styles.button}>
                        <Text style={styles.buttonTextSize}>Yes</Text>
                    </Button>
                    <TouchableOpacity
                        disabled={this.state.isLoading}
                        onPress={this.navigateToMainScreen}>
                        <Text style={styles.noThanks}>
                            No
                        </Text>
                    </TouchableOpacity>
                </View>
            </ View >
        );
    }
}

export default withReduxStore(BiometricsEnrollment);
