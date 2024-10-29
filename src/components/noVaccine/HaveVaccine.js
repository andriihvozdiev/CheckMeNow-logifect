import React, { Component } from 'react';
import { View, Text, Button } from 'native-base';
import { styles } from '../registration/styles';
import withReduxStore from '../../utils/withReduxStore';

class HaveVaccine extends Component {
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
                <View>
                    <Text style={styles.h3}>SARS-CoV-2 Vaccine</Text>
                </View>
                <View style={{ flex: 1, marginTop: '20%', alignItems: 'center' }}>
                    <Text style={{ ...styles.defaultText, }}>
                        Have you received SARS-CoV-2 vaccine?
                    </Text>
                </View>
                <View style={styles.bottomSection}>
                    <View style={{ justifyContent: 'space-around' }}>
                        <Button
                            primary
                            onPress={() => this.props.navigation.push('IdentityNavigation')}
                            block>
                            <Text style={styles.defaultText}>Yes</Text>
                        </Button>
                        <Text
                            style={styles.noThanks}
                            onPress={() => this.props.navigation.navigate('SelectVaccinationCenter')}>
                            No
                        </Text>
                    </View>
                </View>
            </View>
        );
    }
};

export default withReduxStore(HaveVaccine);
