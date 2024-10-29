/*
 *   Copyright (c) 2020 Grigore Crudu
 *   All rights reserved.
 */

import React, { Component } from 'react';
import { View, Text, Button, ListItem } from 'native-base';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import { StyleSheet, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import CheckBox from '@react-native-community/checkbox';
import HTML from 'react-native-render-html';

import PolicyHTML from '../registration/Policy';
import withReduxStore from '../../utils/withReduxStore';
import { styles as globalStyles } from '../registration/styles';

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
  componentDidMount = () => {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.props.updateNavigation({ profileHeaderShown: true });
    });
  };

  componentWillUnmount = () => {
    this.unsubscribe();
  };
  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          onScroll={({ nativeEvent }) => {
            if (isCloseToBottom(nativeEvent)) {
              this.setState({
                scrolled: true,
              });
            }
          }}>
          <HTML html={PolicyHTML} />
        </ScrollView>

        <View style={{ marginTop: 30 }}>
          <Button onPress={() => this.props.navigation.navigate('Main')} style={styles.button}>
            <Text style={globalStyles.buttonTextSize}>Close</Text>
          </Button>
        </View>

        {/*<View>
          <ListItem>
            <CheckBox
              style={styles.checkBox}
              value={this.state.haveRead}
              onValueChange={(value) => {
                this.setState({ haveRead: value });
              }}
            />
            <Text style={globalStyles.defaultText}>I have read the Terms and Conditions</Text>
          </ListItem>

          <Button
            disabled={!(this.state.haveRead && this.state.scrolled)}
            style={
              this.state.scrolled && this.state.haveRead
                ? styles.button
                : styles.buttonDisabled
            }
            onPress={() => this.props.navigation.push('Profile')}>
            <Text>OK</Text>
          </Button>
          </View>*/}
      </View >
    );
  }
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //paddingTop: vh(1),
    //paddingLeft: vw(4),
    //paddingRight: vw(4),
    marginBottom: '10%',
  },
  scrollView: {
    padding: vh(3),
    backgroundColor: '#FFF',
    height: height * 0.7,
  },
  textBulleted: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 12,
  },
  button: {
    width: '90%',
    height: vh(7),
    shadowOpacity: 0.2,
    shadowOffset: { width: 3, height: 3 },
    backgroundColor: '#136AC7',
    borderRadius: 5,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#999',
    borderRadius: 5,
    padding: 10,
    justifyContent: 'center',
  },
  checkBox: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
});

export default withReduxStore(TermsAndConditions);
