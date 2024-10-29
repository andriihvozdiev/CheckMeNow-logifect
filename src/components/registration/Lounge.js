/*
 *   Copyright (c) 2020 Grigore Crudu
 *   All rights reserved.
 */

import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { styles } from './styles';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';

const Lounge = () => {
  return (
    <View >
      <Image
        source={require('../../../assets/bird_transparent.png')}
        style={{
          height: vh(8),
          width: vw(40),
          resizeMode: 'contain',
        }}
      />

    </View>
  );
};



export default Lounge;
