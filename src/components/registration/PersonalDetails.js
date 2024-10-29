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
import { styles } from './styles';
import { ActionMessage, ErrorMessage } from '../../utils/component_utils';
import { isNameValid } from '../../utils/validation';
import { connect } from 'react-redux';
import { updateUser } from '../../store/actions';
import Colors from '../../constants/colors';
import { Platform } from 'react-native';
import moment from 'moment';

class PersonalDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: this.props.user.firstName || '',
      lastName: this.props.user.lastName || '',
      dateOfBirth: moment(this.props.user.dateOfBirth).toDate() || new Date(),
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
    if (!moment(this.state.dateOfBirth).isValid()) {
      alert('Please, select birthday date');
      return;
    }
    if (!isNameValid(this.state.firstName) || !isNameValid(this.state.lastName))
      return;
    else {
      this.props.updateUser({
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        dateOfBirth: this.state.dateOfBirth,
      });
      console.log(this.props.user.email);
      this.props.navigation.push('TypeOfDocument');
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
          <View>
            <Text style={styles.h3} onLayout={this.handleTextLayout}>
              Personal details
          </Text>
          </View>
          <View style={{ marginTop: '10%' }}>
            <Item>
              <Input
                placeholder="Legal first name..."
                onChangeText={this.setFirstName}
                returnKeyType="done"
                value={this.state.firstName}
              />
            </Item>

            <ErrorMessage style={styles.smallText}
              show={this.state.validation && !isNameValid(this.state.firstName)}>
              Legal first name is not valid
          </ErrorMessage>

            <Item>
              <Input
                placeholder="Legal last name..."
                value={this.state.lastName}
                returnKeyType="done"
                onChangeText={this.setlastName}
              />
            </Item>

            <ErrorMessage style={styles.smallText}
              show={this.state.validation && !isNameValid(this.state.lastName)}>
              Legal last name is not valid
            </ErrorMessage>
          </View>

          <View style={{ marginTop: '10%' }}>
            {Platform.OS === 'ios' ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                <Text style={{ ...styles.defaultText, fontWeight: '300', marginRight: 10 }}>Date of birth:</Text>
                <DatePicker
                  value={this.state.dateOfBirth && moment(this.state.dateOfBirth).isValid() ? moment(this.state.dateOfBirth).toDate() : new Date()}
                  minimumDate={new Date(1900, 1, 1)}
                  maximumDate={new Date()}
                  style={{ height: 50, width: '100%' }}
                  onChange={this.setDate}
                />
              </View>
            ) : (
              <View>
                <View style={{ flexDirection: 'row' }}>
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
                      ? moment(this.state.dateOfBirth).toDate() : new Date()}
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
          <Button onPress={this.checkPersonalDetailsHandler} block>
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
