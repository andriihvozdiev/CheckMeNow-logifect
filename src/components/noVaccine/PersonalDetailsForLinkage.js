/*
 *   Copyright (c) 2020 Victor Crudu
 *   All rights reserved.
 */

import React, { Component } from 'react';
import {
  TextInput,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import { Container, Content, Button, Input, Item, Text, View } from 'native-base';
import DatePicker from '@react-native-community/datetimepicker';
import { styles } from '../registration/styles';
import { ActionMessage, ErrorMessage } from '../../utils/component_utils';
import { isNameValid } from '../../utils/validation';
import { connect } from 'react-redux';
import { updateUser } from '../../store/actions';
import Colors from '../../constants/colors';
import { Platform } from 'react-native';
import moment from 'moment';
import { vh } from 'react-native-expo-viewport-units';

class PersonalDetails extends Component {
  constructor(props) {
    super(props);
    console.log("this.props.user.dateOfBirth")
    console.log(this.props.user.dateOfBirth)
    this.state = {
      firstName: this.props.user.firstName || '',
      lastName: this.props.user.lastName || '',
      dateOfBirth: this.props.user.dateOfBirth ? moment(this.props.user.dateOfBirth).toDate() : moment().add(-16, 'years').toDate(),
      pickerVisible: false,
      validation: false,
    };
  }

  setFirstName = (value) => {
    this.setState({ firstName: value });
  };

  setlastName = (value) => {
    this.setState({ lastName: value });
  };

  setDate = (event, newDate) => {
    if (Platform.OS === 'ios') this.setState({ dateOfBirth: newDate });
    if (event.type === 'set') {
      this.setState({ dateOfBirth: newDate, pickerVisible: false });
    }
    console.log(this.state.dateOfBirth);
  };

  checkPersonalDetailsHandler = () => {
    this.setState({
      validation: true,
    });
    if (this.state.dateOfBirth && !moment(this.state.dateOfBirth).isValid()) {
      alert('Please, select birthday date');
      return;
    }
    if (!isNameValid(this.state.firstName) || !isNameValid(this.state.lastName))
      return;
    else {
      this.props.updateUser({
        firstName: this.state.firstName.trim(),
        lastName: this.state.lastName.trim(),
        dateOfBirth: this.state.dateOfBirth,
      });
      this.props.navigation.push('LinkToGP');
    }
  };
  handleTextLayout(evt) {
    console.log(evt.nativeEvent.layout);
    let winSize = Dimensions.get('window');
    console.log(winSize);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.upperSection}>
          <View style={{ marginBottom: 30 }}>
            <Text style={styles.h3} onLayout={this.handleTextLayout}>
              Personal details
          </Text>
          </View>
          <View style={{ marginVertical: 30 }}>
            <Text style={styles.defaultText}>
              In order to get access to your electronic health records
              where SARS-CoV-2 vaccination data is located, we will need your personal details.
          </Text>
          </View>
          <View style={{ flex: 1, }}>
            <Item>
              <Input
                placeholder="First name..."
                onChangeText={this.setFirstName}
                returnKeyType="done"
                value={this.state.firstName}
              />
            </Item>

            <ErrorMessage style={styles.smallText}
              show={this.state.validation && !isNameValid(this.state.firstName)}>
              First name is not valid
            </ErrorMessage>

            <Item>
              <Input
                placeholder="Last name..."
                value={this.state.lastName}
                returnKeyType="done"
                onChangeText={this.setlastName}
              />
            </Item>

            <ErrorMessage style={styles.smallText}
              show={this.state.validation && !isNameValid(this.state.lastName)}>
              Last name is not valid
            </ErrorMessage>
          </View>

          <View style={{ flex: 1 }}>
            {Platform.OS === 'ios' ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                <Text style={{ ...styles.defaultText, fontWeight: '300', marginRight: 10 }}>Date of birth:</Text>
                <DatePicker
                  value={this.state.dateOfBirth && moment(this.state.dateOfBirth).isValid() ? moment(this.state.dateOfBirth).toDate() : moment().add(-16, 'years').toDate()}
                  minimumDate={new Date(1900, 1, 1)}
                  maximumDate={new Date()}
                  style={{ height: 50, width: '100%' }}
                  onChange={this.setDate}
                />
              </View>
            ) : (
              <View>
                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                  <Text style={{ ...styles.defaultText, marginRight: 10, fontWeight: '500' }}>
                    Date of birth:
                  </Text>
                  <TouchableOpacity onPress={() => this.setState({ pickerVisible: true })}>
                    <Text style={styles.defaultText}>
                      {
                        this.state.dateOfBirth && moment(this.state.dateOfBirth).isValid()
                          ? moment(this.state.dateOfBirth).format('DD/MM/YYYY')
                          : '__/__/____'
                      }</Text>
                  </TouchableOpacity>
                </View>

                {this.state.pickerVisible ? (
                  <DatePicker
                    value={this.state.dateOfBirth && moment(this.state.dateOfBirth).isValid()
                      ? moment(this.state.dateOfBirth).toDate() : moment().add(-16, 'years').toDate()}
                    minimumDate={new Date(1900, 1, 1)}
                    maximumDate={new Date()}
                    onChange={this.setDate}
                  />
                ) : null}
              </View>
            )}
          </View>
        </View>

        <View style={styles.bottomSection}>
          <Button primary
            onPress={this.checkPersonalDetailsHandler}
            style={styles.button}>
            <Text style={styles.buttonTextSize}>Continue</Text>
          </Button>
          <Text
            style={styles.noThanks}
            onPress={() => this.props.navigation.push('Main')}>
            No thanks
          </Text>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  // Action
  return {
    // update user
    updateUser: (user) => dispatch(updateUser(user)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PersonalDetails);
