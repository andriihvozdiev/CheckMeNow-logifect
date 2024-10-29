import React, { Component } from 'react';
import { View, Text, Button } from 'native-base';
import { styles } from '../registration/styles';
import withReduxStore from '../../utils/withReduxStore';

class ImmunityPassDescription extends Component {
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
                <View style={styles.upperSection}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.h3}>Vaccine certificate generation</Text>
                    </View>
                    <View style={{ flex: 3 }}>
                        <Text style={styles.defaultText}>
                            We are about to issue you the vaccine certificate
                            that will prove that you have received the SARS-CoV-2
                            vaccination and you are likely to be immune against
                            SARS-CoV-2. In order to issue the vaccine certificate we will
                            need to take your photo that will be associated with the
                            vaccine certificate.
                    </Text>
                    </View>
                </View>
                <View style={styles.bottomSection}>
                    <Button
                        primary
                        onPress={() => this.props.navigation.navigate('TakeSelfiePhoto')}
                        style={styles.button}>
                        <Text style={styles.buttonTextSize}>Continue</Text>
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
export default withReduxStore(ImmunityPassDescription);