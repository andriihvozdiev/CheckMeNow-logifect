import React, { Component } from 'react';
import { View, Text, Button } from 'native-base';
import { styles } from '../registration/styles';
import withReduxStore from '../../utils/withReduxStore';
import Consents from '../../constants/consents';

class InformationScreen extends Component {
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

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.upperSection}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.h3}>Enter your vaccination details to generate a QR code</Text>
                    </View>
                    <View style={{ flex: 2 }}>
                        <Text style={styles.defaultText}>
                            After verifying it's you and confirming your registered GP surgery, we will be able to retrieve
                            your vaccination details and generate a recognisable digital vaccine certificate.
                        </Text>
                        <Text style={styles.defaultText}>
                            The vaccine certificate QR code can be scanned by participating venues to allow entry.
                    </Text>
                    </View>
                </View>
                <View style={styles.bottomSection}>
                    <Button
                        primary
                        onPress={() => {
                            if (this.props.user.consents && this.props.user.consents.length > 0) {
                                console.log("this.props.user.consents")
                                console.log(this.props.user.consents)
                                const alreadyExist = this.props.user.consents.filter(item =>
                                    item.description === Consents.ACCESS_HEALTH_RECORDS);
                                console.log("alreadyExist")
                                console.log(alreadyExist)
                                if (alreadyExist.length > 0 && alreadyExist[0].status === 'YES')
                                    this.props.navigation.navigate(this.arePersonalDetailsReady() ?
                                        'LinkToGP' :
                                        'PersonalDetailsForLinkage')
                                else this.props.navigation.navigate('AccessHealthDataConsent');
                            } else
                                this.props.navigation.navigate('AccessHealthDataConsent')
                        }
                        }
                        style={styles.button}>
                        <Text style={styles.buttonTextSize}>Continue</Text>
                    </Button>

                    <Text
                        style={styles.noThanks}
                        onPress={() => this.props.navigation.navigate('Main')}>
                        Not now
                    </Text>
                </View>
            </View>
        );
    }
}
export default withReduxStore(InformationScreen);