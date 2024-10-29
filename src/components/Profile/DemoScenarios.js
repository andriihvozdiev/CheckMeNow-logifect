import React, { Component } from 'react';
import { List, ListItem, Text, Left, Right, Content } from 'native-base';
import { View, Platform } from 'react-native';
import { styles } from '../registration/styles';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import { TouchableOpacity } from 'react-native-gesture-handler';
import { vh } from 'react-native-expo-viewport-units';
import Colors from '../../constants/colors';
import withReduxStore from '../../utils/withReduxStore';
import UserStatus from '../../constants/userStatus';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import moment from 'moment';
import pushNotification from '../../utils/pushNotification';

class DemoScenarios extends Component {
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

  sendNotification = (userStatus) => {
    let title = "Information";
    let body = "Checkmenow has new information for you"
    if (userStatus == UserStatus.VACCINATION_CONFIRMED) {
      body = "Good news! We have received your vaccination codes from NHS.";
    }

    if (userStatus == UserStatus.IMMUNITY_CONFIRMED) {
      body = "Good news! We can confirm now that you are immune against SARS-CoV-2."
    }

    let fireDate = moment();
    fireDate.add(5, "s");
    const request = {
      id: userStatus,
      title: title,
      body: body,
      badge: 1,
      userInfo: {
        userStatus: userStatus
      }
    }
    //pushNotification.addNotificationRequest(request);
  }

  render() {
    return (
      <View
        style={{ ...styles.container, alignItems: 'center', paddingTop: vh(2) }}>
        <View style={styles.logoUser}>
          <EvilIcons name="user" size={60} />
        </View>
        <View style={{ marginTop: '3%' }}>
          <Text style={styles.h3}>Hi {this.props.user.firstName}</Text>
        </View>
        <View style={{ maxWidth: '70%', marginTop: '3%' }}>
          <Text style={{ ...styles.defaultText, textAlign: 'center' }}>
            Use this screen to change user status.
          </Text>
        </View>
        <View style={styles.settingsProfile}>
          <List>
            <TouchableOpacity
              onPress={() => {
                this.props.updateUser({
                  userStatus: UserStatus.UNVERIFIED,
                  vaccinationDate: null,
                  vaccinationCenter: null
                });
                this.props.navigation.navigate('Home');
              }}>
              <View>
                <ListItem
                  style={
                    ({
                      borderTopWidth: 0.8,
                      borderTopColor: Colors.borderColor,
                      height: 60,
                    },
                      this.props.user.userStatus === UserStatus.UNVERIFIED
                        ? { backgroundColor: 'lightblue' }
                        : null)
                  }>
                  <Left>
                    <Text style={styles.defaultText}>Unverified</Text>
                  </Left>
                  <Right>
                    <SimpleLineIcons name="arrow-right" size={18} />
                  </Right>
                </ListItem>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                this.props.updateUser({
                  userStatus: UserStatus.NO_NHS_LINKAGE,
                  vaccinationDate: null,
                  vaccinationCenter: null
                });
                this.props.navigation.navigate('Home');
              }}>
              <View>
                <ListItem
                  style={
                    ({
                      borderTopWidth: 0.8,
                      borderTopColor: Colors.borderColor,
                      height: 60,
                    },
                      this.props.user.userStatus === UserStatus.NO_NHS_LINKAGE
                        ? { backgroundColor: 'lightblue' }
                        : null)
                  }>
                  <Left>
                    <Text style={styles.defaultText}>NO_NHS_LINKAGE</Text>
                  </Left>
                  <Right>
                    <SimpleLineIcons name="arrow-right" size={18} />
                  </Right>
                </ListItem>
              </View>
            </TouchableOpacity>



            {/* <TouchableOpacity
              onPress={() => {
                this.sendNotification(UserStatus.INITIAL);
                this.props.updateUser({ userStatus: UserStatus.INITIAL,
                  vaccinationDate: null,
                  vaccinationCenter: null  });
                this.props.cleanMessagesFromStore();
                this.props.navigation.navigate('Home');
              }}>
              <View>
                <ListItem
                  style={
                    ({
                      borderTopWidth: 0.8,
                      borderTopColor: Colors.borderColor,
                      height: 60,
                    },
                      this.props.user.userStatus === UserStatus.INITIAL
                        ? { backgroundColor: 'lightblue' }
                        : null)
                  }>
                  <Left>
                    <Text style={styles.defaultText}>Initial Status</Text>
                  </Left>
                  <Right>
                    <SimpleLineIcons name="arrow-right" size={18} />
                  </Right>
                </ListItem>
              </View>
            </TouchableOpacity> */}

            <TouchableOpacity
              onPress={() => {
                this.sendNotification(UserStatus.AWAITING_VACCINATION);
                this.props.updateUser({
                  userStatus: UserStatus.AWAITING_VACCINATION,
                  vaccinationDate: null,
                  vaccinationCenter: null
                });
                this.props.cleanMessagesFromStore();
                this.props.navigation.navigate('Home');
              }}>
              <View>
                <ListItem
                  style={
                    ({ height: 60 },
                      this.props.user.userStatus ===
                        UserStatus.AWAITING_VACCINATION
                        ? { backgroundColor: 'lightblue' }
                        : null)
                  }>
                  <Left>
                    <Text style={styles.defaultText}>Awaiting Vaccination</Text>
                  </Left>
                  <Right>
                    <SimpleLineIcons name="arrow-right" size={18} />
                  </Right>
                </ListItem>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                this.props.updateUser({
                  userStatus: UserStatus.FIRST_DOSE_CONFIRMED,
                  vaccinationDate: null,
                  vaccinationCenter: null
                });
                this.props.navigation.navigate('Home');
              }}>
              <View>
                <ListItem
                  style={
                    ({
                      borderTopWidth: 0.8,
                      borderTopColor: Colors.borderColor,
                      height: 60,
                    },
                      this.props.user.userStatus === UserStatus.FIRST_DOSE_CONFIRMED
                        ? { backgroundColor: 'lightblue' }
                        : null)
                  }>
                  <Left>
                    <Text style={styles.defaultText}>FIRST_DOSE_CONFIRMED</Text>
                  </Left>
                  <Right>
                    <SimpleLineIcons name="arrow-right" size={18} />
                  </Right>
                </ListItem>
              </View>
            </TouchableOpacity>


            <TouchableOpacity
              onPress={() => {
                this.sendNotification(UserStatus.VACCINATION_CONFIRMED);
                this.props.updateUser({
                  userStatus: UserStatus.VACCINATION_CONFIRMED,
                  vaccinationDate: null,
                  vaccinationCenter: null
                });
                this.props.cleanMessagesFromStore();
                this.props.navigation.navigate('Home');
              }}>
              <View>
                <ListItem
                  style={
                    ({ height: 60 },
                      this.props.user.userStatus ===
                        UserStatus.VACCINATION_CONFIRMED
                        ? { backgroundColor: 'lightblue' }
                        : null)
                  }>
                  <Left>
                    <Text style={styles.defaultText}>
                      Vaccination Confirmed
                    </Text>
                  </Left>
                  <Right>
                    <SimpleLineIcons name="arrow-right" size={18} />
                  </Right>
                </ListItem>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                this.sendNotification(UserStatus.IMMUNITY_CONFIRMED);
                this.props.updateUser({
                  userStatus: UserStatus.IMMUNITY_CONFIRMED,
                  vaccinationDate: null,
                  vaccinationCenter: null
                });
                this.props.cleanMessagesFromStore();
                this.props.navigation.navigate('Home');
              }}>
              <View>
                <ListItem
                  style={
                    ({ height: 60 },
                      this.props.user.userStatus === UserStatus.IMMUNITY_CONFIRMED
                        ? { backgroundColor: 'lightblue' }
                        : null)
                  }>
                  <Left>
                    <Text style={styles.defaultText}>Immunity Confirmed</Text>
                  </Left>
                  <Right>
                    <SimpleLineIcons name="arrow-right" size={18} />
                  </Right>
                </ListItem>
              </View>
            </TouchableOpacity>
          </List>
        </View>
      </View>
    );
  }
}

export default withReduxStore(DemoScenarios);
