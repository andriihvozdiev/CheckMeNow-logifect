import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'native-base';
import Chat from '../components/Chat';

import {SwipeablePanel} from 'rn-swipeable-panel';
import {StatusBar} from 'react-native';

export default ChatSwipePanel = () => {
  const [panelProps, setPanelProps] = useState({
    fullWidth: true,
    noBackgroundOpacity: true,
    style: {height: '75%'},
    onClose: () => closePanel(),
  });

  const [swipeablePanelActive, setSwipeablePanelActive] = useState(true);

  openPanel = () => {
    setSwipeablePanelActive(true);
  };
  closePanel = () => {
    this.setState({swipeablePanelActive: false});
    setTimeout(() => {
      this.openPanel();
    }, 0);
  };

  useEffect(() => {
    this.openPanel();
  });

  return (
    <View>
      <SwipeablePanel {...panelProps} isActive={swipeablePanelActive}>
        <Text>Content</Text>
      </SwipeablePanel>
    </View>
  );
};
