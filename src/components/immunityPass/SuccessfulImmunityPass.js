import React, { Component } from 'react';
import { View, Text, Button } from 'native-base';
import { styles } from '../registration/styles';
import withReduxStore from '../../utils/withReduxStore';
import QRCodeChat from '../Chat/QRCodeChat';

class SuccessfulImmunityPass extends Component {
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
                    <View style={{ marginBottom: '20%' }}>
                        <Text style={styles.h3}>Vaccine certificate</Text>
                    </View>
                    <View>
                        <Text style={styles.defaultText}>
                            We have generated the vaccine certificate.
                            You will be able to present it for scanning
                            to prove that you have received the SARS-CoV-2 vaccine.
                    </Text>
                    </View>
                    <View style={{ flex: 1, }}>
                        <QRCodeChat />
                    </View>
                </View>
                <View style={styles.bottomSection}>
                    <Button
                        style={styles.button}
                        onPress={() => {
                            this.props.updateUser({ isQrCodeReady: true })
                            this.props.navigation.navigate('Main')
                        }}>
                        <Text style={styles.defaultText}>OK</Text>
                    </Button>
                </View>
            </View>
        );
    }
}
export default withReduxStore(SuccessfulImmunityPass);