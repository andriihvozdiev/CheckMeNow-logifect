import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Text, View } from 'native-base';
import { styles } from '../registration/styles';
import withReduxStore from '../../utils/withReduxStore';
import ListOfConsents from '../../constants/consents';
import { vh } from 'react-native-expo-viewport-units';

class Consents extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount = () => {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.props.updateNavigation({ profileHeaderShown: true });
        });

    };

    componentWillUnmount = () => {
        this.unsubscribe();
    };

    onRadioBtnClick = (consentDescription, status) => {
        const consents = this.props.user.consents || [];
        console.log("consents")
        console.log(consents)
        if (consents.filter(item => item.description === consentDescription).length > 0)
            consents.filter(item =>
                item.description === consentDescription)[0].status = status;
        else
            consents.push({
                description: consentDescription,
                status: status
            })
        this.props.updateUser({
            consents: consents
        })
    };

    radioButtons = consentDescription => {
        return (
            this.props.user.consents && this.props.user.consents.filter(item =>
                item.description === consentDescription).length > 0 && this.props.user.consents.filter(item =>
                    item.description === consentDescription)[0].status === 'YES' ?
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <View style={localStyles.radioButtonContainer}>
                        <TouchableOpacity onPress={() => this.onRadioBtnClick(consentDescription, 'YES')} style={localStyles.radioButton}>
                            <View style={localStyles.radioButtonIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.onRadioBtnClick(consentDescription, 'YES')}>
                            <Text style={localStyles.radioButtonText}>Yes</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={localStyles.radioButtonContainer}>
                        <TouchableOpacity onPress={() => this.onRadioBtnClick(consentDescription, 'NO')} style={localStyles.radioButton} />
                        <TouchableOpacity onPress={() => this.onRadioBtnClick(consentDescription, 'NO')}>
                            <Text style={localStyles.radioButtonText}>No</Text>
                        </TouchableOpacity>
                    </View>
                </View> :
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <View style={localStyles.radioButtonContainer}>
                        <TouchableOpacity onPress={() => this.onRadioBtnClick(consentDescription, 'YES')} style={localStyles.radioButton} />
                        <TouchableOpacity onPress={() => this.onRadioBtnClick(consentDescription, 'YES')}>
                            <Text style={localStyles.radioButtonText}>Yes</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={localStyles.radioButtonContainer}>
                        <TouchableOpacity onPress={() => this.onRadioBtnClick(consentDescription, 'NO')} style={localStyles.radioButton} >
                            <View style={localStyles.radioButtonIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.onRadioBtnClick(consentDescription, 'NO')}>
                            <Text style={localStyles.radioButtonText}>No</Text>
                        </TouchableOpacity>

                    </View>
                </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.upperSection}>
                    <View style={{ marginBottom: '15%' }}>
                        <Text style={styles.h3}>My Consents</Text>
                    </View>


                    {Object.entries(ListOfConsents).map((consent) => (
                        <View style={{ marginTop: 30, paddingHorizontal: vh(3) }} key={consent[1]}>
                            <View><Text style={styles.defaultText}>{consent[1]}</Text></View>
                            <View style={localStyles.statusContainer}>
                                {this.radioButtons(consent[1])}
                            </View>
                        </View>
                    ))}
                </View>
                <View style={styles.bottomSection}>
                    <Button
                        primary
                        onPress={() => this.props.navigation.navigate('Main')}
                        style={styles.button}>
                        <Text style={styles.buttonTextSize}>Close</Text>
                    </Button>
                </View>
            </View>
        );
    }
}

const localStyles = StyleSheet.create({

    statusContainer: {
        flexDirection: 'row',
        //width: '50%'
    },
    radioButtonContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 45,

    },
    radioButton: {
        height: 20,
        width: 20,
        backgroundColor: "#F8F8F8",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#E6E6E6",
        alignItems: "center",
        justifyContent: "center"
    },
    radioButtonIcon: {
        height: 14,
        width: 14,
        borderRadius: 7,
        backgroundColor: "purple"
    },
    radioButtonText: {
        fontSize: 20,
        marginLeft: 16
    }
})


export default withReduxStore(Consents);
