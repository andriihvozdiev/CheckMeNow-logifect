
/*
 *   Copyright (c) 2020 Victor Crudu
 *   All rights reserved.
 */

import React, { Component } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { View, Text, Button, Input, Item } from 'native-base';
import { isCodeValid } from '../../utils/validation';
import { Auth } from 'aws-amplify';
import { styles } from './styles';
import biometrics from '../../utils/biometrics';
import withReduxStore from '../../utils/withReduxStore';
import * as Keychain from 'react-native-keychain';
import PINCode, { hasUserSetPinCode, deleteUserPinCode, resetPinCodeInternalStates } from '@haskkor/react-native-pincode';
import colors from '../../constants/colors';
import { RFValue } from 'react-native-responsive-fontsize';



class SetPinCode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: '',
            delayBetweenAttempts: 500,
        };
    }

    componentDidMount = async () => {
        const BiometryType = await Keychain.getSupportedBiometryType();
        this.setState({ type: BiometryType });
        console.log("BiometryType")
        console.log(this.state.type)

        const haveBiometry = await Keychain.hasInternetCredentials("amplify")

        if (haveBiometry) this.setState({ isLoading: true });
        console.log("haveBiometry");
        console.log(this.haveBiometry);
    }

    componentWillUnmount = () => {


    };

    _finishProcess = async (pinCode) => {
        console.log("Finishing process");
        this.setState({ isLoading: true });
        const hasPin = await hasUserSetPinCode('PINCode_service');
        if (hasPin) {
            console.log("setPin in process");
            await biometrics.setPin(pinCode);
            console.log("Pin was set in process");
            Alert.alert(null, "You have successfully set your pin.", [
                {
                    title: "Ok",
                    onPress: async () => {
                        if (this.state.type) {
                            this.props.navigation.navigate('BiometricsEnrollment');
                        } else {
                            this.props.navigation.navigate('Main');
                        }
                    },
                },
            ]);
        }
    }



    render() {
        return (
            <View style={{ ...styles.container, backgroundColor: 'white'}}>
                <PINCode
                    status={'choose'}
                    finishProcess={this._finishProcess}
                    touchIDDisabled={true}
                    textButtonLockedPage="Use password"
                    delayBetweenAttempts={this.state.delayBetweenAttempts}
                    pinCodeKeychainName={'PINCode_service'}

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
                />

            </View >
        );
    }
}

const localStyles = StyleSheet.create({
    stylePinCodeButtonCircle: {
        borderColor: 'rgb(240, 240, 240)', 
        borderWidth: 1, 
        backgroundColor: 'transparent'
    }
});

export default withReduxStore(SetPinCode);
