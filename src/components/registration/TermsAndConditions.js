/*
 *   Copyright (c) 2020 Grigore Crudu
 *   All rights reserved.
 */

import React, { Component } from 'react';
import { View, Text, Button, ListItem } from 'native-base';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import { StyleSheet, Dimensions, Alert, TouchableWithoutFeedback } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import CheckBox from '@react-native-community/checkbox';
import HTML from 'react-native-render-html';
import { styles } from './styles';

import PolicyHTML from './Policy';
import Colors from '../../constants/colors';

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

class TermsAndConditions extends Component {
  state = {
    haveRead: false,
    scrolled: false,
  };
  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={localStyles.scrollView}
          onScroll={({ nativeEvent }) => {
            if (isCloseToBottom(nativeEvent)) {
              this.setState({
                scrolled: true,
              });
            }
          }}
          showsVerticalScrollIndicator={false}>
          <HTML html={PolicyHTML} />
        </ScrollView>

        <View style={{ paddingHorizontal: vh(3), marginTop: vh(3) }}>
          <View style={{ flexDirection: 'row', marginBottom: vh(2) }}>
            <CheckBox
              style={localStyles.checkBox}
              value={this.state.haveRead}
              onValueChange={(value) => {
                this.setState({ haveRead: value });
              }}
            />
            <Text style={{fontSize: vw(4)}}
              onPress={() => {
                this.setState({ haveRead: !this.state.haveRead });
              }}>
              I have read the Terms and Conditions
            </Text>
          </View>

          <View style={{ marginTop: 10 }}>
            <TouchableWithoutFeedback
              onPress={() =>
                this.state.haveRead && !this.state.scrolled ?
                  Alert.alert('Info', 'Please read all terms and conditions to continue') : null}>
              <View>
                <Button
                  disabled={!(this.state.haveRead && this.state.scrolled)}
                  style={
                    this.state.scrolled && this.state.haveRead
                      ? localStyles.button
                      : localStyles.buttonDisabled
                  }
                  onPress={() => this.props.navigation.push('EmailInput')}>
                  <Text
                    style={this.state.scrolled && this.state.haveRead ?
                      { ...styles.buttonTextSize, color: 'white' } :
                      { ...styles.buttonTextSize, color: Colors.link }}>Continue</Text>
                </Button>
              </View>
            </TouchableWithoutFeedback>

          </View>
        </View>
      </View>

    );
  }
}

const { height } = Dimensions.get('window');

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: vh(1),
    paddingLeft: vw(4),
    paddingRight: vw(4),
    marginBottom: '10%',
  },
  scrollView: {
    padding: vh(3),
    backgroundColor: '#FFF',
    height: height * 0.7,
  },
  checkBox: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  button: {
    width: '100%',
    height: vh(7),
    shadowOpacity: 0.2,
    shadowOffset: { width: 3, height: 3 },
    backgroundColor: '#136AC7',
    borderRadius: 5,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonDisabled: {
    width: '100%',
    height: vh(7),
    shadowOpacity: 0.2,
    shadowOffset: { width: 3, height: 3 },
    backgroundColor: '#FFF',
    borderRadius: 5,
    justifyContent: 'center',
    alignSelf: 'center',
  },
});

export default TermsAndConditions;
