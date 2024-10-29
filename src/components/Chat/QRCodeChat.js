import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import withReduxStore from '../../utils/withReduxStore'


class QRCodeChat extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.getDataURL();
  }
  getDataURL = () => {
    this.svg.toDataURL(dataURL => this.props.onGetDataURL ? this.props.onGetDataURL(dataURL) : null);
  }

  render() {
    return (
      <View style={styles.qrCode}>
        <QRCode
          value={this.props.value}
          logoMargin={4}
          logoBackgroundColor='white'
          logo={require("../../../assets/bird_alone.png")} size={this.props.size}
          getRef={(c) => { this.svg = c }} />
      </View>
    );
  };
}
const styles = StyleSheet.create({
  qrCode: {
    //flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    //marginTop: 20,
  },
});

export default withReduxStore(QRCodeChat);
