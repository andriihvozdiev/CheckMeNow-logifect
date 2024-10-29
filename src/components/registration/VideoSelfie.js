import React, { Component } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Animated, Text, View, Platform } from 'react-native';
import { Spinner } from 'native-base';

import {
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StatusBar,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { connect } from 'react-redux';
import { updateUser } from '../../store/actions';
import { Dimensions } from 'react-native';
//import RNFS from 'react-native-fs';
//import { encode, decode } from 'base64-arraybuffer';
//import { Auth, Storage } from 'aws-amplify';

const states = {
  STRAIGHT: 'STRAIGHT',
  YAW: 'YAW',
  PITCH: 'PITCH',
  ROLL: 'ROLL',
};

const texts = {
  STRAIGHT: 'Position your face in the oval',
  YAW: 'Turn the head left and right',
  PITCH: 'Pitch the head up and down',
  ROLL: 'Bend the head on left shoulder and right shoulder',
};

const FlashingText = (props) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    console.log('FlashingText capturing:' + props.capturing);
    if (props.capturing) {
      const opacityAnimation = Animated.timing(opacity, {
        toValue: 1,
        duration: 1600,
        useNativeDriver: true,
      });

      Animated.loop(opacityAnimation).start();
      return function cleanup() {
        if (opacityAnimation) opacityAnimation.stop();
      };
    }
  }, [props.capturing]);

  return (
    <Animated.Text
      style={{
        opacity: opacity.interpolate({
          inputRange: [0, 0.3, 0.31, 0.8, 1],
          outputRange: [0, 0, 1, 1, 1],
        }),
        ...props.style,
      }}>
      {props.children}
    </Animated.Text>
  );
};

const Progress = (props) => {
  let width = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    console.log('Progress capturing:' + props.capturing);
    let widthLoopAnimation = null;
    if (props.capturing) {
      console.log('start');
      const widthAnimation = Animated.timing(width, {
        toValue: 100,
        duration: 10000,
        useNativeDriver: false,
      });

      widthLoopAnimation = Animated.loop(widthAnimation).start();

      return function cleanup() {
        if (widthLoopAnimation) widthLoopAnimation.stop();
      };
    }
  }, [props.capturing]);

  return (
    <Animated.View
      style={{
        width: width.interpolate({
          inputRange: [0, 100],
          outputRange: ['0%', '100%'],
        }),
        ...styles.progress,
      }}></Animated.View>
  );
};

class VideoSelfie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      capturing: false,
      textState: states.STRAIGHT,
      text: texts[states.STRAIGHT],
    };
    this.startCapturing = this.startCapturing.bind(this);
  }

  componentDidMount() {
    console.log("componentDidMount Capturing:")
    this.startCapturing();
  }

  componentDidUpdate() {
    if (this.state.capturing && !this.changeInterval) {
      this.changeInterval = setInterval(() => {
        switch (this.state.textState) {
          case states.STRAIGHT:
            this.setState({ textState: states.PITCH, text: texts[states.PITCH] });
            break;
          case states.PITCH:
            this.setState({ textState: states.YAW, text: texts[states.YAW] });
            break;
          case states.YAW:
          default:
            this.setState({ textState: states.ROLL, text: texts[states.ROLL] });
        }
      }, 10000);

      this.stopInterval = setTimeout(() => {
        this.camera.stopRecording();
        this.setState({ capturing: false });
        console.log('componentDidUpdate start stopRecording')
        if (this.changeInterval) clearInterval(this.changeInterval);
      }, 40000);
    }
  }

  componentWillUnmount() {
    clearInterval(this.changeInterval);
    clearInterval(this.stopInterval);
    console.log("delete video this.camera;")
    delete this.camera;
  }

  /* saveDocument = async (uri, type) => {
     try {
       const user = await Auth.currentAuthenticatedUser();
       const fileContentBase64 = await RNFS.readFile(uri, 'base64');
       const fileContent = decode(fileContentBase64);
       const fileExtension = uri.split('.')[1];
       const s3Key = `${user.username}_${type}.${fileExtension}`;
       const result = await Storage.put(s3Key, fileContent, { level: 'private' });
       return result;
     } catch (err) {
       console.log(err);
     }
   };*/

  startCapturing = async () => {
    if (!this.state.capturing) {
      this.setState({ capturing: true });
      setTimeout(async () => {
        if (this.camera) {
          let videoOptions = null;
          if (Platform.OS === 'ios') {
            videoOptions = {
              quality: RNCamera.Constants.VideoQuality['720p'],
              codec: RNCamera.Constants.VideoCodec['H264'],
              orientation: 'portrait',
            };
          } else {
            videoOptions = {
              quality: RNCamera.Constants.VideoQuality['720p'],
              orientation: 'portrait',
            };
          }

          const photoOptions = { quality: 0.5, base64: true };
          const photoData = await this.camera.takePictureAsync(photoOptions);
          const videoData = await this.camera.recordAsync(videoOptions);
          if(this.camera)
          this.props.navigation.push('IdentityProcessing', {
            videoUri: videoData.uri,
            photoUri: photoData.uri,
          });
        }
      }, 5000);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={(ref) => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.front}
          flashMode={RNCamera.Constants.FlashMode.off}
          captureAudio={false}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          onCameraReady={(ready) => {
            console.log(ready);
            //this.camera.getCameraIds().then(cameras=>console.log(cameras))
          }}
          onMountError={(err) => console.log(err)}
          onStatusChange={(status) => console.log(status)}
        />

        <View style={styles.absoluteContainer}>
          <View style={styles.faceEdge}></View>
          {this.state.uploading && (
            <FlashingText
              capturing={true}
              style={{
                position: 'absolute',
                padding: 5,
                backgroundColor: 'white',
                top: 480,
              }}>
              <Text style={styles.text}>Processing...</Text>
            </FlashingText>
          )}
          {this.state.capturing && (
            <>
              <FlashingText
                capturing={this.state.capturing}
                style={{
                  position: 'absolute',
                  padding: 5,
                  backgroundColor: 'white',
                  top: 480,
                }}>
                <Text style={styles.text}>{this.state.text}</Text>
              </FlashingText>

              <View style={{ marginTop: '5%', width: '100%' }}>
                <Progress capturing={this.state.capturing} />
              </View>
            </>
          )}
        </View>

        {/* <View
          style={{
            flex: 0,
            flexDirection: 'row',
            justifyContent: 'center',
            backgroundColor: 'black',
            height:'10%'
          }}>
            {this.state.uploading && <Spinner/>}

          <TouchableOpacity
            onPress={this.startCapturing.bind(this)}>
              <View style={[styles.captureBtn, this.state.capturing && styles.captureBtnActive]}>
                        {this.state.capturing && <View style={styles.captureBtnInternal} />}
                    </View>
          </TouchableOpacity>
        </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    height: '100%',
  },
  preview: {
    flex: 10,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  absoluteContainer: {
    flex: 1,
    position: 'absolute',
    top: StatusBar.height,
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'transparent',
  },
  captureBtn: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderRadius: 60,
    borderColor: '#FFFFFF',
  },
  captureBtnActive: {
    width: 60,
    height: 60,
  },
  captureBtnInternal: {
    width: 56,
    height: 56,
    borderWidth: 2,
    borderRadius: 76,
    backgroundColor: 'red',
    borderColor: 'transparent',
  },
  faceEdge: {
    position: 'absolute',
    top: 120,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'yellow',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'transparent',
    transform: [{ scaleY: 1.7 }],
  },
  text: {
    fontSize: 22,
    color: 'black',
    position: 'absolute',
    top: 480,
    textAlign: 'center',
    alignSelf: 'center',
  },
  progress: {
    position: 'absolute',
    top: 530,
    left: 0,
    borderColor: 'yellow',
    borderTopWidth: 3,
    backgroundColor: 'transparent',
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

export default connect(mapStateToProps, mapDispatchToProps)(VideoSelfie);
