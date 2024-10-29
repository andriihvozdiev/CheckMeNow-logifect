import React, { Component } from 'react';
import { View, Text, Button, Icon } from 'native-base';
import { StyleSheet, Image, ActivityIndicator } from 'react-native';
import RNFS from 'react-native-fs';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { encode, decode } from 'base64-arraybuffer';
import { connect } from 'react-redux';
import { updateUser } from '../../store/actions';
import { Auth, Storage } from 'aws-amplify';
import { CommonActions } from '@react-navigation/native';

class DocumentIsReadable extends Component {
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
      const s3Key = `${user.username}_identity.${fileExtension}`;
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
    this.props.navigation.push('VideoSelfie');
  };

  handleTakeNewPicture = async () => {
    this.props.navigation.push('ScanDocument');
  };

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.props.navigation.dispatch(state => {
        console.log("state")
        console.log(state)
        const routes = state.routes.filter(r => r.name !== 'ScanDocument' && r.name !== 'VideoSelfie');
        console.log("routes")
        console.log(routes)
        return CommonActions.reset({
          ...state,
          routes,
          index: 3,
        });
      });
    });
  }

  componentWillUnmount = () => {
    this.unsubscribe();
  };

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.h3}>Document is readable</Text>
        </View>
        <View style={styles.photoContainer}>
          <Image
            style={{ width: '100%', height: '100%', resizeMode: 'stretch' }}
            source={{ uri: this.props.user.documentImage }}
          />
        </View>
        <View>
          <Text style={styles.textContent}>
            Make sure your document details are clear to read, with no blur or
            glare.
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.buttonsIsReadable}>
            <View style={styles.loadingSpinner}>
              <ActivityIndicator
                animating={this.state.isLoading}
                size="large"
                color="#00ff00"
              />
            </View>

            <Button
              disabled={this.state.isLoading}
              block
              style={
                this.state.isLoading
                  ? { backgroundColor: '#999' }
                  : { backgroundColor: 'blue' }
              }
              onPress={this.handleDocumentIsReadable}>
              <Text style={{ ...styles.buttonTextSize, borderColor: 'white', borderWidth: 0.5, padding: 5 }}>
                My document is readable
            </Text>
            </Button>
          </View>
          <View style={styles.buttonTakeNewPicture}>
            <Button
              style={{ backgroundColor: 'transparent' }}
              onPress={this.handleTakeNewPicture}>
              <Text style={{ ...styles.buttonTextSize, color: 'blue' }}>Take a new picture</Text>
            </Button>
          </View>
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
    width: '100%',
    aspectRatio: 1.5,
    borderWidth: 0.3,
    marginTop: '5%',
  },

  textContent: {
    marginTop: '5%',
    textAlign: 'center',
  },
  buttonContainer: {
    flex: 1,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  buttonsIsReadable: {
    marginTop: 30,
    width: '80%',
    textAlign: 'center',

  },
  buttonTakeNewPicture: {
    marginTop: 30,
    borderWidth: 0.5,
  },
  loadingSpinner: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '5%',
  },
});

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

export default connect(mapStateToProps, mapDispatchToProps)(DocumentIsReadable);
