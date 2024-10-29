import React, { Component } from 'react';
import { View, Text, Button } from 'native-base';
import { styles } from '../registration/styles';
import withReduxStore from '../../utils/withReduxStore';
import { TouchableOpacity, Image, Alert, Linking } from 'react-native';
import { SwipeablePanel } from '../swipeablePanel';
import { InAppBrowser } from 'react-native-inappbrowser-reborn'

class LinkToGP extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isChatActive: false,
        }
    }
    componentDidMount = () => {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.props.updateNavigation({ profileHeaderShown: true });
        });
    };

    componentWillUnmount = () => {
        this.unsubscribe();
    };

    closePanel = () => {
        this.setState({ isChatActive: false });
    }

    async openLink() {
        try {
            const url = 'https://auth.sandpit.signin.nhs.uk/authorize?scope=openid&response_type=code&client_id=CheckMeNow&redirect_uri=https%3A%2F%2Fdev.d1emhwga1idziz.amplifyapp.com%2F&state=20eadb6528f9&nonce=c203e675-a90e-46e8-99ed-20eadb6528f9'
            if (await InAppBrowser.isAvailable()) {
                const result = await InAppBrowser.open(url, {
                    // iOS Properties
                    dismissButtonStyle: 'close',
                    preferredBarTintColor: 'white',
                    preferredControlTintColor: 'blue',
                    readerMode: false,
                    animated: true,
                    modalPresentationStyle: 'fullScreen',
                    modalTransitionStyle: 'coverVertical',
                    modalEnabled: true,
                    //enableBarCollapsing: false,
                    // Android Properties
                    showTitle: false,
                    toolbarColor: 'white',
                    secondaryToolbarColor: 'black',
                    enableUrlBarHiding: true,
                    enableDefaultShare: true,
                    forceCloseOnRedirection: false,
                    hasBackButton: true,
                    // Specify full animation resource identifier(package:anim/name)
                    // or only resource name(in case of animation bundled with app).
                    animations: {
                        startEnter: 'slide_in_right',
                        startExit: 'slide_out_left',
                        endEnter: 'slide_in_left',
                        endExit: 'slide_out_right'
                    },
                    headers: {
                        'my-custom-header': 'my custom header value'
                    }
                })
                //console.log('111')
                //Alert.alert(JSON.stringify(result))
            }
            else Linking.openURL(url)
        } catch (error) {
            //console.log('222')
            Alert.alert(error.message)
        }
    }



    render() {
        return (
            <View style={styles.upperSection}>
                {__DEV__ ?
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <View>
                            <Text style={styles.h3}>Link to GP</Text>
                        </View>
                        <View style={{ marginTop: '20%', alignItems: 'center' }}>
                            <Text style={{ ...styles.defaultText, padding: 20 }}>
                                Use NHS login to connect to your GP.
                        </Text>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <TouchableOpacity activeOpacity={0.5} onPress={
                                //() => this.setState({ isChatActive: true })
                                () => this.openLink()
                            }>
                                <Image source={require('../../../assets/NHS_Original.png')} />
                            </TouchableOpacity>
                        </View>
                    </View> : null}
                <View style={styles.firstScreenContainer}>
                    <View style={{ marginTop: '10%' }}>
                        <Text style={{ ...styles.defaultText, textAlign: 'center' }}>
                            Use AccountID and Linkage Key to connect to your GP
                        </Text>
                    </View>
                    <View style={{ marginTop: '5%' }}>
                        <Button primary
                            onPress={() => this.props.navigation.navigate('InputLinkageKey')}
                            style={styles.button}>
                            <Text style={styles.buttonTextSize}>
                                Use Linkage Key</Text>
                        </Button>
                    </View>

                    <View>
                        <Text
                            style={styles.noThanks}
                            onPress={() => this.props.navigation.push('Main')}>
                            Not now
                    </Text>
                    </View>
                </View >
            </View >
        );
    }
}
export default withReduxStore(LinkToGP);