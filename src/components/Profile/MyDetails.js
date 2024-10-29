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
import { isNameValid, isPostCodeValid } from '../../utils/validation';
import { connect } from 'react-redux';
import { updateUser } from '../../store/actions';
import Colors from '../../constants/colors';
import { Platform } from 'react-native';
import moment from 'moment';
import withReduxStore from '../../utils/withReduxStore';

class MyDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: this.props.user.firstName || '',
      lastName: this.props.user.lastName || '',
      dateOfBirth: this.props.user.dateOfBirth ? moment(this.props.user.dateOfBirth).toDate() : moment().add(-16, 'years').toDate(),
      postCode: this.props.user.postCode || '',
      pickerVisible: false,
      validation: false,
    };
  }

  componentDidMount = () => {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.props.updateNavigation({ profileHeaderShown: true });
    });
  };

  componentWillUnmount = () => {
    this.unsubscribe();
  };

  setfirstName = (value) => {
    this.setState({ firstName: value });
  };

  setlastName = (value) => {
    this.setState({ lastName: value });
  };

  setPostCode = (value) => {
    this.setState({ postCode: value });
  };

  setDate = (event, newDate) => {
    if (Platform.OS === 'ios') this.setState({ dateOfBirth: newDate });
    if (event.type === 'set') {
      this.setState({ dateOfBirth: newDate, pickerVisible: false });
    } else {
      this.setState({ pickerVisible: false });
    }
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
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        dateOfBirth: this.state.dateOfBirth,
      });
      this.props.navigation.navigate('Main');
    }
  };



  render() {
    return (
      <View style={styles.container}>
        <View style={styles.upperSection}>
          <View>
            <Text style={styles.h3} >
              My details
          </Text>
          </View>
          <View style={{ marginTop: '15%' }}>
            <View >
              <Item>
                <Input
                  placeholder="Legal first name..."
                  onChangeText={this.setfirstName}
                  returnKeyType="done"
                  value={this.state.firstName}
                />
              </Item>
              <ErrorMessage
                show={this.state.validation && !isNameValid(this.state.firstName)}>
                Legal first name is not valid
            </ErrorMessage>
            </View>
            <View>
              <Item>
                <Input
                  placeholder="Legal last name..."
                  value={this.state.lastName}
                  returnKeyType="done"
                  onChangeText={this.setlastName}
                />
              </Item>
              <ErrorMessage
                show={this.state.validation && !isNameValid(this.state.lastName)}>
                Legal last name is not valid
            </ErrorMessage>
            </View>
            {/*<View>
              <Item>
                <Input
                  placeholder="Post code..."
                  value={this.state.postCode}
                  returnKeyType="done"
                  onChangeText={this.setPostCode}
                />
              </Item>

              <ErrorMessage
                show={
                  this.state.validation && !isPostCodeValid(this.state.postCode)
                }>
                Post code is not valid
              </ErrorMessage>
              </View>*/}
          </View>

          <View style={{ marginTop: '5%' }}>

            {Platform.OS === 'ios' ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                <Text style={{ ...styles.defaultText, fontWeight: '300', marginRight: 10 }}>Date of birth:</Text>
                <DatePicker
                  value={this.state.dateOfBirth && moment(this.state.dateOfBirth).isValid() ? moment(this.state.dateOfBirth).toDate() : new Date()}
                  minimumDate={new Date(1900, 1, 1)}
                  maximumDate={new Date()}
                  style={{ height: 50, minWidth: '100%' }}
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
          <Button onPress={this.checkPersonalDetailsHandler} style={styles.button}>
            <Text style={styles.buttonTextSize}>Save</Text>
          </Button>
        </View>
      </View>
    );
  }
}

export default withReduxStore(MyDetails);
