import React, { Component } from 'react';
import { View, Text, Button } from 'native-base';
import { styles } from '../registration/styles';
import withReduxStore from '../../utils/withReduxStore';
import { Alert } from 'react-native';

class VaccinationDateExplanation extends Component {
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
                    <Text style={styles.h3}>Vaccination Data</Text>
                </View>
                <View style={{ flex: 2 }}>
                    <Text style={{ ...styles.defaultText, padding: 20 }}>
                        In order to get access to your electronic health records
                        where SARS-CoV-2 vaccination data is located, you will need to call the GP
                        surgery and ask to provide you the Linkage Key and the Account ID. They
                        will send it to you either as a letter or an email message.
                    </Text>
                </View>
                <View style={{ flex: 1, padding: 10, marginTop: '15%' }}>
                    <Text style={{ ...styles.defaultText }}>
                        Have you received the Linkage Key and the Account ID
                        from the GP surgery?
                    </Text>
                </View>
                <View style={styles.bottomSection}>
                    <Button
                        primary
                        onPress={() => this.props.navigation.navigate('InputLinkageKey')}
                        block>
                        <Text style={styles.defaultText}>Yes</Text>
                    </Button>

                    <Text
                        style={styles.noThanks}
                        onPress={() => {
                            Alert.alert(
                                'No Linkage Key yet',
                                'Please start again when you receive the Linkage Key and the Account ID from the GP surgery.',
                                [
                                    {
                                        text: 'OK',
                                        onPress: () => this.props.navigation.navigate('Main')
                                    },

                                ]);

                        }}>
                        Not yet
                </Text>
                </View>
            </View>
        );
    }
}
export default withReduxStore(VaccinationDateExplanation);