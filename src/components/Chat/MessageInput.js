import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input } from 'native-base';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';

const MessageInput = (props) => {
  const [currentText, setCurrentText] = useState('');

  return (
    <View style={styles.messageInput}>
      <Input
        multiline
        placeholder="Ask questions"
        onChangeText={(value) => {
          setCurrentText(value);
        }}
        value={currentText}
      />
      <TouchableOpacity
        onPressIn={() => {
          if (currentText != '')
            props.userReply(currentText);
          setCurrentText('');
        }}>
        <Material right size={35} name="send-circle" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  messageInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5, marginLeft: 9,
  },
});

export default MessageInput;
