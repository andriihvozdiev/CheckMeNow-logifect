import React, { Component } from 'react';
import {
  Container,
  Content,
  Button,
  Input,
  Item,
  Text,
  Picker,
  View,
  Icon,
  ListItem,
} from 'native-base';
import { styles } from './styles';
import { ActionMessage, ErrorMessage } from '../../utils/component_utils';
import { isPostCodeValid } from '../../utils/validation';
import { connect } from 'react-redux';
import { updateUser } from '../../store/actions';
import Colors from '../../constants/colors';
import Nationalities from '../../constants/nationalities';
import TypeOfDocuments from '../../constants/typeOfDocuments';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

class TypeOfDocument extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nationality: this.props.user.nationality || Nationalities[0],
      typeOfDocument: this.props.user.typeOfDocument || TypeOfDocuments[0],
      postCode: this.props.user.postCode || '',
      validation: false,
    };
  }

  setNationality = (value) => {
    this.setState({
      nationality: value,
    });
  };

  setTypeOfDocument = (value) => {
    this.setState({
      typeOfDocument: value,
    });
  };

  onPostCodeChange(value) {
    this.setState({
      postCode: value,
      validation: false,
    });
  }

  checkTypeOfDocumentsHandler = () => {
    this.props.updateUser({
      nationality: this.state.nationality,
      typeOfDocument: this.state.typeOfDocument,
      postCode: this.state.postCode,
    });
    console.log(this.state.postCode);
    this.setState({
      validation: true,
    });
    if (
      !isPostCodeValid(this.state.postCode) &&
      this.state.typeOfDocument === 'Passport'
    ) {
      return;
    }

    this.props.navigation.push('ScanDocument');
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.upperSection}>
          <View style={{ flex: 1 }}>
            <Text style={styles.h3}>Type of Document</Text>
          </View>
          <View style={{ flex: 2 }}>
            <View>
              <Text style={styles.smallText}>Nationality: </Text>

              <View
                style={{
                  alignItems: 'stretch',
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.borderColor,
                }}>
                <Picker
                  mode="dropdown"
                  iosIcon={<EvilIcons name="chevron-down" />}
                  placeholder="Select your Nationality"
                  placeholderStyle={{
                    color: '#bfc6ea',
                  }}
                  placeholderIconColor="#007aff"
                  selectedValue={this.state.nationality}
                  onValueChange={this.setNationality}>
                  {Nationalities.map((nationalityItem) => {
                    return (
                      <Picker.Item
                        key={nationalityItem}
                        label={nationalityItem}
                        value={nationalityItem}
                      />
                    );
                  })}
                </Picker>
              </View>
            </View>

            <View>
              <Text style={{ ...styles.smallText, marginTop: 20 }}>
                Type of Document:{' '}
              </Text>
              <View
                style={{
                  alignItems: 'stretch',
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.borderColor,
                }}>
                <Picker
                  mode="dropdown"
                  iosIcon={<EvilIcons name="chevron-down" />}
                  placeholder="Select type of document"
                  placeholderStyle={{
                    color: '#bfc6ea',
                  }}
                  placeholderIconColor="#007aff"
                  selectedValue={this.state.typeOfDocument}
                  onValueChange={this.setTypeOfDocument}>
                  {TypeOfDocuments.map((typeOfDocumentItem) => {
                    return (
                      <Picker.Item
                        key={typeOfDocumentItem}
                        label={typeOfDocumentItem}
                        value={typeOfDocumentItem}
                      />
                    );
                  })}
                </Picker>
              </View>
            </View>

            {this.state.typeOfDocument === 'Passport' ? (
              <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                <View>
                  <Item>
                    <Input
                      placeholder="Enter post code..."
                      autoCapitalize="characters"
                      maxLength={7}
                      value={this.state.postCode}
                      onChangeText={this.onPostCodeChange.bind(this)}
                    />
                  </Item>
                </View>
                <View style={{ marginTop: 10 }}>
                  <ErrorMessage
                    show={
                      this.state.validation &&
                      !isPostCodeValid(this.state.postCode)
                    }>
                    Post Code is not valid
                </ErrorMessage>
                </View>
              </View>
            ) : null}
          </View>
        </View>
        <View style={styles.bottomSection}>
          <Button onPress={this.checkTypeOfDocumentsHandler} block>
            <Text>Continue</Text>
          </Button>
          <Text
            style={styles.noThanks}
            onPress={() => this.props.navigation.push('Main')}>
            No thanks
          </Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(TypeOfDocument);
