import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, Button } from 'native-base';
import { styles } from '../registration/styles';
import withReduxStore from '../../utils/withReduxStore';

class SecondDoseExplanation extends Component {
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
                    <Text style={styles.h3}>Second vaccine dose</Text>
                </View>
                <View style={{ flex: 2 }}>
                    <Text style={{ ...styles.defaultText, marginHorizontal: 10 }}>
                        You have received first dose of the vaccine. You will needed
                        to book another appointment to receive the second dose.
                    </Text>
                </View>
                <View style={styles.bottomSection}>
                    <Button
                        primary
                        onPress={() => this.props.navigation.navigate('SecondVaccinationAppointment')}
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
export default withReduxStore(SecondDoseExplanation);
