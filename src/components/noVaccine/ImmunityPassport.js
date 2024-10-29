import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, Button } from 'native-base';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import Colors from '../../constants/colors';
import { styles } from '../registration/styles';
import withReduxStore from '../../utils/withReduxStore';

class ImmunityPassport extends Component {
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

    render() {
        return (
            <View style={styles.container}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.h3}>Immunity Passport</Text>
                </View>
                <View style={{ flex: 2 }}>
                    <Text style={styles.defaultText}>
                        {'    '}To prove that you are immune against SARS-CoV-2 we will
                        generate for you a digital vaccine certificate. You will not
                        have to wear face mask and follow any distancing rules
                        at venue or agglomerated place. Would you like to continue?
                    </Text>
                </View>
                <View style={styles.bottomSection}>
                    <Button
                        primary
                        onPress={() => this.props.navigation.navigate('SelectVaccinationCenter')}
                        block>
                        <Text style={styles.defaultText}>Continue</Text>
                    </Button>

                    <Text
                        style={styles.noThanks}
                        onPress={() => this.props.navigation.navigate('Main')}>
                        No thanks
                </Text>
                </View>
            </View>
        );
    }
}
export default withReduxStore(ImmunityPassport);