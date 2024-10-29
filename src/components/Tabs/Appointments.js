import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import withReduxStore from '../../utils/withReduxStore';
import Colors from '../../constants/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Card, Text, View } from 'native-base';
import { styles } from '../registration/styles';
import { tabStyles } from './tabStyles';
import moment from 'moment';

class Appointments extends Component {
  state = {};

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
      <View style={{ flex: 1 }}>
        <View style={{ ...styles.container, alignItems: 'center' }}>
          <Image
            source={require('../../../assets/bird_transparent.png')}
            style={tabStyles.logoImage}
          />

          <View>
            <Text style={styles.h3}>Appointments</Text>
          </View>
          <View style={tabStyles.cardContainer}>
            {this.props.user.vaccinationDate ? (
              <Card style={tabStyles.Card}>
                <View>
                  <Text style={{ ...styles.defaultText, textAlign: 'center' }}>
                    Your vaccination appointment is on:
                  </Text>
                  <Text style={{ ...styles.defaultText, textAlign: 'center' }}>
                    {moment(this.props.user.vaccinationDate).format('DD/MM/YYYY h:mm a ')}
                  </Text>

                </View>

                <TouchableOpacity
                  style={{ flexDirection: 'row', marginTop: 10 }}
                  onPress={() => { this.props.navigation.push('WizardVaccineAppointment') }}>
                  <AntDesign
                    name="arrowright"
                    size={20}
                    color={Colors.blue}
                  />
                  <Text style={[styles.defaultText, styles.link]}> More Info</Text>
                </TouchableOpacity>
              </Card>
            ) : (
                <Card style={tabStyles.Card}>
                  <View>
                    <Text style={{ ...styles.defaultText, textAlign: 'center' }}>
                      You have no vaccination appointments
                      </Text>
                  </View>

                  <TouchableOpacity
                    style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}
                    onPress={() => { this.props.navigation.push('WizardVaccineAppointment') }}>
                    <AntDesign
                      name="arrowright"
                      size={20}
                      color={Colors.blue}
                    />
                    <Text style={[styles.defaultText, styles.link]}> Book appointment</Text>
                  </TouchableOpacity>
                </Card>
              )}
          </View>
        </View >
        <View style={tabStyles.talkToCheckie}>
          <TouchableOpacity onPress={this.props.onLargePanel} >
            <View style={tabStyles.logoTalkToCheckie}>
              <Image
                style={tabStyles.logoImageLink}
                source={require('../../../assets/bird_transparent.png')}
              />
              <Text style={{ ...styles.defaultText, marginLeft: 10 }}>Talk to Checkie</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View >
    );
  }
}

export default withReduxStore(Appointments);