import React, { Component } from 'react';
import { Text, Button } from 'native-base';
import { View, Alert } from 'react-native';
import { styles } from '../registration/styles';
import withReduxStore from '../../utils/withReduxStore';
import userDA from '../../da/user';
import { Auth } from 'aws-amplify';
import biometrics from '../../utils/biometrics';

class AccountCancelation extends Component {
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

  deleteAccountHandler = () => {
    Alert.alert(
      'Account cancellation',
      'Are you sure you want to delete the account?',
      [
        {
          text: 'Yes',
          onPress: async () => {
            const user = await userDA.getByEmail(this.props.user.email);
            console.log(user);

            await biometrics.resetBiometrics();
            await biometrics.resetBiometricsTemp();
            await biometrics.resetPin();

            const userResult = await userDA.delete({
              id: user.id,
              expectedVersion: user.version,
            });
            console.log('userResult');
            console.log(userResult);
            const currentUser = await Auth.currentAuthenticatedUser();
            currentUser.deleteUser((error) => {
              if (error) {
                console.log(error);
              }
            });
            Auth.signOut().then(() => {
              this.props.deleteUser();
              console.log(this.props.user.sessionState);
            });
          },
        },

        {
          text: 'No',
          //onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
    );
  };

  render() {
    return (
      <View
        style={styles.container}>
        <View style={styles.upperSection}>
          <View style={{ marginTop: '3%' }}>
            <Text style={styles.h3}>Account cancellation</Text>
          </View>
          <View style={{ marginTop: '10%' }}>
            <Text style={{ ...styles.defaultText, textAlign: 'center' }}>
              According to data privacy terms, you are able to delete the account.
              All your personal data will be deleted from our system. If you wish
              to delete the account click on Delete account button below.
          </Text>
          </View>
        </View>
        <View style={styles.bottomSection}>
          <Button onPress={this.deleteAccountHandler} style={styles.button}>
            <Text style={styles.buttonTextSize}>Delete account</Text>
          </Button>
        </View>
      </View>
    );
  }
}

export default withReduxStore(AccountCancelation);
