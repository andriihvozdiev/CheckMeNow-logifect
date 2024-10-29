import React, { Component } from 'react';
import { View, Text, Button } from 'native-base';
import { StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { RNCamera } from 'react-native-camera';
import withReduxStore from '../../utils/withReduxStore'
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import Colors from '../../constants/colors';

class ScanLinkageKey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canDetectText: true,
      textBlocks: [],
      img_width: null,
      img_height: null,
      preview_frame: null,
      scan_frame: null,
      cropData: null,
      key: null,
    }
  }

  componentWillUnmount() {
    console.log("delete photo this.camera;")
    delete this.camera;
  }

  textRecognized = (object) => {
    const x_offset_img = (this.state.scan_frame.x + this.state.scan_frame.width * 0.1);
    const y_offset_img = this.state.scan_frame.y;

    const crop_width = this.state.scan_frame.width * 0.8;
    const crop_height = this.state.scan_frame.height;

    const cropData = {
      x: x_offset_img,
      y: y_offset_img,
      width: crop_width,
      height: crop_height
    }

    const { textBlocks } = object;
    this.setState({ textBlocks: textBlocks });

    this.detectText(textBlocks, cropData);
  };

  detectText = (textBlocks, cropData) => {
    if (textBlocks == undefined) return
    textBlocks.map((item) => {
      if (item.components != null) {
        this.detectText(item.components, cropData)
      }
      const item_bounds = {
        x: item.bounds.origin.x,
        y: item.bounds.origin.y,
        width: item.bounds.size.width,
        height: item.bounds.size.height
      }
      if (this.isInCameraRect(item_bounds, cropData)) {
        return item.value.split(" ").map((text) => {
          if (text.length > 5) {
            this.setState({
              key: text
            })
          }
        })
      } else {
        return
      }
    })
  }

  isInCameraRect = (detectedRect, cropData) => {
    if (detectedRect.y > cropData.y &&
      detectedRect.y + detectedRect.height < cropData.y + cropData.height &&
      detectedRect.x > cropData.x &&
      detectedRect.x + detectedRect.width < cropData.x + cropData.width) {
      return true;
    }
    return false;
  }

  showTitle = () => {
    switch (this.props.route.params.type) {
      case 'linkageKey':
        return <Text style={styles.camera_title}>Scan Linkage Key</Text>
      case 'accountID':
        return <Text style={styles.camera_title}>Scan Account ID</Text>
      case 'gpOdsCode':
        return <Text style={styles.camera_title}>Scan GP ODS Code</Text>
      default:
        return <Text style={styles.camera_title}>Scan Linkage Key</Text>;
    }
  }

  goNext = () => {
    this.props.navigation.navigate('InsertLinkageKey', {
      key: this.state.key,
      type: this.props.route.params.type
    })
  }


  render() {
    const maskRowHeight = 40;
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
          style={styles.camera_preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.off}
          captureAudio={false}
          playSoundOnCapture={false}
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
          onTextRecognized={this.state.canDetectText ? this.textRecognized : null}>
          {this.showTitle()}
        </RNCamera>

        <View style={styles.maskOutter}>
          <View style={[{ flex: maskRowHeight }, styles.maskRow, styles.maskFrame]} />
          <View style={[{ flex: 10 }, styles.maskCenter]}
            onLayout={(event) => {
              const layout = event.nativeEvent.layout;
              this.setState({ scan_frame: layout });
            }}>
            <View style={[{ flex: 10 }, styles.maskFrame]} />
            <View style={[{ flex: 80 }, styles.maskInner]}
              onLayout={(event) => {
                const layout = event.nativeEvent.layout;
                this.setState({
                  scan_x: layout.x,
                  scan_width: layout.width,
                  scan_height: layout.height,
                });
              }} />
            <View style={[{ flex: 10 }, styles.maskFrame]} />
          </View>
          <View style={[{ flex: maskRowHeight }, styles.maskRow, styles.maskFrame]} />
        </View>

        { this.state.key ?
          <View style={styles.detectedView} >
            <Text style={styles.normalText}>{this.state.key}</Text>
          </View>
          : null}

        <View style={styles.bottomSection}>
          <Button
            disabled={this.state.key == null}
            style={this.state.key ? styles.button : styles.buttonDisabled}
            onPress={() => this.goNext()}>
            <Text style={this.state.key ? { color: 'white' } : { color: Colors.link }}>Continue</Text>
          </Button>
        </View>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  maskOutter: {
    position: 'absolute',
    top: StatusBar.height,
    left: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  maskInner: {
    backgroundColor: 'transparent',
    borderColor: 'red',
    borderWidth: 1,
  },
  maskFrame: {
    backgroundColor: 'rgba(1,1,1,0.6)',
  },
  maskRow: {
    width: '100%',
  },
  maskCenter: {
    flexDirection: 'row'
  },
  camera_title: {
    marginTop: 80,
    padding: 10,
    fontSize: 24,
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
    backgroundColor: '#cccccc'
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#ddcccccc'
  },
  camera_preview: {
    flex: 1,
    alignItems: 'center',
  },
  detectedView: {
    position: 'absolute',
    bottom: '15%',
    left: '5%',
    width: '90%',
    borderColor: '#90EE90',
    borderWidth: 1,
    paddingVertical: 4
  },
  normalText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center'
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'black',
    height: '10%',
  },
  button: {
    width: '95%',
    height: vh(6),
    shadowOpacity: 0.2,
    shadowOffset: { width: 3, height: 3 },
    backgroundColor: '#136AC7',
    borderRadius: 5,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonDisabled: {
    width: '95%',
    height: vh(6),
    shadowOpacity: 0.2,
    shadowOffset: { width: 3, height: 3 },
    backgroundColor: '#FFF',
    borderRadius: 5,
    justifyContent: 'center',
    alignSelf: 'center',
  },
});

export default withReduxStore(ScanLinkageKey);
