
/*
 *   Copyright (c) 2020 Victor Crudu
 *   All rights reserved.
 */

import React, { Component } from 'react';
import { Alert, ActivityIndicator, Platform } from 'react-native';
import { View, Text, Button, Input, Item } from 'native-base';
import { styles } from './styles';
import Session from '../../utils/Session';
import biometrics from '../../utils/biometrics';
import withReduxStore from '../../utils/withReduxStore';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FACE_ID, TOUCH_ID } from '../../constants/biometryType';
import { CommonActions } from '@react-navigation/native';

class PinCodeEnrollment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        };
    }

    componentDidMount = () => {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.props.navigation.dispatch(state => {
                const routes = state.routes.filter(r => r.name == 'PinCodeEnrollment');
                return CommonActions.reset({
                    ...state,
                    routes,
                    index: 0,
                });
            });
        });
    }

    componentWillUnmount = () => {
        //this.unsubscribe();
    };

    navigateToSetPinCodeScreen = () => {
        this.props.navigation.navigate('SetPinCode');
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
            <View style={styles.container}>
                <View style={styles.upperSection}>
                    <View style={{ flex: 1, marginTop: '15%' }}>
                        <Text style={styles.h3}>Security & PIN Code</Text>
                    </View>
                    <View style={{ flex: 3 }}>
                        <Text style={styles.defaultText}>
                            {' '}  In order to avoid using password every time when opening the application you can use PIN Code instead.
                        PIN Code will allow you to quickly open the application if the {this.biometryType(TOUCH_ID)} or {this.biometryType(FACE_ID)} biometrics check fails.
                        Would you like to set up PIN Code?
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
                        primary
                        onPress={this.navigateToSetPinCodeScreen}
                        style={styles.button}>
                        <Text style={styles.buttonTextSize}>Continue</Text>
                    </Button>

                    {/*<TouchableOpacity
                        onPress={this.navigateToMainScreen}
                        disabled={this.state.isLoading}>
                        <Text style={styles.noThanks}>
                            No
                        </Text>
                    </TouchableOpacity>*/}
                </View>
            </View >
        );
    }
}

export default withReduxStore(PinCodeEnrollment);
