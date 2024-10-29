import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Button } from 'native-base';
import withReduxStore from '../../utils/withReduxStore';
import { RFValue } from 'react-native-responsive-fontsize';
import { YellowBox } from 'react-native';
import Colors from '../../constants/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Card, Text, View } from 'native-base';
import { vw, vh } from 'react-native-expo-viewport-units';
import { styles } from '../registration/styles';

import { SwipeablePanel } from '../swipeablePanel';
import ChatBot from '../Chat/ChatBot';
import EventEmitter from '../../utils/EventEmmiter';

YellowBox.ignoreWarnings([
  'VirtualizedLists should never be nested', // TODO: Remove when fixed
]);

class SideEffects extends Component {
  state = {
    sideEffects: this.props.user.sideEffects,
    isChatActive: false,
    chatOpenLarge: false,
  };



  mapSideEffectsStateFromRedux = () => {
    if (!this.prevTime || this.prevTime.isBefore(this.props.user.client_timestamp)) {
      this.setState({
        sideEffects: this.props.user.sideEffects,
      });
      this.prevTime = this.props.user.client_timestamp;
    }
  }

  componentDidUpdate = () => {
    this.mapSideEffectsStateFromRedux();
    //console.log('this.props.user.sideEffectsDialogState');
    //console.log(this.props.user.sideEffectsDialogState.modelField);
  }

  componentDidMount = () => {
    this.mapSideEffectsStateFromRedux();
    this.setState({ chatOpenLarge: false });
    this.unsubscribeNavigationStateEvent = this.props.navigation.addListener('state', (payload) => {
      console.log("Navigation event state");
      console.log(payload)
      this.setState({ chatOpenLarge: false });
      if (payload.data.state.index == 1)
        this.setState({ isChatActive: true });
      else
        this.setState({ isChatActive: false });
    });
  };

  componentWillUnmount() {
    this.unsubscribeNavigationStateEvent();
  }

  smallPanel = () => {
    console.log("chatOpenLarge: false,")
    this.setState({
      chatOpenLarge: false,
    });
  };

  largePanel = () => {
    console.log("chatOpenLarge: true,")
    this.setState({
      chatOpenLarge: true,
    });
  };

  getSideEffectsCardDetails = () => {
    if (this.props.user.sideEffectsDialogState &&
      (this.props.user.userStatus !== "UNVERIFIED" && this.props.user.userStatus !== "NO_NHS_LINKAGE")) {
      if (!this.props.user.isSideEffectScenarioCompleted) {
        return {
          text: "You started to share with us side effects. Would you like to continue?",
          linkText: "Yes"
        }
      } else {
        return {
          text: "Anything new regarding side efects?",
          linkText: "Yes"
        }
      }
    }
    else {
      return {
        text: "Like all medicines, SARS-CoV-2 vaccines can cause side effects",
        linkText: "Get started"
      }
    }
  }

  render() {
    const cardDetails = this.getSideEffectsCardDetails();
    return (
      <View style={{ flex: 1 }}>
        <View style={localStyles.headerImage}>
          <Text style={styles.h3}>Side Effects</Text>
        </View>
        <View style={localStyles.container}>
          <Card style={localStyles.vaccinationContainer}>
            <Text style={{ ...styles.defaultText, textAlign: 'center' }}>
              {cardDetails.text}
            </Text>

            <Button
              style={{ ...styles.button, marginTop: vh(2) }}
              onPress={() => {
                this.setState({ chatOpenLarge: true, isChatActive: true })
              }}>
              <Text style={{ ...styles.smallText, justifyContent: 'center' }}>{cardDetails.linkText}</Text>
            </Button>

          </Card>
          <Card style={localStyles.vaccinationContainer}>
            <Text style={{ ...styles.defaultText, textAlign: 'center' }}>
              History of your side effects
                      </Text>
            <TouchableOpacity onPress={() => {
              this.largePanel();
            }}>
              <Text style={{ ...styles.link, ...styles.smallText, marginTop: vh(1) }}>
                View
                      </Text>
            </TouchableOpacity>
          </Card>

        </View >

        <SwipeablePanel
          fullWidth={true}
          allowTouchOutside={true}
          closeOnTouchOutside={true}
          onlyLarge={false}
          showCloseButton={this.state.chatOpenLarge}
          style={this.state.spContentStyle}
          noBackgroundOpacity={this.state.noBackgroundOpacity}
          isActive={this.state.isChatActive}
          openLarge={this.state.chatOpenLarge}
          onClose={this.smallPanel}
          onSmall={this.smallPanel}
          onLarge={this.largePanel}>
          <ChatBot navigation={this.props.navigation} openLarge={this.state.openLarge} />
        </SwipeablePanel>
      </View >
    );
  }
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: vh(1),
    paddingLeft: vw(4),
    paddingRight: vw(4),
    paddingBottom: vh(5),
  },
  headerImage: {
    width: '100%',
    height: vh(8),
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  vaccinationContainer: {
    alignItems: 'center',
    width: '100%',
    padding: vh(3),
    shadowOpacity: 0.2,
    shadowOffset: { width: 3, height: 3 },
    shadowRadius: 6,
    borderRadius: 6,
    elevation: 1,
    zIndex: 1,
  },
});



export default withReduxStore(SideEffects);
