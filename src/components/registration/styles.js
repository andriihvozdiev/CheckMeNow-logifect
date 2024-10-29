import { StyleSheet } from 'react-native';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import Colors from '../../constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 6,
    paddingBottom: vh(3),
  },

  firstScreenContainer: {
    flex: 1,
    paddingTop: vh(3),
    paddingHorizontal: vw(5),
    paddingBottom: vh(5),
  },
  h3: {
    fontSize: RFValue(25),
    fontFamily: 'Avenir Next Medium',
    textAlign: 'center',
  },
  chatBotText: {
    fontSize: RFPercentage(2.4),
    fontFamily: 'Avenir Next Medium',
  },
  defaultText: {
    fontSize: RFPercentage(2.4),
    fontFamily: 'Avenir Next Medium',
  },
  profileText: {
    fontSize: vw(4.7),
    fontFamily: 'Avenir Next Medium',
  },
  smallText: {
    fontSize: RFPercentage(2.2),
    fontFamily: 'Avenir Next Medium',
  },
  buttonTextSize: {
    fontSize: RFPercentage(2.4),
    fontFamily: 'Avenir Next Medium',
  },
  upperSection: {
    flex: 5,
    backgroundColor: 'white',
    paddingTop: vh(3),
    paddingHorizontal: vw(5),
  },
  bottomSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: vw(4)
  },
  link: {
    color: Colors.link,
  },
  additionalOptions: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  message: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  error: {
    color: Colors.error,
    fontSize: RFPercentage(2.1),
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
    width: '95%',
    height: vh(7),
    shadowOpacity: 0.2,
    shadowOffset: { width: 3, height: 3 },
    backgroundColor: '#136AC7',
    borderRadius: 5,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonDisabled: {
    width: '95%',
    height: vh(7),
    shadowOpacity: 0.2,
    shadowOffset: { width: 3, height: 3 },
    backgroundColor: '#FFF',
    borderRadius: 5,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  noThanks: {
    fontSize: RFPercentage(2.4),
    fontFamily: 'Avenir Next Medium',
    color: Colors.link,
    marginTop: 15,
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
    width: '95%',
  },
  fontAvenir: {
    fontFamily: 'Avenir Next Medium',
  },
  messageInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  securityList: {
    marginTop: '10%',
    height: '90%'
  },
});
