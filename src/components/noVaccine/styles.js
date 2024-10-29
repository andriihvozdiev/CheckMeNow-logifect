import { StyleSheet } from 'react-native';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import Colors from '../../constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: vh(3),
    paddingLeft: vw(4),
    paddingRight: vw(4),
    paddingBottom: vh(5),
  },
  h3: {
    fontSize: RFValue(25),
    fontFamily: 'Avenir Next Medium',
    textAlign: 'center',
  },
  chatBotText: {
    fontSize: RFValue(14),
    fontFamily: 'Avenir Next Medium',
  },
  defaultText: {
    fontSize: RFValue(17),
    fontFamily: 'Avenir Next Medium',
  },
  smallText: {
    fontSize: RFValue(13),
    fontFamily: 'Avenir Next Medium',
  },
  bottomSection: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  link: {
    color: Colors.link,
  },
  additionalOptions: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  message: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  error: {
    color: Colors.error,
    fontSize: 14,
    alignSelf: 'center',
  },
  link: {
    color: Colors.link,
  },
  input: {
    width: '100%',
    marginTop: '35%',
  },
  button: {
    backgroundColor: '#136AC7',
    borderRadius: 5,
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#999',
    borderRadius: 5,
    justifyContent: 'center',
  },
  noThanks: {
    fontSize: 13,
    color: Colors.link,
    marginTop: 10,
    textAlign: 'center',
  },
  logoUser: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '10%',
  },
  settingsProfile: {
    flex: 1,
    alignItems: 'stretch',
    marginTop: '5%',
    width: '90%',
  },
  fontAvenir: {
    fontFamily: 'Avenir Next Medium',
  },
  messageInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
