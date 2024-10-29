/*
 *   Copyright (c) 2020 Victor Crudu
 *   All rights reserved.
 */
import React from 'react';
import { View, Text } from 'native-base';
import { SafeAreaView, Linking } from 'react-native';
import Home from './Tabs/Home';
import SideEffects from './Tabs/SideEffects';
import Appointments from './Tabs/Appointments';
//import ProfileNavigation from './Profile/ProfileNavigation';
import Profile from './Profile/Profile';
import TabBar from './Tabs/TabBar';
import { SwipeablePanel, SMALL_PANEL_CONTENT_HEIGHT } from './swipeablePanel';
import SwipeablePanelOriginal from 'rn-swipeable-panel';
import ChatBot from './Chat/ChatBot';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import withReduxStore from '../utils/withReduxStore';
import { CommonActions } from '@react-navigation/native';

const Tab = createBottomTabNavigator();
import { NavigationContext } from '@react-navigation/native';

class Main extends React.Component {
  state = {
    swipeablePanelActive: false,
    noBackgroundOpacity: false,
    openLarge: false,
  };

  componentDidMount = () => {
    //this.openPanel();
    //const initialUrl = await Linking.getInitialURL();
    //console.log("initialUrl")
    //console.log(initialUrl)
    /* Linking.addEventListener('url', (urlData)=>{
      console.log("urlData")
      console.log(urlData)
    }); */
  };

  openPanel = () => {
    this.setState({ swipeablePanelActive: true });
  };
  closePanel = () => {
    this.setState({ swipeablePanelActive: false });
  };
  smallPanel = () => {
    this.setState({
      noBackgroundOpacity: true,
      openLarge: false,
      spContentStyle: {},
    });
    this.props.updateNavigation({ chatLarge: false });
  };
  largePanel = () => {
    console.log('Large panel');
    this.setState({
      noBackgroundOpacity: false,
      spContentStyle: { maxHeight: '100%' },
    });
    this.props.updateNavigation({ chatLarge: true });
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <Tab.Navigator initialRouteName={this.props.navigationData.selectedTab}
          tabBar={(props) => (
            <TabBar
              {...props}
              tabBarVisible={!this.props.navigationData.chatLarge}
            />
          )}>

          <Tab.Screen name="Home">
            {(props) => <Home {...props} onLargePanel={this.openPanel} />}
          </Tab.Screen>

          {/* <Tab.Screen name="Appointments">
            {(props) => <Appointments {...props} onLargePanel={this.openPanel} />}
          </Tab.Screen> */}

          {/*<Tab.Screen name="Side effects">
            {(props) => <SideEffects {...props} onLargePanel={this.openPanel} />}
        </Tab.Screen>*/}

          <Tab.Screen name="Profile">
            {(props) => <Profile {...props} />}
          </Tab.Screen>
        </Tab.Navigator>
        {/* <SwipeablePanel
          fullWidth={true}
          allowTouchOutside={true}
          closeOnTouchOutside={true}
          onlyLarge={false}
          style={{position:'absolute', bottom: 50}}
          noBackgroundOpacity={this.state.noBackgroundOpacity}
          isActive={true}
          onClose={this.closePanel}
          onSmall={this.smallPanel}
          onLarge={this.largePanel}>
          <ChatBot navigation={this.props.navigation} openLarge={this.state.openLarge} />
        </SwipeablePanel> */}
      </SafeAreaView>
    );
  }
}

export default withReduxStore(Main);
