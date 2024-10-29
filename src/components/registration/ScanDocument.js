import React, { Component } from 'react';
import { View, Text, Button, Icon } from 'native-base';
import { StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { RNCamera } from 'react-native-camera';
import withReduxStore from '../../utils/withReduxStore';
import ImageEditor from '@react-native-community/image-editor';
import { Dimensions } from 'react-native';
import { styles as globalStyles } from './styles';
import { Platform } from "react-native";

const view_width = Dimensions.get('window').width;
const view_height = Dimensions.get('window').height;

class ScanDocument extends Component {
  takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);

      console.log("data")
      console.log(data)
      const img_width = data.width;
      const img_height = data.height;
      const width_coefficient = data.width / this.state.preview_frame.width;
      const height_coefficient = data.height / this.state.preview_frame.height;

      const x_offset_img = this.state.document_frame.x * width_coefficient;
      const y_offset_img = this.state.document_frame.y * height_coefficient;

      const crop_width = this.state.document_frame.width * width_coefficient;
      const crop_height = this.state.document_frame.height * height_coefficient;

      //console.log(data);
      const cropData = {
        offset: { x: x_offset_img, y: y_offset_img },
        size: { width: crop_width, height: crop_height }
      };
      console.log("cropData");
      console.log(cropData);
      //if (Platform.OS === "ios") {
      ImageEditor.cropImage(data.uri, cropData).then((url) => {
        this.props.updateUser({ documentImage: url })
        this.props.navigation.push("DocumentIsReadable");
        console.log('Cropped image uri', url);
      });
      /* } else {
        this.props.updateUser({ documentImage: data.uri })
        this.props.navigation.push("DocumentIsReadable");
      } */
    }
  };

  componentWillUnmount() {
    console.log("delete photo this.camera;")
    delete this.camera;
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
          type={RNCamera.Constants.Type.back}
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
        />
        <View style={styles.absoluteContainer}>
          <View style={styles.documentViewImage}
            onLayout={(event) => {
              const layout = event.nativeEvent.layout;
              this.setState({ document_frame: layout });
            }}
          >
            <View
              style={styles.topLeftEdge}
              onLayout={(event) => {
                const layout = event.nativeEvent.layout;
                this.setState({ x_corner: layout.x, y_corner: layout.y });
                console.log("layout rect")
                console.log(layout)
              }}></View>
            <View style={styles.topRightEdge}></View>
            <View style={styles.bottomLeftEdge}></View>
            <View style={styles.bottomRightEdge}></View>
          </View>
          <View>
            <Text style={[globalStyles.defaultText, styles.text]}>
              Position the front of document inside the frame
            </Text>
          </View>
        </View>

        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            justifyContent: 'center',
            backgroundColor: 'black',
            height: '10%',
          }}>
          <TouchableOpacity onPress={this.takePicture.bind(this)}>
            <View style={[styles.captureBtn]}>
              <View style={styles.captureBtnInternal} />
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
    flex: 1,
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
  absoluteContainer: {
    flex: 1,
    position: 'absolute',
    top: StatusBar.height,
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'transparent',
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
  text: {
    color: 'white',
    marginTop: 70,
    alignSelf: 'center',
  },
});

export default withReduxStore(ScanDocument);
