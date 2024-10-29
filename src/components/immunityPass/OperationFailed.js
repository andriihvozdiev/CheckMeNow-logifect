import React, { Component } from 'react';
import { Button, Text, View } from 'native-base';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { styles } from '../registration/styles';
import { vh, vw } from 'react-native-expo-viewport-units';
import RNExitApp from 'react-native-exit-app';

export default class OperationFailed extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    handleNotNow = () => {
        this.props.navigation.navigate('Main')
    }

    render() {
        return (

            <View style={styles.container} >
                <View style={styles.upperSection} >
                    <View style={localStyles.logoContainer}>
                        <View style={{ paddingBottom: '15%' }}>
                            <Image
                                source={require('../../../assets/bird_transparent.png')}
                                style={{
                                    height: vh(10),
                                    width: vw(40),
                                    resizeMode: 'contain',
                                }}
                            />

                        </View>
                        <Image
                            source={require('../../../assets/operation_failed.png')}
                            style={{
                                height: vh(20),
                                width: vw(40),
                                resizeMode: 'contain',
                            }}
                        />
                    </View>

                    <View style={{ alignItems: 'center', paddingTop: '10%' }} >

                        <Text style={{ fontSize: 22 }}>
                            {this.props.route.params.statusCode === '403' ?
                                `Access Denied` :
                                this.props.route.params.statusCode === '500' ?
                                    `Operation failed. Please try again later.` : null
                            }
                        </Text>

                    </View>

                </View>

                <View style={styles.bottomSection}>
                    <Button
                        primary
                        style={styles.button}
                        onPress={() => this.handleNotNow()}>
                        <Text style={styles.defaultText}>Close</Text>
                    </Button>

                </View>
            </View>

        );
    }
}

const localStyles = StyleSheet.create({
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '20%',
    },
    bottomTextContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20
    },
});


