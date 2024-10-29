import React, { Component } from 'react';
import { View, Text, Button } from 'native-base';
import { styles } from '../registration/styles';
import withReduxStore from '../../utils/withReduxStore';
import { vh } from 'react-native-expo-viewport-units';
import moment from 'moment'

class NotYetImmune extends Component {
    constructor(props) {
        super(props);

    }
    state = {
        immunityStatus: this.props.route.params.nrDaysFromLastVaccination > 7,
        nrDaysFromLastVaccination: this.props.route.params.nrDaysFromLastVaccination
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
                <View style={styles.upperSection}>
                    <View>
                        <Text style={styles.h3}>Immunity status</Text>
                    </View>
                    <View>
                        {this.props.route.params.nrDaysFromLastVaccination > 7 ?
                            <Text style={{ ...styles.defaultText, marginTop: vh(4) }}>
                                You have received both dose of vaccine. 7 days passed after the vaccination
                                and your body has generated an immune response.
                            </Text> :
                            <Text style={{ ...styles.defaultText, marginTop: vh(4) }}>
                                You have received both dose of vaccine but {7 - this.state.nrDaysFromLastVaccination} more days need to pass after
                                vaccination for the body to generate an immune response.
                            </Text>

                        }
                    </View>

                    <View>
                        {!this.state.immunityStatus ?
                            <Text style={{ ...styles.defaultText, marginTop: vh(6) }}>
                                Days after we can issue vaccine certificate.
                            </Text> :
                            <Text style={{ ...styles.defaultText, marginTop: vh(6) }}>
                                We can generate you a vaccine certificate.
                            </Text>}
                    </View>
                    {!this.state.immunityStatus ?
                        <View style={{ width: '100%', height: vh(20), alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: vh(15) }}>{7 - this.state.nrDaysFromLastVaccination}</Text>
                        </View> : null}

                </View>
                <View style={styles.bottomSection}>
                    <Button
                        primary
                        onPress={() => {
                            this.state.immunityStatus ?
                                this.props.navigation.navigate('WizardImmunityPass') :
                                this.props.navigation.navigate('Main')
                        }}
                        style={styles.button}>
                        <Text style={styles.buttonTextSize}>Continue</Text>
                    </Button>
                </View>
            </View>
        );
    }
}
export default withReduxStore(NotYetImmune);