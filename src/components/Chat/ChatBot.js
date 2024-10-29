import React from 'react';
import MessageInput from './MessageInput';
import ChatIteractionPanel from './ChatIteractionPanel';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image,
  Keyboard,
  FlatList,
  ScrollView
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { Svg, Path } from 'react-native-svg';
import { vw, vh } from 'react-native-expo-viewport-units';
// import {
//   FlatList,
// } from 'react-native-gesture-handler';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../constants/colors';
import { LARGE_PANEL_CONTENT_HEIGHT } from '../swipeablePanel';
import chatMachine from '../../da/chat';
import withReduxStore from '../../utils/withReduxStore';
import UserStatus from '../../constants/userStatus';
import { TypingAnimation } from 'react-native-typing-animation';
import { styles as globalStyles } from '../registration/styles';
import user from '../../da/user';
import { TouchThroughView, TouchThroughWrapper } from 'react-native-touch-through-view';

class ChatBot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    if (!this.props.user.sideEffectsDialogState || this.props.user.isSideEffectScenarioCompleted)
      this.props.cleanSideEffectsFromStore();

    this.setState({ messageHeight: vh(40) });
    this.keyboardDidShow = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHide = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );

    if (this.props.scenarioWithoutStatus) {
      console.log('SCENARIO WITHOUT STATUS');
      console.log(this.props.scenarioWithoutStatus);
      this.props.cleanMessagesFromStore();
      await this.startScenario(this.props.scenarioWithoutStatus);
      this.props.resetScenarioWithoutStatus();
    }
    else {
      console.log('SCENARIO WITH STATUS')
      await this.newScenarioStart();
    }
  }

  componentDidUpdate = async (prevProps, prevState) => {
    /*console.log("prevProps")
    console.log(prevProps)
    console.log("this.props.scenarioWithoutStatus");
    console.log(this.props.scenarioWithoutStatus);
    if (prevProps.scenarioWithoutStatus !== this.props.scenarioWithoutStatus) {
      console.log("homeDialogState")
      console.log(this.props.user.homeDialogState)
      this.props.updateUser({ homeDialogState: null })
    }*/

  }

  newScenarioStart = async () => {
    const scenario = this.getScenario();

    console.log("this.props.user")
    console.log(this.props.user)
    if (!this.props.user.sideEffectsScenario) {
      console.log("Start scenario");
      if (this.props.user.homeDialogState) {
        console.log("SCENARIO FROM POINT STATE");
        console.log(scenario);
        console.log("this.props.user.homeDialogState")
        console.log(this.props.user.homeDialogState)
        this.currentDialogState = this.props.user.homeDialogState;
        this.setQuickReplayView(this.props.user.homeDialogState);
      } else {
        console.log("SCENARIO FROM BEGIN");
        console.log(scenario);
        this.props.cleanMessagesFromStore();
        await this.startScenario(scenario);
      }
    }
    else {
      if (!this.props.user.sideEffectsDialogState ||
        this.props.user.isSideEffectScenarioCompleted) {
        this.props.cleanSideEffectsMessagesFromStore();
        await this.startScenario(scenario);
      } else {
        this.props.cleanSideEffectsMessagesFromStore();
        this.props.user.sideEffectsDialogState.restart = true;
        this.currentDialogState = await this.doTransition(this.props.user.sideEffectsDialogState.inputText,
          this.props.user.sideEffectsDialogState);
        console.log("first currentDialogState")
        console.log(this.currentDialogState)
        console.log('this.props.user.sideEffectsDialogState');
        console.log(this.props.user.sideEffectsDialogState);
      }
    }
  }

  getScenario = () => {
    return this.mapScenario(this.props.user.userStatus)
  }

  mapScenario = (userStatus) => {
    if (this.props.user.sideEffectsScenario) {
      if (this.props.user.isSideEffectScenarioCompleted) {
        return '@CheckSideEffectsProgress';
      } else {
        return '@CheckSideEffects';
      }
    }
    if (userStatus === UserStatus.UNVERIFIED)
      return '@Unverified';
    if (userStatus === UserStatus.NO_NHS_LINKAGE)
      return '@NoNhsLinkage';
    if (userStatus === UserStatus.INITIAL)
      return '@InitialStatus';
    if (userStatus === UserStatus.SECOND_DOSE)
      return '@SecondDose';
    if (userStatus === UserStatus.AWAITING_VACCINATION)
      return '@AwaitingVaccination';
    if (userStatus === UserStatus.FIRST_DOSE_CONFIRMED)
      return '@FirstDoseConfirmed';
    if (userStatus === UserStatus.VACCINATION_CONFIRMED)
      return '@VaccinationConfirmed';
    if (userStatus === UserStatus.IMMUNITY_CONFIRMED)
      return '@ImmunityConfirmed';

  }

  startScenario = async (scenario) => {
    this.currentDialogState = await this.doTransition(scenario);
  }

  doTransition = async (inputText, previousDialogState) => {
    this.clearTimeoutIfAny();
    this.setState({ isSystemTyping: true });

    const chatNextInput = this.createChatInput(inputText, previousDialogState)

    const nextDialogState = await chatMachine.executeTransitionLocal(
      chatNextInput,
    );

    const replyMessage = this.createMessage(nextDialogState, this.props.user);

    if (this.props.user.sideEffectsScenario) {
      this.props.addSideEffectsMessageToStore(replyMessage);
    } else {
      this.props.addMessageToStore(replyMessage);
    }

    if (this.props.user.sideEffectsScenario) {
      this.props.addSideEffectToStore(replyMessage);
    }


    this.setState({ isSystemTyping: false });

    this.setQuickReplayView(nextDialogState);

    if (nextDialogState.action) {
      const actionParts = nextDialogState.action.split('::');
      this.setState({ source: actionParts[1], method: actionParts[2] });
    }

    if (!this.props.openLarge) return nextDialogState;
    this.scheduleTransitionWhenWait(nextDialogState)

    this.navigateFromChatbotWhenRequired(nextDialogState);

    return nextDialogState;
  }

  scheduleTransitionWhenWait = (dialogState) => {
    if (
      dialogState.action &&
      dialogState.action.match('wait::') &&
      dialogState.transitions.find((item) => item.input === 'default')
    ) {
      this.setState({ isSystemTyping: true });
      this.defaultInputTimeout = setTimeout(() => {
        delete this.defaultInputTimeout;
        this.doTransition('default', dialogState).then(nextDialogState => {
          this.currentDialogState = nextDialogState;
          if (!this.props.user.sideEffectsScenario)
            this.props.updateUser({ homeDialogState: this.currentDialogState });
        });
      }, 3000);
    }
  }

  createMessage = (dialogState, user) => {
    const replyMessage = {
      outputText: dialogState.outputText,
      user: 'System',
      createdAt: new Date(),
    };

    if (dialogState.outputText && dialogState.outputText.match('{firstName}')) {
      replyMessage.outputText = dialogState.outputText.replace(
        '{firstName}',
        user.firstName ? user.firstName : ""
      );
    }

    if (dialogState.outputText && dialogState.outputText.match('{gpSurgery}')) {
      replyMessage.outputText = dialogState.outputText.replace(
        '{gpSurgery}',
        user.gpSurgery.Name
      );
    }
    return replyMessage;
  }



  userReply = async (inputText, value) => {
    const quickReplyMessage = {
      outputText: value ? value : inputText,
      user: 'Patient',
      createdAt: new Date(),
    };


    if (this.props.user.sideEffectsScenario) {
      this.props.addSideEffectsMessageToStore(quickReplyMessage);
    } else {
      this.props.addMessageToStore(quickReplyMessage);
    }

    if (this.props.user.sideEffectsScenario) {
      this.props.addSideEffectToStore(quickReplyMessage);
      this.currentDialogState.inputText = inputText;
      this.props.updateUser({ sideEffectsDialogState: this.currentDialogState });
    }


    if (this.props.user.sideEffectsScenario) {
      this.currentDialogState.inputText = inputText;
      this.props.updateUser({ sideEffectsDialogState: this.currentDialogState });
    }
    this.currentDialogState = await this.doTransition(inputText, this.currentDialogState);

    if (!this.props.user.sideEffectsScenario)
      this.props.updateUser({ homeDialogState: this.currentDialogState });

    if (this.props.user.sideEffectsScenario) {
      this.props.updateUser({
        isSideEffectScenarioCompleted:
          this.currentDialogState.modelField === 'isCompleted'
      });
    }
  }

  navigateFromChatbotWhenRequired(nextDialogState) {
    if (nextDialogState.action &&
      nextDialogState.action.match('navigate')) {
      const actionParts = nextDialogState.action.split("::");
      console.log("actionParts[1]");
      console.log(actionParts[1]);
      setTimeout(() => {
        if (actionParts[1] && actionParts[1].includes('/')) {
          const navPathParts = actionParts[1].split('/');
          console.log('navPathParts')
          console.log(navPathParts)
          if (navPathParts[1].includes('Side effects')) {
            this.props.updateUser({ sideEffectsScenario: '@CheckSideEffects' })
          }
          this.props.navigation.navigate(navPathParts[0], { screen: navPathParts[1] });
        } else {
          this.props.navigation.push(actionParts[1]);
        }
      }, 2000);
    }
  }

  setQuickReplayView(nextDialogState) {
    if (!nextDialogState.action || !nextDialogState.action.match("TEXT")) {
      this.setState({ transitions: nextDialogState.transitions, method: 'quickReply' });
    }
  }

  clearTimeoutIfAny() {
    if (this.defaultInputTimeout) {
      clearTimeout(this.defaultInputTimeout);
      this.defaultInputTimeout = null;
    }
  }

  createChatInput(inputText, previousDialogState) {
    return {
      inputText: inputText,
      outputText: previousDialogState ? previousDialogState.outputText : null,
      intentName: previousDialogState ? previousDialogState.intentName : null,
      transitions: previousDialogState ? previousDialogState.transitions : null,
      restart: previousDialogState ? previousDialogState.restart : null,
    };
  }

  componentWillUnmount() {
    this.keyboardDidShow.remove();
    this.keyboardDidHide.remove();
    this.clearTimeoutIfAny();
  }

  _keyboardDidShow = (event) => {

    this.paddHeight = event.endCoordinates.height - this.emptyHeight;
    this.setState((prevState) => {
      return {
        messageHeight: prevState.messageHeight - this.paddHeight,
      };
    });
    console.log(this.paddHeight);
  };

  _keyboardDidHide = () => {
    this.setState({ messageHeight: vh(35) });
  };

  handleLayout(evt, componentName) {
    if (!evt || !evt.nativeEvent) return;

    switch (componentName) {
      case 'Container':
        this.containerHeight = evt.nativeEvent.layout.height;
        break;
      case 'Logo':
        this.logoHeight = evt.nativeEvent.layout.height;
        break;
      case 'Messages':
        this.messagesHeight = evt.nativeEvent.layout.height;
        break;
      case 'Icons':
        this.iconsHeight = evt.nativeEvent.layout.height;
        break;
      case 'QuickReply':
        this.quickReplyHeight = evt.nativeEvent.layout.height;
        break;
    }

    this.emptyHeight = LARGE_PANEL_CONTENT_HEIGHT - this.containerHeight - 20;
  }

  getSourceMessages() {
    //console.log("this.props.user.sideEffectsScenario")
    //console.log(this.props.user.sideEffectsScenario)
    if (this.props.user.sideEffectsScenario) {
      //console.log("this.props.sideEffectsMessages");
      //console.log(this.props.sideEffectsMessages);
      return this.props.sideEffectsMessages;
    } else {
      return this.props.messages;
    }
  }

  render() {
    return (
      <View
        style={{ ...styles.container, paddingBottom: 15 }}
        onLayout={(evt) => this.handleLayout(evt, 'Container')}>
        {/* <View
          style={styles.logo}
          onLayout={(evt) => this.handleLayout(evt, 'Logo')}>
          <Image
            source={require('../../../assets/bird_transparent.png')}
            style={styles.logoImage}
          />
          <Text style={styles.logoText}>Checkie</Text>
        </View> */}
        <View
          style={{
            ...styles.messagesSide,
            // height: this.state.messageHeight,
          }}
          onLayout={(evt) => this.handleLayout(evt, 'Messages')}>

          <TouchThroughWrapper style={{ marginBottom: 10, flex: 1 }}>
            <FlatList
              onTouchStart={() => {
                return false;
              }}
              onTouchEnd={() => {
                return false;
              }}
              ref="flatList"
              style={{ flex: 1 }}
              onContentSizeChange={() => setTimeout(() => this.refs.flatList ? this.refs.flatList.scrollToEnd() : null, 0)}
              data={this.getSourceMessages()}
              keyExtractor={(item) => item.createdAt.getTime().toString()}
              renderItem={({ item }) =>
                item.user === 'System' ? (
                  <View style={[styles.item, styles.itemIn]}>
                    <View style={[styles.balloon, { backgroundColor: '#E9EFF4' }]}>
                      <Text style={{ ...globalStyles.chatBotText, paddingTop: 5, color: 'black' }}>
                        {item.outputText}
                      </Text>
                      <View
                        style={[
                          styles.arrowContainer,
                          styles.arrowLeftContainer,
                        ]}>
                        <Svg
                          style={styles.arrowLeft}
                          width={moderateScale(15.5, 0.6)}
                          height={moderateScale(17.5, 0.6)}
                          viewBox="32.484 17.5 15.515 17.5"
                          enable-background="new 32.485 17.5 15.515 17.5">
                          <Path
                            d="M38.484,17.5c0,8.75,1,13.5-6,17.5C51.484,35,52.484,17.5,38.484,17.5z"
                            fill="#E9EFF4"
                            x="0"
                            y="0"
                          />
                        </Svg>
                      </View>
                    </View>
                  </View>

                ) : (
                  <View style={[styles.item, styles.itemOut]}>
                    <View style={[styles.balloon, { backgroundColor: '#00ffff' }]}>
                      <Text style={{ ...globalStyles.chatBotText, paddingTop: 5, color: 'black' }}>
                        {item.outputText}
                      </Text>
                      <View
                        style={[
                          styles.arrowContainer,
                          styles.arrowRightContainer,
                        ]}>
                        <Svg
                          style={styles.arrowRight}
                          width={moderateScale(15.5, 0.6)}
                          height={moderateScale(17.5, 0.6)}
                          viewBox="32.485 17.5 15.515 17.5"
                          enable-background="new 32.485 17.5 15.515 17.5">
                          <Path
                            d="M48,35c-7-4-6-8.75-6-17.5C28,17.5,29,35,48,35z"
                            fill="#00ffff"
                            x="0"
                            y="0"
                          />
                        </Svg>
                      </View>
                    </View>
                  </View>
                )
              }
            />
          </TouchThroughWrapper>

        </View>

        {this.state.isSystemTyping ? (
          <View style={{ flex: 1, flexDirection: 'row', marginLeft: 20 }}>
            <Text style={{ fontStyle: 'italic', color: 'grey' }}>
              Checkie is typing
            </Text>
            <TypingAnimation dotRadius={2.7} dotColor="grey" />
          </View>
        ) : null}

        {/*<View
          style={styles.iconsSide}
          onLayout={(evt) => this.handleLayout(evt, 'Icons')}>

          <TouchableOpacity
            style={{ width: '50%' }}
            onPress={() => this.setState({ isMessage: false })}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ ...globalStyles.smallText, fontWeight: '500', marginRight: vh(0.5), color: !this.state.isMessage ? Colors.blue : Colors.unselected }}>Quick Reply</Text>
              <Material
                size={30}
                name="flash-outline"
                color={!this.state.isMessage ? Colors.blue : Colors.unselected} />

            </View>
          </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setState({ isMessage: true })}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ ...globalStyles.smallText, fontWeight: '500', marginRight: vh(1), color: this.state.isMessage ? Colors.blue : Colors.unselected }}>Type Text</Text>
              <Material
                size={30}
                name="message-text-outline"
                color={this.state.isMessage ? Colors.blue : Colors.unselected}
              />
            </View>
          </TouchableOpacity> 
        </View>*/}

        <View
          style={styles.quickReplySide}
          onLayout={(evt) => this.handleLayout(evt, 'QuickReply')}>
          <ScrollView style={{ flex: 1 }}>
            {this.state.isMessage ? (
              <MessageInput userReply={this.userReply} />
            ) : (
              <ChatIteractionPanel

                quickReply={this.userReply}
                transitions={this.state.transitions}
                method={this.state.method}
                source={this.state.source}
              />
            )}
          </ScrollView>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: vw(2),
  },
  logo: {
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: vw(5),
  },
  logoImage: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  logoText: {
    color: Colors.blue,
    fontWeight: '600',
    paddingLeft: 3,
    fontSize: 12,
    fontFamily: 'Avenir Next Medium',
  },
  messagesSide: {
    flex: 6,
  },
  quickReplySide: {
    flex: 4,
    margin: 5,
    alignItems: 'stretch',
  },
  iconsSide: {
    paddingVertical: vh(1),
    paddingHorizontal: vh(3),
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.borderColor,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  item: {
    marginVertical: moderateScale(7, 2),
    flexDirection: 'row',
  },
  itemIn: {
    marginLeft: 20,
  },
  itemOut: {
    alignSelf: 'flex-end',
    marginRight: 20,
  },
  balloon: {
    maxWidth: moderateScale(250, 2),
    paddingHorizontal: moderateScale(10, 2),
    paddingTop: moderateScale(5, 2),
    paddingBottom: moderateScale(7, 2),
    borderRadius: 20,
  },
  arrowContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    flex: 1,
  },
  arrowLeftContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },

  arrowRightContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },

  arrowLeft: {
    left: moderateScale(-6, 0.5),
  },

  arrowRight: {
    right: moderateScale(-6, 0.5),
  },
});

export default withReduxStore(ChatBot);
