/*
 *   Copyright (c) 2020 Victor Crudu
 *   All rights reserved.
 */
import React from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import axios from 'axios';
import {View, Header, Body, Title} from 'native-base';
import {PanResponder} from 'react-native';

const MessageIds = {
  hello_message: 'hello_message',
  no_need_check: 'no_need_check',
  gender_message: 'gender_message',
  age_message: 'age_message',
  gender_answer: 'gender_answer',
  age_answer: 'age_answer',
  age_not_number_answer: 'age_not_number_answer:',
  select_statements: 'select_statements',
};
const ScenarioMessages = {
  hello_message:
    'Hello John, would you like to check if you have any  COVID19 symptoms?',
  no_need_check:
    'If you feel unwell please come back later and we will check your symptoms. Unless you want to try again now.',
  gender_message: 'Tell me your gender, please',
  gender_answer: 'My gender is: ',
  age_message: 'Tell me your age, please',
  age_answer: 'My age is: ',
  age_not_number_answer: 'Please input proper number',
};

const userSystem = {
  _id: 1,
  name: 'System',
};

const userMe = {
  _id: 2,
  name: 'Me',
};

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.evidence = [];
    this.state = {
      messages: [
        {
          _id: MessageIds.hello_message,
          text: ScenarioMessages.hello_message,
          createdAt: new Date(),
          quickReplies: {
            type: 'radio', // or 'checkbox',
            keepIt: false,
            values: [
              {
                title: '😋 Yes',
                value: 'yes',
              },
              {
                title: '😞 No',
                value: 'no',
              },
            ],
          },
          user: userSystem,
        },
      ],
      sex: '',
      age: 0,
      ageEntry: false,
    };
  }

  createNewMessage(id, text, quickReplies, user) {
    return {
      _id: id,
      text: text,
      createdAt: new Date(),
      quickReplies: quickReplies,
      user: user,
    };
  }

  addMessage(message) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, message),
    }));
  }

  addMessageFromItem(item) {
    const newMessage = this.createNewMessage(
      item.id,
      item.name,
      {
        type: 'radio', // or 'checkbox',
        keepIt: false,
        values: [
          {
            title: item.choices[0].label,
            value: item.choices[0].id,
          },
          {
            title: item.choices[1].label,
            value: item.choices[1].id,
          },
        ],
      },
      userSystem,
    );
    this.addMessage(newMessage);
  }

  callAPI(sex, age, evidence) {
    const data = JSON.stringify({sex: sex, age: age, evidence: evidence});
    const config = {
      method: 'post',
      url: 'https://api.infermedica.com/covid19/diagnosis',
      headers: {
        Accept: 'application/json',
        app_id: '87976765',
        app_key: '3ca4a1561dfebfa01f5616e6dbcc1f6f',
        'Content-Type': 'application/json',
      },
      data: data,
    };

    axios(config).then((response) => {
      this.responseData = response.data;
      if (this.responseData.should_stop) {
        this.callTriageAPI(sex, age, evidence);
        return;
      }
      const newMessage = this.createNewMessage(
        new Date(),
        this.responseData.question.text,
        null,
        userSystem,
      );
      this.addMessage(newMessage);

      const items = this.responseData.question.items;
      this.lastItemId = items[items.length - 1].id;

      this.currentItemIndex = 0;
      const item = items[this.currentItemIndex];

      this.addMessageFromItem(item);
    });
  }

  callTriageAPI(sex, age, evidence) {
    const data = JSON.stringify({sex: sex, age: age, evidence: evidence});
    const config = {
      method: 'post',
      url: 'https://api.infermedica.com/covid19/triage',
      headers: {
        Accept: 'application/json',
        app_id: '87976765',
        app_key: '3ca4a1561dfebfa01f5616e6dbcc1f6f',
        'Content-Type': 'application/json',
      },
      data: data,
    };

    axios(config).then((response) => {
      this.responseData = response.data;
      const newMessage = this.createNewMessage(
        new Date(),
        this.responseData.description,
        null,
        userSystem,
      );

      this.addMessage(newMessage);

      const newMessageLabel = this.createNewMessage(
        new Date() + 1,
        this.responseData.label,
        null,
        userSystem,
      );

      this.addMessage(newMessageLabel);
    });
  }

  onSend(messages = []) {
    let newMessage = null;

    if (this.state.ageEntry) {
      const parsedAge = parseInt(messages[0].text.replace(/[^0-9]/g, ''));
      if (isNaN(parsedAge)) {
        newMessage = this.createNewMessage(
          MessageIds.age_not_number_answer,
          ScenarioMessages.age_not_number_answer,
          null,
          userSystem,
        );
        newMessage._id = MessageIds.age_not_number_answer + messages[0].text;
      } else {
        newMessage = this.createNewMessage(
          MessageIds.age_answer,
          ScenarioMessages.age_answer + parsedAge,
          null,
          userMe,
        );
        this.setState({age: parsedAge, ageEntry: false});
        this.callAPI(this.state.sex, parsedAge, []);
      }
      this.addMessage(newMessage);
    }
  }

  onQuickReply(reply) {
    let newMessage = null;

    if (
      reply[0].value == 'no' &&
      reply[0].messageId == MessageIds.hello_message
    ) {
      newMessage = this.createNewMessage(
        MessageIds.no_need_check,
        ScenarioMessages.no_need_check,
        {
          type: 'radio', // or 'checkbox',
          keepIt: false,
          values: [
            {
              title: '😋 Yes',
              value: 'yes',
            },
            {
              title: '😞 No',
              value: 'no',
            },
          ],
        },
        userSystem,
      );
      this.addMessage(newMessage);
    }

    if (
      reply[0].value == 'yes' &&
      (reply[0].messageId == MessageIds.hello_message ||
        reply[0].messageId == MessageIds.no_need_check)
    ) {
      newMessage = this.createNewMessage(
        MessageIds.gender_message,
        ScenarioMessages.gender_message,
        {
          type: 'radio', // or 'checkbox',
          keepIt: false,
          values: [
            {
              title: 'Male',
              value: 'male',
            },
            {
              title: 'Female',
              value: 'female',
            },
          ],
        },
        userSystem,
      );
      this.addMessage(newMessage);
    }

    if (reply[0].value == 'male' || reply[0].value == 'female') {
      this.setState({sex: reply[0].value});
      newMessage = this.createNewMessage(
        MessageIds.gender_answer,
        ScenarioMessages.gender_answer + reply[0].value.toUpperCase(),
        null,
      );
      this.addMessage(newMessage);
      newMessage = this.createNewMessage(
        MessageIds.age_message,
        ScenarioMessages.age_message,
        null,
        userSystem,
      );
      this.setState({ageEntry: true});
      this.addMessage(newMessage);
    }

    if (reply[0].messageId == this.lastItemId) {
      this.evidence.push({
        id: reply[0].messageId,
        choice_id: reply[0].value,
      });

      this.callAPI(this.state.sex, this.state.age, this.evidence);
      return;
    }

    if (
      reply[0].messageId.startsWith('p_') ||
      reply[0].messageId.startsWith('s_')
    ) {
      this.evidence.push({
        id: reply[0].messageId,
        choice_id: reply[0].value,
      });

      if (
        this.responseData.question.type == 'group_single' &&
        reply[0].value == 'present'
      ) {
        for (
          let i = this.currentItemIndex + 1;
          i < this.responseData.question.items.length;
          i++
        ) {
          const item = this.responseData.question.items[i];
          this.evidence.push({
            id: item.id,
            choice_id: 'absent',
          });
        }
        this.callAPI(this.state.sex, this.state.age, this.evidence);
        return;
      }

      this.currentItemIndex++;
      const item = this.responseData.question.items[this.currentItemIndex];
      this.addMessageFromItem(item);
    }
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        isAnimated={true}
        onSend={(messages) => this.onSend(messages)}
        onQuickReply={(reply) => this.onQuickReply(reply)}
        user={{
          _id: 1,
        }}
      />
    );
  }
}
