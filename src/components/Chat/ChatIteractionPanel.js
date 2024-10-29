import React, { useState } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { List, ListItem } from 'native-base';
import LocationsMap from './LocationsMap';
import MessageInput from './MessageInput';
import ChooseDate from './ChooseDate';
import QRCodeChat from './QRCodeChat';
import withReduxStore from '../../utils/withReduxStore';
import { styles as globalStyles } from '../registration/styles';

const ChatIteractionPanel = (props) => {
  const markerClickHandler = (marker) => {
    if (props.source === 'GP_SURGERIES') {
      props.updateUser({ gpSurgery: marker.gpSurgery });
      props.quickReply('default', marker.gpSurgery.Name);
    }
    if (props.source === 'VACCINATION_CENTRES') {
      Linking.canOpenURL(marker.gpSurgery.Link).then((supported) => {
        if (supported) {
          Linking.openURL(marker.gpSurgery.Link);
        } else {
          console.log("Don't know how to open URI: " + marker.gpSurgery.Link);
        }
      });
    }
  };

  if (props.method && props.method === 'map')
    return (
      <LocationsMap
        postCodeLocation={props.user.postCode ? props.user.postCode : 'TN48JX'}
        markerClick={markerClickHandler}
      />
    );

  if (props.method && props.method === 'DATE')
    return (
      <View>
        <List>
          {props.transitions
            ? props.transitions.filter(item => item.input !== 'default').map((item) => {
              return (
                <ListItem
                  key={item.input}
                  onPress={() => {
                    props.quickReply(item.input);
                  }}>
                  <Text style={globalStyles.chatBotText}>{item.input}</Text>
                </ListItem>
              );
            })
            : null}
        </List>
        <ChooseDate addMessage={props.quickReply} />
      </View>);
  if (props.method && props.method === 'TEXT')
    return <MessageInput userReply={props.quickReply} />;
  if (
    props.method &&
    (props.method === 'quickReply' || props.method === '5000')
  )
    return (
      <List style={{ paddingBottom: 60 }}>
        {props.transitions
          ? props.transitions.filter(item => item.input !== 'default').map((item) => {
            return (
              <ListItem
                key={item.input}
                onPress={() => {
                  props.quickReply(item.input);
                }}>
                <Text style={globalStyles.chatBotText}>{item.input}</Text>
              </ListItem>
            );
          })
          : null}
      </List>
    );
  return null;
};

export default withReduxStore(ChatIteractionPanel);
