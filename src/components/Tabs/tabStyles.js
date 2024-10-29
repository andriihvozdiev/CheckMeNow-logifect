import { StyleSheet } from 'react-native';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import Colors from '../../constants/colors';

export const tabStyles = StyleSheet.create({
    logoTalkToCheckie: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: vw(5),
    },
    logoImageLink: {
        height: 20,
        width: 20,
        resizeMode: 'contain',
    },
    logoImage: {
        marginTop: vh(3),
        marginLeft: vh(2),
        width: 100,
        height: 80,
    },
    talkToCheckie: {
        paddingLeft: vw(3),
        paddingTop: vh(2),
        paddingBottom: vh(2),
        backgroundColor: 'white',
        width: '100%'
    },
    Card: {
        flex: 1,
        marginTop: '5%',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.borderColor,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 6,
        shadowOpacity: 0.06,
        borderRadius: 6,
        elevation: 1,
        zIndex: 1,
    },
    cardContainer: {
        alignItems: 'center',
        width: '100%',
        padding: vh(3),
        shadowOpacity: 0.2,
        shadowOffset: { width: 3, height: 3 },
        shadowRadius: 6,
        borderRadius: 6,
        elevation: 1,
        zIndex: 1,
    },
    cardContainer: {
        height: '39%',
        width: '91%',
    },
});