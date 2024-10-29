/**
 * Security Question created by Luke
 * on 2021/03/12
 */
import React, { Component } from 'react';
import { StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { View, Text, Button, Input, Item, List, ListItem } from 'native-base';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import { Auth } from 'aws-amplify';
import { connect } from 'react-redux';
import { updateUser } from '../../store/actions';
import { styles } from './styles';
import Feather from 'react-native-vector-icons/Feather';
import userDA from '../../da/user';
import Icon from 'react-native-vector-icons/FontAwesome';
import Session from '../../utils/Session';
import biometrics from '../../utils/biometrics';
import { FlatList } from 'react-native-gesture-handler';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import colors from '../../constants/colors';

class SecurityQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: '',
      selectedQuestionIndex: -1,
      questions: [
        'What is your mother\'s maiden name?',
        'What is the name of your first pet?',
        'What was your first car?',
        'What elementary school did you attend?',
        'What is the name of the town where you were born?'
      ]
    };
  }

  selectSecurityQuestion = async () => {
    this.props.navigation.navigate('AnswerSecurityQuestion', {
      question: this.state.question
    });
  };

  onPressList = (data, index) => {
    this.setState({ question: data, selectedQuestionIndex: index });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.upperSection}>
          <Text style={styles.h3}>Choose a security question</Text>
          <FlatList
            style={styles.securityList}
            extraData={this.state.selectedQuestionIndex}
            data={this.state.questions}
            keyExtractor={(item, index) => String(index)}
            renderItem={({ item, index }) => {
              return (
                <ListItem
                  style={{ borderColor: 'transparent' }}
                  onPress={() => this.onPressList(item, index)} >
                  <Text style={styles.defaultText} multiline='true'>
                    {item}
                  </Text>
                  {this.state.selectedQuestionIndex === index &&
                    <Icon
                      size={20}
                      name='check-circle'
                      color={colors.blue}
                      style={{ marginLeft: 6 }}
                    />
                  }
                </ListItem>
              )
            }}
          />
        </View>
        <View style={styles.bottomSection}>
          <Button
            disabled={!this.state.question}
            style={this.state.question ? styles.button : styles.buttonDisabled}
            onPress={this.selectSecurityQuestion}>
            <Text style={this.state.question ? { ...styles.buttonTextSize, color: 'white' } : { ...styles.buttonTextSize, color: colors.link }}>Continue</Text>
          </Button>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  // Action
  return {
    // update user
    updateUser: (user) => dispatch(updateUser(user)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SecurityQuestion);
