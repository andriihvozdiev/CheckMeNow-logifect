import React, { Component } from 'react';
import { View, Text, Button } from 'native-base';
import { styles } from '../registration/styles';
import withReduxStore from '../../utils/withReduxStore';
import { Alert } from 'react-native';
import Consents from '../../constants/consents';

class AccessHealthDataConsent extends Component {
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

    arePersonalDetailsReady = () => {
        return this.props.user.firstName &&
            this.props.user.lastName &&
            this.props.user.dateOfBirth
    }

    addContestIfNotExist = () => {
        /*let consents = null;
        console.log("this.props.user.consents")
        console.log(this.props.user.consents)
        if (this.props.user.consents && this.props.user.consents.length > 0) {
            consents = this.props.user.consents;
        } else {
            consents = [];
        }

        consents.push({
            description: 'Access health records to issue vaccine certificate',
            status: 'YES',
        });

        this.props.updateUser({
            consents: consents
        });*/
        const consents = this.props.user.consents || [];
        console.log("consents")
        console.log(consents)
        if (consents.filter(item => item.description === Consents.ACCESS_HEALTH_RECORDS).length > 0)
            consents.filter(item =>
                item.description === Consents.ACCESS_HEALTH_RECORDS)[0].status = 'YES';
        else
            consents.push({
                description: 'Access health records to issue vaccine certificate',
                status: 'YES'
            })
        this.props.updateUser({
            consents: consents
        })

        this.props.navigation.navigate(this.arePersonalDetailsReady() ?
            'LinkToGP' :
            'PersonalDetailsForLinkage')
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.upperSection}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.h3}>Data access consent</Text>
                    </View>
                    <View style={{ flex: 2 }}>
                        <Text style={styles.defaultText}>
                            We need your consent in order to get access to your electronic health records where SARS-CoV-2 vaccination data is located in order to issue to you the vaccine certificate. We will access the health data only for this purpose.
                        </Text>
                    </View>
                    <View style={{ flex: 2, }}>
                        <Text style={styles.defaultText}>
                            Do you give us the consent to access the electronic health records for this specific purpose?
                        </Text>
                    </View>
                </View>
                <View style={styles.bottomSection}>
                    <Button
                        primary
                        onPress={() => this.addContestIfNotExist()}
                        style={styles.button}>
                        <Text style={styles.buttonTextSize}>Yes</Text>
                    </Button>

                    <Text
                        style={styles.noThanks}
                        onPress={() => {
                            Alert.alert(
                                'No consent',
                                'In case you will change your mind and you would like to use an vaccine certificate, you can start again.',
                                [
                                    {
                                        text: 'OK',
                                        onPress: () => this.props.navigation.navigate('Main')
                                    },

                                ]);

                        }}>
                        No
                </Text>
                </View>
            </View >
        );
    }
}
export default withReduxStore(AccessHealthDataConsent);