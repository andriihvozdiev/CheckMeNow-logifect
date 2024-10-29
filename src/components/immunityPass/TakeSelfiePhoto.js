import React, { Component } from 'react';
import { View } from 'native-base';
import { StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { RNCamera } from 'react-native-camera';
import withReduxStore from '../../utils/withReduxStore';
import { vw, vh } from 'react-native-expo-viewport-units';
import ImageEditor from '@react-native-community/image-editor';
import * as _ from 'lodash';
import { Alert } from 'react-native';

class TakeSelfiePhoto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      preview_frame: null,
      isFaceDetected: false,
      faceBounds: null,
      enableFaceDetection: true
		}
	}

  resetFaceDetection = () => {
    this.setState({ enableFaceDetection: true })
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', async () => {
      this.resetFaceDetection()
    })
  }

  takePicture = async () => {
    if (this.camera) {
      if (!this.state.isFaceDetected) {
        Alert.alert(
          'Info',
          'Please make sure the face is in the center.',
          [
            {
              text: 'OK'
            },

          ]);
        return;
      }

      const options = {
        quality: 0.5,
        base64: true,
        imageType: 'jpg',
        mirrorImage: true,
        orientation: RNCamera.Constants.Orientation.portrait,
        fixOrientation: true
      };
      const data = await this.camera.takePictureAsync(options);
      const width_coefficient = data.width / this.state.preview_frame.width;
      const height_coefficient = data.height / this.state.preview_frame.height;

      const cropData = {
        offset: {
          x: this.state.faceBounds.offset.x * width_coefficient,
          y: this.state.faceBounds.offset.y * height_coefficient,
        },
        size: {
          width: this.state.faceBounds.size.width * width_coefficient,
          height: this.state.faceBounds.size.height * height_coefficient
        }
      }

      const url = await ImageEditor.cropImage(data.uri, cropData);

      this.props.updateUser({ documentImage: url })
      this.setState({ enableFaceDetection: false })
      this.props.navigation.push("PictureIsOk");
    }
  };

  debouncePress = onPress => {
    return _.throttle(onPress, 2000, { leading: true, trailing: false })
  }

  componentWillUnmount() {
    console.log("delete photo this.camera;")
    delete this.camera;
  }

  handleFaceDetected = (faceArray) => {
    const faces = faceArray.faces

    if (!faces || faces.length === 0) {
      this.setState({
        isFaceDetected: false
      })
    }

    const prev_width = this.state.preview_frame.width
    const prev_height = this.state.preview_frame.height

    const crop_bounds = {
      x: prev_width * 0.05,
      y: prev_height * 0.05,
      width: prev_width * 0.9,
      height: prev_height * 0.9
    }

    faces.map((face) => {
      const face_bounds = face.bounds
      if (face_bounds.origin.x >= crop_bounds.x &&
        face_bounds.origin.y >= crop_bounds.y &&
        (face_bounds.origin.x + face_bounds.size.width) < (crop_bounds.x + crop_bounds.width) &&
        (face_bounds.origin.y + face_bounds.size.height) < (crop_bounds.y + crop_bounds.height)) {
        this.setState({
          isFaceDetected: true,
          faceBounds: {
            offset: {
              x: (face_bounds.origin.x - 20),
              y: (face_bounds.origin.y - 50),
            },
            size: {
              width: (face_bounds.size.width + 40),
              height: (face_bounds.size.height + 100)
            }
          }
        })
      } else {
        this.setState({
          isFaceDetected: false
        })
      }
    })

  }

  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={(ref) => {
            this.camera = ref;
          }}
          onLayout={(event) => {
            const layout = event.nativeEvent.layout;
            this.setState({ preview_frame: layout });
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
          faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.fast}
          onFacesDetected={this.state.enableFaceDetection? this.handleFaceDetected: null}
        >
          {this.state.isFaceDetected ?
            <View style={{
              position: 'absolute',
              borderWidth: 1,
              borderColor: 'yellow',
              top: this.state.faceBounds.offset.y,
              left: this.state.faceBounds.offset.x,
              width: this.state.faceBounds.size.width,
              height: this.state.faceBounds.size.height
            }}></View> : null}
        </RNCamera>

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            backgroundColor: 'black',
            height: 80,
            paddingTop: 5,
          }}>
          <TouchableOpacity onPress={this.debouncePress(this.takePicture.bind(this))}>
            <View style={[styles.captureBtn]}>
              <View style={this.state.isFaceDetected ? styles.captureBtnInternalEnabled : styles.captureBtnInternalDisabled} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  preview: {
    flex: 6,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 30,
    marginBottom: 30,
  },
  captureBtn: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderRadius: 60,
    borderColor: '#FFFFFF',
  },
  captureBtnInternalEnabled: {
    width: 56,
    height: 56,
    borderWidth: 2,
    borderRadius: 76,
    backgroundColor: 'red',
    borderColor: 'transparent',
  },
  captureBtnInternalDisabled: {
    width: 56,
    height: 56,
    borderWidth: 2,
    borderRadius: 76,
    backgroundColor: 'grey',
    borderColor: 'transparent',
  },
  absoluteContainer: {
    flex: 1,
    position: 'absolute',
    top: StatusBar.height,
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'blue',
  },
  faceEdge: {
    position: 'absolute',
    top: vh(15),
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'yellow',
    width: vw(60),
    height: vw(60),
    borderRadius: 130,
    backgroundColor: 'transparent',
    transform: [{ scaleY: 1.7 }],
  },
  text: {
    fontSize: 24,
    padding: 5,
    backgroundColor: 'grey',
    color: 'black',
    position: 'absolute',
    top: vh(65),
    textAlign: 'center',
    alignSelf: 'center',
  },
  documentViewImage: {
    flex: 1,
    position: 'relative',
    marginTop: 20,
    backgroundColor: 'transparent',
    width: '90%',
    height: undefined,
    aspectRatio: 1.5,
  },
  topLeftEdge: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 25,
    width: 25,
    borderColor: 'red',
    borderLeftWidth: 3,
    borderTopWidth: 3,
    backgroundColor: 'transparent',
  },
  topRightEdge: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: 25,
    width: 25,
    borderColor: 'red',
    borderRightWidth: 3,
    borderTopWidth: 3,
    backgroundColor: 'transparent',
  },
  bottomLeftEdge: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    height: 25,
    width: 25,
    borderColor: 'red',
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    backgroundColor: 'transparent',
  },
  bottomRightEdge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    height: 25,
    width: 25,
    borderColor: 'red',
    borderRightWidth: 3,
    borderBottomWidth: 3,
    backgroundColor: 'transparent',
  },
});

export default withReduxStore(TakeSelfiePhoto);
