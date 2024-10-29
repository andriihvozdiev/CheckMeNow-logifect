import React from 'react'
import { Image, View } from 'react-native';

const HeaderImage = () => (

    <Image
        style={{ width: 50, height: 45 }}
        resizeMode={'contain'}
        source={require('../../assets/bird_transparent.png')} />    

);

export default HeaderImage;