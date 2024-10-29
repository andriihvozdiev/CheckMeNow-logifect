import React, { Component } from 'react';
import { List, ListItem, Text, Left, Right } from 'native-base';
import { View, ScrollView, Alert } from 'react-native';
import { styles } from '../registration/styles';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import { TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../../constants/colors';
import withReduxStore from '../../utils/withReduxStore';
import { Auth } from 'aws-amplify';
import biometrics from '../../utils/biometrics';

class Profile extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.props.updateNavigation({ profileHeaderShown: false });
    });
  };

  componentWillUnmount = () => {
    this.unsubscribe();
  };

  render() {
    return (
      <ScrollView
        style={styles.upperSection}>
        <View style={styles.logoUser}>
          <EvilIcons name="user" size={60} />
        </View>
        <View style={{ marginTop: '3%' }}>
          <Text style={styles.h3}>Hi {this.props.user.firstName}</Text>
        </View>
        <View style={{ width: '100%', marginTop: '3%', justifyContent: 'center' }}>
          <Text style={{ ...styles.profileText, textAlign: 'center' }}>
            Use this screen to change the application settings.
          </Text>
        </View>
        <View style={{ ...styles.settingsProfile, paddingBottom: 50 }}>
          <List >
            <TouchableOpacity
              onPress={() => this.props.navigation.push('WizardMyDetails')}>
              <View>
                <ListItem
                  style={{
                    borderTopWidth: 0.8,
                    borderTopColor: Colors.borderColor,
                    height: 60,
                  }}>
                  <Left>
                    <Text style={styles.profileText}>My Details</Text>
                  </Left>
                  <Right>
                    <SimpleLineIcons name="arrow-right" size={18} />
                  </Right>
                </ListItem>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.props.navigation.push('WizardConsents')}>
              <View>
                <ListItem
                  style={{ height: 60 }}>
                  <Left>
                    <Text style={styles.profileText}>My Consents</Text>
                  </Left>
                  <Right>
                    <SimpleLineIcons name="arrow-right" size={18} />
                  </Right>
                </ListItem>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.props.navigation.push('WizardResetPassword')}>
              <View>
                <ListItem style={{ height: 60 }}>
                  <Left>
                    <Text style={styles.profileText}>Reset password / PIN</Text>
                  </Left>
                  <Right>
                    <SimpleLineIcons name="arrow-right" size={18} />
                  </Right>
                </ListItem>
              </View>
            </TouchableOpacity>

            {
              __DEV__ ?
                <TouchableOpacity
                  onPress={() => this.props.navigation.push('WizardDemoScenarios')}>
                  <View>
                    <ListItem style={{ height: 60 }}>
                      <Left>
                        <Text style={styles.profileText}>Demo Scenarios</Text>
                      </Left>
                      <Right>
                        <SimpleLineIcons name="arrow-right" size={18} />
                      </Right>
                    </ListItem>
                  </View>
                </TouchableOpacity> : null
            }

            {/*<TouchableOpacity>
              <View>
                <ListItem style={{ height: 60 }}>
                  <Left>
                    <Text style={styles.defaultText}>App settings</Text>
                  </Left>
                  <Right>
                    <SimpleLineIcons name="arrow-right" size={18} />
                  </Right>
                </ListItem>
              </View>
            </TouchableOpacity>*/}

            <TouchableOpacity
              onPress={() =>
                this.props.navigation.push('WizardTermsAndConditions')
              }>
              <View>
                <ListItem style={{ height: 60 }}>
                  <Left>
                    <Text style={styles.profileText}>Terms and Conditions</Text>
                  </Left>
                  <Right>
                    <SimpleLineIcons name="arrow-right" size={18} />
                  </Right>
                </ListItem>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.props.navigation.push('WizardAccountCancelation')}>
              <View>
                <ListItem style={{ height: 60 }}>
                  <Left>
                    <Text style={styles.profileText}>Account cancellation</Text>
                  </Left>
                  <Right>
                    <SimpleLineIcons name="arrow-right" size={18} />
                  </Right>
                </ListItem>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={async () => {
                Alert.alert(
                  'Log out',
                  'Are you sure you want to log out?',
                  [
                    {
                      text: 'Yes',
                      onPress: async () => {
                        Auth.signOut();
                        //await biometrics.resetBiometrics();
                        //await biometrics.resetBiometricsTemp();
                        //await biometrics.resetPin();
                        //this.props.updateUser({ sessionState: 'signOut' });
                        this.props.deleteUser();
                      }
                    },

                    {
                      text: 'No',
                      style: 'cancel',
                    },
                  ],
                );
              }}>
              <View>
                <ListItem style={{ height: 60, borderBottomWidth: 0 }}>
                  <Left>
                    <Text style={styles.profileText}>Log out</Text>
                  </Left>
                  <Right>
                    <SimpleLineIcons name="arrow-right" size={18} />
                  </Right>
                </ListItem>
              </View>
            </TouchableOpacity>
          </List>
        </View>
      </ScrollView>
    );
  }
}

export default withReduxStore(Profile);
