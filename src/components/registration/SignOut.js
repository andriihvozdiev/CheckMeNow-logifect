/*
 *   Copyright (c) 2020 Grigore Crudu
 *   All rights reserved.
 */

import React, {Component} from 'react';
import {StyleSheet, Alert} from 'react-native';
import {View, Text, Button, Input, Item} from 'native-base';
import {vw, vh, vmin, vmax} from 'react-native-expo-viewport-units';
import {isCodeValid} from '../../utils/validation';
import {Auth} from 'aws-amplify';
import { connect } from 'react-redux';
import { updateUser } from '../../store/actions';

class SignOut extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
    };
    this.props.updateUser({sessionState: 'signOut'})
  }

  inputConfirmCodeHandler = (value) => {
    this.setState({
      code: value,
    });
  }

  checkSignOutHandler = async () => {
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>You will now sign out from the application</Text>
        <Button style={{marginTop: '10%'}}
          onPress={this.checkSignOutHandler}>
          <Text>Continue</Text>
        </Button>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = (dispatch) => {
  // Action
  return {
    // update user
    updateUser: (user) => dispatch(updateUser(user)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignOut)

const styles = StyleSheet.create({
  container: {
    paddingTop: vh(5),
    paddingLeft: vw(4),
    paddingRight: vw(4),
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    textAlign: 'center'
  },
  input: {
    width: '90%',
    marginTop: '30%',
  },
  button: {
    backgroundColor: '#136AC7',
    borderRadius: 5,
    padding: 10,
    justifyContent: 'center',
    marginTop: '40%',
    width: '90%',
  },
  buttonDisabled: {
    backgroundColor: '#999',
    borderRadius: 5,
    padding: 10,
    justifyContent: 'center',
    marginTop: '20%',
    width: '90%',
  },
});
