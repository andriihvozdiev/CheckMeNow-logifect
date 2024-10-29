
/*
 *   Copyright (c) 2020 Victor Crudu
 *   All rights reserved.
 */

import React, { Component } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { View, Text, Button } from 'native-base';
import { RFValue } from 'react-native-responsive-fontsize';
import Session from '../../utils/Session';
import biometrics from '../../utils/biometrics';
import withReduxStore from '../../utils/withReduxStore';
import * as Keychain from 'react-native-keychain';
import PINCode, { hasUserSetPinCode, deleteUserPinCode, resetPinCodeInternalStates } from '@haskkor/react-native-pincode';
import colors from '../../constants/colors';

class EnterPinCode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: '',
            delayBetweenAttempts: 500,
            haveBiometry: false,
            isLocked: false
        };
    }

    componentDidMount = async () => {
        const BiometryType = await Keychain.getSupportedBiometryType();
        this.setState({ type: BiometryType });
        console.log("BiometryType")
        console.log(this.state.type)

        const haveBiometry = await Keychain.hasInternetCredentials("amplify")

        if (haveBiometry) this.setState({ haveBiometry: true });
        console.log("haveBiometry");
        console.log(this.haveBiometry);
    }

    _finishProcess = async (pinCode) => {
        console.log("Finishing process");
        this.setState({ isLoading: true });
        const hasPin = await hasUserSetPinCode('PINCode_service');
        if (hasPin) {
            console.log("getPin in process");
            const credentialsFromPin = await biometrics.getPin();
            console.log("Pin retreived in process ");
            console.log(credentialsFromPin);
            if (credentialsFromPin.password === pinCode) {
                console.log("checkBiometricsTemp");
                const credentialsFromTemp = await biometrics.checkBiometricsTemp();
                console.log("credentialsFromTemp");
                console.log(credentialsFromTemp);
                console.log("Signin in");
                Session.signIn(credentialsFromTemp.username, credentialsFromTemp.password,
                    this.props.initUserFromDb,
                    this.props.updateUser).then(() => {
                        if (!this.state.haveBiometry)
                            this.props.navigation.navigate('BiometricsEnrollment');
                    });
            }
        }

    }

    useTouchID = () => {
        this.props.navigation.navigate('BiometricsEnrollment', { BlockSignIn: true });
    }

    onFail = (attempts) => {
        if (attempts === 3) { 
            this.setState({ 
                isLoading: true,
                isLocked: true
            }) 
        }
    }

    resetPIN = () => {

    }



    render() {
        return (
            <View style={localStyles.container}>
                <View style={localStyles.upperSection}>
                    <PINCode
                        status={'enter'}
                        titleEnter={'Enter your 4 digit PIN'}
                        finishProcess={this._finishProcess}
                        touchIDDisabled={true}
                        textButtonLockedPage="Use password"
                        delayBetweenAttempts={this.state.delayBetweenAttempts}
                        pinCodeKeychainName={'PINCode_service'}
                        pinCodeVisible={false}
                        colorPassword={'black'}
                        colorPasswordEmpty={'black'}
                        colorCircleButtons={'rgb(255, 255, 255)'}
                        stylePinCodeButtonNumber={'black'}
                        stylePinCodeTextButtonCircle={{ fontWeight: '400' }}
                        stylePinCodeTextTitle={{ fontSize: RFValue(20), fontWeight: '400' }}
                        stylePinCodeTextSubtitle={{ }}
                        stylePinCodeColorTitle={'black'}
                        stylePinCodeColorSubtitle={'black'}
                        stylePinCodeButtonCircle={localStyles.stylePinCodeButtonCircle}
                        stylePinCodeDeleteButtonSize={35}
                        stylePinCodeDeleteButtonColorHideUnderlay={'#136AC7'}
                        styleLockScreenButton={{ backgroundColor: colors.blue }}
                        styleLockScreenTitle={{ color: 'black', fontWeight: '400' }}
                        styleLockScreenViewTimer={{ borderColor: 'black' }}
                        onClickButtonLockedPage={() => {
                            Alert.alert(null, "The pincode will be deleted and you will be able to login using password. Are you sure ?",
                                [
                                    {
                                        text: 'No',
                                        onPress: () => { }
                                    },
                                    {
                                        text: 'Yes',
                                        onPress: async () => {
                                            biometrics.resetPin();
                                            biometrics.resetBiometrics();
                                            await deleteUserPinCode("PINCode_service");
                                            await resetPinCodeInternalStates();
                                            this.props.navigation.navigate("Login");
                                        }
                                    },
                                ]);
                        }}
                        onFail={this.onFail}
                    />
                </View>
                                                
            </View >
        );
    }
}

const localStyles = StyleSheet.create({
    container:  {
        flex: 9
    },
    upperSection: {
        flex: 8,
        backgroundColor: 'white'
    },
    stylePinCodeButtonCircle: {
        borderColor: 'rgb(240, 240, 240)', 
        borderWidth: 1, 
        backgroundColor: 'transparent'
    }
});

export default withReduxStore(EnterPinCode);
