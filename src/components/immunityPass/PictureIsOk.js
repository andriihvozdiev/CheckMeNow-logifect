import React, { Component } from 'react';
import { View, Text, Button, Icon } from 'native-base';
import { StyleSheet, Image, ActivityIndicator } from 'react-native';
import RNFS from 'react-native-fs';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { encode, decode } from 'base64-arraybuffer';
import withReduxStore from '../../utils/withReduxStore';
import { Auth, Storage } from 'aws-amplify';
import { styles as globalStyles } from '../registration/styles';
import { CommonActions } from '@react-navigation/native';
import Colors from '../../constants/colors';

class PictureIsOk extends Component {
  state = {
    fileContent: '',
    isLoading: false,
  };

  saveDocument = async () => {
    try {
      this.setState({ isLoading: true });
      const user = await Auth.currentAuthenticatedUser();
      console.log(user);
      const fileContentBase64 = await RNFS.readFile(
        this.props.user.documentImage,
        'base64',
      );

      const fileContent = decode(fileContentBase64);
      const parts = this.props.user.documentImage.split('.');
      const fileExtension = parts[parts.length - 1];
      console.log("this.props.user.id")
      console.log(this.props.user.id)
      const s3Key = `${this.props.user.id}_face.${fileExtension}`;
      const result = await Storage.put(s3Key, fileContent, { level: 'private' });

      console.log('Result ' + result);
      const file = await Storage.get(s3Key);
      console.log(file);
      this.setState({ isLoading: false });
    } catch (err) {
      console.log(err);
    }
  };

  handleDocumentIsReadable = async () => {
    await this.saveDocument();
    //this.props.updateUser({ isQrCodeReady: true })
    this.props.navigation.push('CertificateDetails');
  };

  handleTakeNewPicture = async () => {
    this.props.navigation.goBack()
  };

  render() {
    return (
      <View style={globalStyles.container}>
        <View style={globalStyles.upperSection}>
          <View style={{ flex: 1 }}>
            <Text style={styles.h3}>Photo is clear</Text>
          </View>
          <View style={styles.photoContainer}>
            <Image
              style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
              source={{ uri: this.props.user.documentImage }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ ...globalStyles.defaultText, textAlign: 'center' }}>
              Make sure your photo is clear and you like it.
            </Text>
          </View>
          <View style={styles.loadingSpinner}>
            <ActivityIndicator
              animating={this.state.isLoading}
              size="small"
              color="#00ff00"
            />
          </View>
        </View>
        <View style={globalStyles.bottomSection}>
          <Button
            primary
            disabled={this.state.isLoading}
            style={this.state.isLoading ? globalStyles.buttonDisabled : globalStyles.button}
            onPress={this.handleDocumentIsReadable}>
            <Text style={this.state.isLoading ?
              { ...globalStyles.buttonTextSize, color: Colors.link } :
              { ...globalStyles.buttonTextSize, color: 'white' }}>
              Accept the picture
            </Text>
          </Button>

          <Text
            style={globalStyles.noThanks}
            onPress={this.handleTakeNewPicture}>Take a new picture</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: vh(5),
    paddingLeft: vw(4),
    paddingRight: vw(4),
    paddingBottom: vh(5),
    alignItems: 'center',
    flex: 1,
  },
  h3: {
    textAlign: 'center',
    fontSize: RFValue(30),
    fontFamily: 'Avenir Next Medium',
  },

  photoContainer: {
    //flex: 1,
    width: '100%',
    height: '60%',
    //aspectRatio: 1,
    //borderWidth: 0.3,
    marginVertical: '2%',
  },

  textContent: {
    marginTop: '5%',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  buttonsIsReadable: {
    //marginTop: 30,
    //width: '80%',
    textAlign: 'center',

  },
  buttonTakeNewPicture: {
    marginTop: 30,
    borderWidth: 0.5,
  },
  loadingSpinner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    //marginBottom: '5%',
  },
});

export default withReduxStore(PictureIsOk);
