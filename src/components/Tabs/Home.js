import React, { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Button } from 'native-base';

import { SwipeablePanel } from '../swipeablePanel';
import ChatBot from '../Chat/ChatBot';
import withReduxStore from '../../utils/withReduxStore';
import RNFS from 'react-native-fs';
import HeaderImage from '../HeaderImage';

import { YellowBox } from 'react-native';
import Colors from '../../constants/colors';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import QRCodeChat from '../Chat/QRCodeChat';
import UserStatus from '../../constants/userStatus';
import { Card, Text, View } from 'native-base';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import { styles } from '../registration/styles';
import { tabStyles } from './tabStyles';
import moment from 'moment';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Platform } from 'react-native';
import Session from '../../utils/Session';
import PassKit, { AddPassButton } from 'react-native-passkit-wallet';
import { encode, decode } from 'base64-arraybuffer';
import { ScrollView } from 'react-native-gesture-handler';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';

YellowBox.ignoreWarnings([
  'VirtualizedLists should never be nested', // TODO: Remove when fixed
]);

class Home extends Component {
  state = {
    swipeablePanelActive: false,
    noBackgroundOpacity: false,
    chatOpenLarge: false,
    isChatActive: false,
    scenarioWithoutStatus: null
  };

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

  onRemoteNotification = (notification) => {
    if (Platform.OS === "ios") {
      const isClicked = notification.getData().userInteraction === 1;

      if (isClicked) {
        console.log("Navigate user to another screen");
        console.log(notification.getData())
        // Navigate user to another screen
      } else {
        console.log("Do something else with push notification");
        console.log(notification.getData())
        // Do something else with push notification
      }
      Session.updateUserStatus(this.props.user.email, this.props.initUserFromDb)
    } else {
      console.log("notification");
      console.log(notification);
    }
  };

  componentDidMount() {
    try {
      PassKit.canAddPasses()
        .then((result) => {
          console.log("PassKit");
          console.log(result);
        })
    }
    catch (err) {
      console.log(err);
    }
    this.setState({ chatOpenLarge: false });
    this.unsubscribeNavigationStateEvent = this.props.navigation.addListener('state', (payload) => {
      console.log("Navigation event state home");
      console.log(payload);
      this.setState({ chatOpenLarge: false });
      if (payload.data.state.index == 0) {
        this.setState({ isChatActive: true });
      }
      else {
        this.setState({ isChatActive: false });
      }
    });

    /* if (Platform.OS === "ios") {
      PushNotificationIOS.addEventListener('notification', this.onRemoteNotification);
    } */
  }

  componentWillUnmount() {
    this.unsubscribeNavigationStateEvent();
    PushNotificationIOS.removeEventListener('notification');
  }

  addPass = async () => {
    console.log('this.dataURL');
    console.log(this.dataURL);
    PassKit.addPass(this.dataURL)
      .then(() => console.log(this.dataURL))
      .catch((err) => console.log(err));
  }

  getDataURLFromQRCode = (data) => {
    this.dataURL = data;
  }



  resetScenarioWithoutStatus = () => {
    this.setState({ scenarioWithoutStatus: null })
  }

  vaccineInformationCard = () => {
    return (
      <Card style={localStyles.vaccinationContainer}>
        <Text style={{ ...styles.defaultText, textAlign: 'center' }}>
          Want to find out more about the vaccines?
        </Text>
        <TouchableOpacity onPress={() => {
          this.setState({ scenarioWithoutStatus: '@VaccineInformation' })
          this.largePanel();
        }

        }>
          <Text style={{ ...styles.link, ...styles.buttonTextSize, marginTop: vh(2) }}>
            Yes, tell me more
                      </Text>
        </TouchableOpacity>
      </Card>
    );
  }


  render() {
    return (
      <View style={{ flex: 1, elevation: 10 }}>
        <View style={localStyles.headerImage}>
          <HeaderImage />
        </View>
        <ScrollView style={localStyles.container} showsVerticalScrollIndicator={false}>
          <View >
            {
              //------------- UNVERIFIED -----------
              this.props.user.userStatus === UserStatus.UNVERIFIED ? (
                <View>
                  <Card style={localStyles.vaccinationContainer}>
                    <Text style={{ ...styles.defaultText, textAlign: 'center' }}>
                      For vaccine certificate we need to verify your identity.
                </Text>

                    <Button
                      style={{ ...styles.button, marginTop: vh(2) }}
                      onPress={() => {
                        this.props.navigation.push('IdentityNavigation');
                      }}>
                      <Text style={{ ...styles.defaultText, ...styles.buttonTextSize, justifyContent: 'center', }}>Get started</Text>
                    </Button>
                  </Card>
                  {this.vaccineInformationCard()}
                </View>

              ) :

                //------------- NO_NHS_LINKAGE -----------
                this.props.user.userStatus === UserStatus.NO_NHS_LINKAGE ? (
                  <View>
                    <Card style={localStyles.vaccinationContainer}>
                      <Image
                        source={require('../../../assets/QRCodeModel.png')}
                        style={{
                          height: vh(5),
                          width: vw(15),
                          resizeMode: 'contain',
                        }}
                      />
                      <Text style={{ ...styles.defaultText, textAlign: 'center', marginTop: vh(1) }}>
                        Enter your vaccination details to generate your free digital vaccine certificate.
                    </Text>
                      <Button
                        style={{ ...styles.button, marginTop: vh(2) }}
                        onPress={() => {
                          this.props.navigation.push('WizardNoNhsLinkage');
                        }}>
                        <Text style={{ ...styles.defaultText, ...styles.buttonTextSize, justifyContent: 'center' }}>Get started</Text>
                      </Button>
                    </Card>

                    <Card style={localStyles.vaccinationContainer}>
                      <Text style={{ ...styles.defaultText, textAlign: 'center' }}>
                        Want to find out more about what happens next?
                      </Text>
                      <TouchableOpacity onPress={() => {
                        this.props.updateUser({
                          userStatus: UserStatus.NO_NHS_LINKAGE,
                          vaccinationDate: null,
                          vaccinationCenter: null,
                          scenarioWithoutStatus: null,
                          homeDialogState: null
                        })
                        this.largePanel();
                      }}>
                        <Text style={{ ...styles.link, ...styles.buttonTextSize, marginTop: vh(2) }}>
                          Yes, tell me more
                      </Text>
                      </TouchableOpacity>
                    </Card>

                    {this.vaccineInformationCard()}
                  </View>

                ) :

                  //------------- INITIAL -----------
                  this.props.user.userStatus === UserStatus.INITIAL ? (
                    this.props.user.vaccinationDate ? (
                      <Card style={localStyles.vaccinationContainer}>
                        <Text style={{ ...styles.defaultText, textAlign: 'center' }}>
                          Your vaccination appointment is on:
                          </Text>
                        <Text style={{ ...styles.defaultText, textAlign: 'center' }}>
                          {moment(this.props.user.vaccinationDate).format('DD/MM/YYYY HH:mm')}
                        </Text>

                        <TouchableOpacity
                          onPress={() => {
                            if (this.props.user.vaccinationDate)
                              this.props.navigation.push('WizardAppointmentDetails');
                            else
                              this.props.navigation.push('WizardNoVaccine');
                          }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <AntDesign name="arrowright" size={18} color={Colors.blue} />
                            <Text style={[styles.defaultText, styles.link]}> More info</Text>
                          </View>
                        </TouchableOpacity>
                      </Card>
                    ) :
                      <Card style={localStyles.vaccinationContainer}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 0.65,
                          }}>
                          <Fontisto name="injection-syringe" size={45} />
                          <MaterialCommunityIcons
                            name="file-question-outline"
                            size={45}
                          />
                        </View>
                        <View style={{ marginTop: 25 }}>
                          <Text style={styles.defaultText}>
                            You have no vaccination record
                        </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => {
                            if (this.props.user.vaccinationDate)
                              this.props.navigation.push('WizardAppointmentDetails');
                            else
                              this.props.navigation.push('WizardNoVaccine');
                          }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <AntDesign name="arrowright" size={18} color={Colors.blue} />
                            <Text style={[styles.defaultText, styles.link]}> More info</Text>
                          </View>
                        </TouchableOpacity>
                      </Card>) :

                    //--------------SECOND_DOSE--------------------
                    this.props.user.userStatus === UserStatus.SECOND_DOSE ? (
                      this.props.user.vaccinationDate ? (
                        <Card style={localStyles.vaccinationContainer}>
                          <Text style={{ ...styles.defaultText, textAlign: 'center' }}>
                            Your second vaccination appointment is on:
                            </Text>
                          <Text style={{ ...styles.defaultText, textAlign: 'center' }}>
                            {moment(this.props.user.vaccinationDate).format('DD/MM/YYYY HH:mm')}
                          </Text>
                          <TouchableOpacity
                            onPress={() => {
                              this.props.navigation.push('WizardAppointmentDetails');
                            }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <AntDesign name="arrowright" size={18} color={Colors.blue} />
                              <Text style={[styles.defaultText, styles.link]}> More info</Text>
                            </View>
                          </TouchableOpacity>
                        </Card>) :
                        <Card style={localStyles.vaccinationContainer}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'center',
                              opacity: 0.65,
                            }}>
                            <Fontisto name="injection-syringe" size={45} />
                            <MaterialCommunityIcons
                              name="file-question-outline"
                              size={45}
                            />
                          </View>
                          <View>
                            <Text style={styles.defaultText}>Second dose of the vaccine is needed.</Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => {
                              this.props.navigation.push('WizardSecondVaccine');
                            }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <AntDesign name="arrowright" size={18} color={Colors.blue} />
                              <Text style={[styles.defaultText, styles.link]}> More info</Text>
                            </View>
                          </TouchableOpacity>
                        </Card>) :

                      //------------- AWAITING_VACCINATION -----------
                      this.props.user.userStatus === UserStatus.AWAITING_VACCINATION ? (
                        <View>
                          <Card style={localStyles.vaccinationContainer}>
                            <Text style={styles.defaultText}>We are waiting for your vaccination record.</Text>
                            <Button
                              style={{ ...styles.button, marginTop: vh(2) }}
                              onPress={() => {
                                this.props.navigation.push('WizardCheckVaccinationRecords');
                              }}>
                              <Text style={{ ...styles.defaultText, ...styles.buttonTextSize, justifyContent: 'center' }}>Get more info</Text>
                            </Button>
                          </Card>

                          <Card style={localStyles.vaccinationContainer}>
                            <Text style={{ ...styles.defaultText, textAlign: 'center' }}>
                              Want to find out more about what should happen next
                              </Text>
                            <TouchableOpacity onPress={() => {
                              this.props.updateUser({
                                homeDialogState: null,
                                scenarioWithoutStatus: null
                              })
                              this.largePanel();
                            }}>
                              <Text style={{ ...styles.link, ...styles.buttonTextSize, marginTop: vh(2) }}>
                                Yes, tell me more
                              </Text>
                            </TouchableOpacity>
                          </Card>

                          {this.vaccineInformationCard()}
                        </View>
                      ) :

                        //------------- FIRST_DOSE_CONFIRMED -----------
                        this.props.user.userStatus === UserStatus.FIRST_DOSE_CONFIRMED ? (
                          <View>
                            <Card style={localStyles.vaccinationContainer}>
                              <Text style={styles.defaultText}>First dose of vaccine is confirmed</Text>

                              <Button
                                style={{ ...styles.button, marginTop: vh(2) }}
                                onPress={() => {
                                  this.props.navigation.push('WizardCheckVaccinationRecords');
                                }}>
                                <Text style={{ ...styles.defaultText, ...styles.buttonTextSize, justifyContent: 'center' }}>Get more info</Text>
                              </Button>
                            </Card>
                            <Card style={localStyles.vaccinationContainer}>
                              <Text style={{ ...styles.defaultText, textAlign: 'center' }}>
                                Want to find out more about what should happen next
                              </Text>
                              <TouchableOpacity onPress={() => {
                                this.props.updateUser({
                                  homeDialogState: null,
                                  scenarioWithoutStatus: null
                                })
                                this.largePanel();
                              }}>
                                <Text style={{ ...styles.link, ...styles.buttonTextSize, marginTop: vh(2) }}>
                                  Yes, tell me more
                              </Text>
                              </TouchableOpacity>
                            </Card>
                            {this.vaccineInformationCard()}
                          </View>
                        ) :

                          //------------- VACCINATION_CONFIRMED -----------
                          this.props.user.userStatus === UserStatus.VACCINATION_CONFIRMED ? (
                            <View>
                              <Card style={localStyles.vaccinationContainer}>
                                <Text style={styles.defaultText}>Your vaccination is confirmed.</Text>
                                <Button
                                  style={{ ...styles.button, marginTop: vh(2) }}
                                  onPress={() => {
                                    this.props.navigation.push('WizardCheckVaccinationRecords');
                                  }}>
                                  <Text style={{ ...styles.defaultText, ...styles.buttonTextSize, justifyContent: 'center' }}>Get more info</Text>
                                </Button>
                              </Card>
                              <Card style={localStyles.vaccinationContainer}>
                                <Text style={{ ...styles.defaultText, textAlign: 'center' }}>
                                  Want to find out more about what should happen next
                              </Text>
                                <TouchableOpacity onPress={() => {
                                  this.props.updateUser({
                                    homeDialogState: null,
                                    scenarioWithoutStatus: null
                                  })
                                  this.largePanel();
                                }}>
                                  <Text style={{ ...styles.link, ...styles.buttonTextSize, marginTop: vh(2) }}>
                                    Yes, tell me more
                              </Text>
                                </TouchableOpacity>
                              </Card>
                              {this.vaccineInformationCard()}
                            </View>
                          ) :

                            //------------- IMMUNITY_CONFIRMED -----------
                            this.props.user.userStatus === UserStatus.IMMUNITY_CONFIRMED ? (
                              !this.props.user.isQrCodeReady ?
                                <View>
                                  <Card style={localStyles.vaccinationContainer}>
                                    <Text style={{ ...styles.defaultText, textAlign: 'center' }}>
                                      It is likely that you are immune against SARS-CoV-2.
                                  We can issue the vaccine certificate now.</Text>
                                    <Button
                                      style={{ ...styles.button, marginTop: vh(2) }}
                                      onPress={() => {
                                        this.props.navigation.push('WizardImmunityPass');
                                      }}>
                                      <Text style={{ ...styles.defaultText, ...styles.buttonTextSize, justifyContent: 'center' }}>Get started</Text>
                                    </Button>
                                  </Card>
                                  {this.vaccineInformationCard()}
                                </View> : (
                                  <View>
                                    <Card style={localStyles.vaccinationContainer}>
                                      <QRCodeChat
                                        value={this.props.user.certificate ?
                                          `${this.props.user.certificate.messageHash}.${this.props.user.certificate.signature}` : 'Hi'}
                                        onGetDataURL={this.getDataURLFromQRCode}
                                        size={220} />
                                      <View style={localStyles.qrCodeContextMenu}>
                                        <TouchableOpacity onPress={() => {
                                          this.props.navigation.push('WizardCertificateDetails')
                                        }}>
                                          <Text style={{ ...styles.buttonTextSize, ...styles.link }}> View my certificate</Text>
                                        </TouchableOpacity>
                                        {/*
                                      __DEV__ && Platform.OS == "ios" ?
                                        <AddPassButton
                                          style={localStyles.addPassButton}
                                          addPassButtonStyle={PassKit.AddPassButtonStyle.black}
                                          onPress={this.addPass}
                                        /> : null
                                    */}
                                      </View>
                                    </Card>
                                    {this.vaccineInformationCard()}
                                  </View>
                                )

                            ) : null
            }
          </View>

        </ScrollView>

        {/* <View style={localStyles.talkToCheckie}>
          <TouchableOpacity onPress={this.props.onLargePanel} >
            <View style={localStyles.logo}>
              <Image
                style={localStyles.logoImageLink}
                source={require('../../../assets/bird_transparent.png')}
              />
              <Text style={{ ...styles.defaultText, marginLeft: 10 }}>Talk to Checkie</Text>
            </View>
          </TouchableOpacity>
        </View> */}
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
          <ChatBot
            navigation={this.props.navigation}
            openLarge={this.state.chatOpenLarge}
            scenarioWithoutStatus={this.state.scenarioWithoutStatus}
            resetScenarioWithoutStatus={this.resetScenarioWithoutStatus} />
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
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: vw(5),
  },
  logoImageLink: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  logoText: {
    paddingLeft: 3,
    fontSize: 14,
    fontFamily: 'Avenir Next Medium',
  },
  logoImage: {
    marginTop: vh(3),
    marginLeft: vh(2),
    width: 40,
    height: 40,
  },
  vaccinationContainer: {
    alignItems: 'center',
    width: '100%',
    padding: vh(2),
    shadowOpacity: 0.2,
    shadowOffset: { width: 3, height: 3 },
    shadowRadius: 6,
    borderRadius: 6,
    elevation: 1,
    zIndex: 1,
  },
  talkToCheckie: {
    paddingLeft: vw(3),
    paddingTop: vh(2),
    paddingBottom: vh(2),
    backgroundColor: 'white',
    width: '100%'
  },
  qrCodeContextMenu: {
    marginTop: vh(2),
    alignItems: 'center'
  },
  addPassButton: {
    width: 100,
    height: 30,
    marginLeft: 50,
  },
  normalText: {
    fontSize: RFPercentage(2.4),
    fontFamily: 'Avenir Next Medium',
  },
});

export default withReduxStore(Home);
