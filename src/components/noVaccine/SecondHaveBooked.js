import React, { Component } from 'react';
import { View, Text, Button } from 'native-base';
import { styles } from '../registration/styles';
import withReduxStore from '../../utils/withReduxStore';

class SecondHaveBooked extends Component {
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
                    <Text style={{ ...styles.h3, fontWeight: '500' }}>Done</Text>
                </View>
                <View style={{ flex: 1, marginTop: '20%', alignItems: 'center', marginHorizontal: 15 }}>
                    <Text style={styles.defaultText}>
                        You have successfully booked the appointment to receive the second dose.
                    </Text>
                </View>
                <View style={styles.bottomSection}>
                    <Button
                        primary
                        onPress={() => this.props.navigation.navigate('Main')}
                        block>
                        <Text>OK</Text>
                    </Button>

                </View>
            </View>
        );
    }
}

export default withReduxStore(SecondHaveBooked);
