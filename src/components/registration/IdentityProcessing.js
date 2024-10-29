import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, Button, Spinner } from 'native-base';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import Colors from '../../constants/colors';
import { connect } from 'react-redux';
import { updateUser } from '../../store/actions';
import { Auth, Storage, API, graphqlOperation } from 'aws-amplify';
import { checkIdentity } from '../../graphql/queries';
import Icon from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';

import RNFS from 'react-native-fs';
import { encode, decode } from 'base64-arraybuffer';

import UserStatus from '../../constants/userStatus';
import withReduxStore from '../../utils/withReduxStore';
import { CommonActions } from '@react-navigation/native';


class IdentityProcessing extends Component {
  constructor(props) {
    super(props);

    this.state = { processing: false };
  }

  async uploadPhotoVideo() {
    const params = this.props.route.params;
    await this.saveDocument(params.photoUri, 'photo');
    await this.saveDocument(params.videoUri, 'video');
  }

  componentWillUnmount = () => {
    this.unsubscribe();
  };

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.props.navigation.dispatch(state => {
        console.log("state")
        console.log(state)
        const routes = state.routes.filter(r => r.name !== 'VideoSelfie');

          return CommonActions.reset({
            ...state,
            routes,
            index: routes.length - 1,
          });
      });
    });

    this.setState({ processing: true });
    this.uploadPhotoVideo().then(() => {
      API.graphql(
        graphqlOperation(checkIdentity, {
          identityCheckInput: {
            operation: 'START',
            firstName: this.props.user.firstName,
            lastName: this.props.user.lastName,
            dateOfBirth: this.props.user.dateOfBirth,
            typeOfDocument: this.props.user.typeOfDocument,
          },
        }),
      ).then((result) => {
        console.log(result);
        result = result.data.checkIdentity;
        const index = result.indexOf('body=') + 5;
        const resultJson = result.substring(index, result.length - 1);
        console.log(resultJson);
        const startResponseData = JSON.parse(resultJson);
        console.log(startResponseData);
        this.pendingInterval = setInterval(() => {
          API.graphql(
            graphqlOperation(checkIdentity, {
              identityCheckInput: {
                operation: 'CHECK',
                jobId: startResponseData.personTrackingJobId,
              },
            }),
          ).then((result) => {
            console.log('Second call');
            console.log(result);
            result = result.data.checkIdentity;
            const index = result.indexOf('body=') + 5;
            const resultJson = result.substring(index, result.length - 1);
            console.log(resultJson);
            const responseData = JSON.parse(resultJson);
            if (responseData.personTrackingData.JobStatus === 'SUCCEEDED') {
              this.setState({ processing: false });
              clearInterval(this.pendingInterval);
              if (responseData.finalResult !== 'SUCCESS') {
                this.setState({ fail: true });
                this.setState({ success: false });
              } else {
                this.props.updateUser({ userStatus: UserStatus.INITIAL })
                this.setState({ success: true });
                this.setState({ fail: false });
              }
            }
          });
        }, 10000);
      });
    });
  }

  saveDocument = async (uri, type) => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      const fileContentBase64 = await RNFS.readFile(uri, 'base64');
      const fileContent = decode(fileContentBase64);
      const parts = uri.split('.');
      const fileExtension = parts[parts.length-1];
      const s3Key = `${user.username}_${type}.${fileExtension}`;
      const result = await Storage.put(s3Key, fileContent, { level: 'private' });
      return result;
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.processing && (
          <>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.title}>Processing your details...</Text>
              <Text style={{ fontSize: 12 }}>
                It may take several minutes. Please wait...
              </Text>
            </View>
            <Spinner style={{ marginTop: '10%' }} />
          </>
        )}

        {this.state.success && (
          <>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Text style={styles.title}>Successful identity check!</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Icon size={150} name="check-circle" color="#3d8af7" />
            </View>
          </>
        )}

        {this.state.fail && (
          <>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Text style={styles.title}>Identity check failed!</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Entypo size={150} name="circle-with-cross" color="red" />
            </View>
          </>
        )}

        <View style={{ marginTop: '10%' }}>
          {!this.state.processing && (
            <Button
              style={styles.buttonContainer}
              primary
              onPress={() => {
                if (this.state.fail)
                  this.props.navigation.push('TypeOfDocument');
                if (this.state.success) {
                  this.props.navigation.push('Main', {
                    previous: 'identity',
                  });
                }
              }}
              block>
              {this.state.success && (
                <Text style={styles.buttonText}>Continue</Text>
              )}
              {this.state.fail && (
                <Text style={styles.buttonText}>Try again</Text>
              )}
            </Button>
          )}
        </View>
        <View style={{ marginTop: 30 }}>
          {!this.state.processing && this.state.fail && (
            <Button
              style={{ backgroundColor: 'transparent', justifyContent: 'center' }}
              onPress={this.handleTakeNewPicture}>
              <Text style={{ color: 'blue' }}>No thanks</Text>
            </Button>
          )}
        </View>
      </View>
    );
  }
}

export default withReduxStore(IdentityProcessing);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: vw(4),
    paddingRight: vw(4),
  },
  title: {
    marginTop: vh(10),
    fontSize: 22,
    fontFamily: 'Verdana',
  },
  content: {
    fontSize: 18,
    fontFamily: 'Verdana',
    marginTop: 60,
    marginBottom: 80,
    textAlign: 'justify',
  },
  buttonsContainer: {
    color: 'white',
    width: '90%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 20,
  },
  noThanks: {
    fontSize: 15,
    color: Colors.link,
    marginTop: 10,
    textAlign: 'center',
  },
});
