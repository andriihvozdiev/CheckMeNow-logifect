import { Auth } from 'aws-amplify';
import userDA from '../da/user';
import pushNotification from './pushNotification';
import { Platform } from "react-native";
import biometrics from './biometrics'
import { getUniqueId, isEmulator } from 'react-native-device-info';

export default class Session {
  static updateUserStatus(username, initUserFromDb) {
    userDA.getByEmail(username).then((user) => {
      if (user) {
        initUserFromDb({ userStatus: user.userStatus });
      }
    });
  }

  static async registerNotificationWithPromise() {

    const emulator = await isEmulator();
    if (emulator) {
      console.log("==Emulator==")
      return null;
    } else {
      console.log("==real device==")
      const promise = new Promise((resolve, reject) => {
        pushNotification.registerNotification((pushNotificationToken) => {
          resolve(pushNotificationToken);
        });
      });
      return promise;
    }
  }

  static async signIn(username, password, initUserFromDb, updateUser) {
    try {
      await Auth.signIn(username, password, { device_id: getUniqueId() });
      const user = await userDA.getByEmail(username);
      if (user) {
        initUserFromDb({
          id: user.id,
          sessionState: 'signIn',
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          dateOfBirth: user.dateOfBirth,
          vaccinationDate: user.vaccinationDate,
          vaccinationCenter: user.vaccinationCenter,
          postCode: user.postCode,
          typeOfDocument: user.typeOfDocument,
          nationality: user.nationality,
          userStatus: user.userStatus,
          chatState: user.chatState,
          sideEffects: user.sideEffects,
          sideEffectsDialogState: user.sideEffectsDialogState,
          isSideEffectScenarioCompleted: user.isSideEffectScenarioCompleted,
          isQrCodeReady: user.isQrCodeReady,
          certificate: user.certificate,
          vaccineDetails: user.vaccineDetails,
          consents: user.consents
        });
        Session.registerNotification(user, username, updateUser);
      } else {
        updateUser({
          sessionState: 'signIn',
          email: username,
          userStatus: 'NO_NHS_LINKAGE',
          isTester: true
        });
        Session.registerNotification(user, username, updateUser);
      }
    } catch (err) {
      console.log('============', err);
      throw err;
    };
  }

  static async registerNotification(user, username, updateUser) {
    if (user) {
      console.log("+++++++++++++++", user)
      const pushNotificationToken = await Session.registerNotificationWithPromise();
      console.log("pushNotificationToken:", pushNotificationToken);
      if (!user.pushNotificationToken || user.pushNotificationToken != pushNotificationToken) {
        updateUser({
          pushNotificationToken: pushNotificationToken,
          pushNotificationService: Platform.OS == "ios" ? (__DEV__ ? "APNS_SANDBOX" : "APNS") : "GCM"
        });
      }
    } else {
      console.log("pushNotificationToken")
      const pushNotificationToken = await Session.registerNotificationWithPromise();
      console.log("pushNotificationToken:", pushNotificationToken);
      updateUser({
        sessionState: 'signIn',
        email: username,
        userStatus: 'NO_NHS_LINKAGE',
        isTester: true,
        pushNotificationToken: pushNotificationToken,
        pushNotificationService: Platform.OS == "ios" ? (__DEV__ ? "APNS_SANDBOX" : "APNS") : "GCM"
      });
    }
  }

  static async init(username, initUserFromDb, updateUser) {
    try {
      console.log("======session init=======")
      const user = await userDA.getByEmail(username);
      if (user) {
        console.log('user');
        console.log(user);
        initUserFromDb({
          id: user.id,
          sessionState: 'signIn',
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          dateOfBirth: user.dateOfBirth,
          vaccinationDate: user.vaccinationDate,
          vaccinationCenter: user.vaccinationCenter,
          postCode: user.postCode,
          typeOfDocument: user.typeOfDocument,
          nationality: user.nationality,
          userStatus: user.userStatus,
          chatState: user.chatState,
          sideEffects: user.sideEffects,
          sideEffectsDialogState: user.sideEffectsDialogState,
          isSideEffectScenarioCompleted: user.isSideEffectScenarioCompleted,
          isQrCodeReady: user.isQrCodeReady,
          certificate: user.certificate,
          vaccineDetails: user.vaccineDetails,
          consents: user.consents
        });
        Session.registerNotification(user, username, updateUser);
      } else {
        updateUser({
          sessionState: 'signIn',
          email: username,
          userStatus: 'NO_NHS_LINKAGE',
          isTester: true,
        });
        Session.registerNotification(user, username, updateUser);
      }
      console.log('LOGIN:');
    }
    catch (err) {
      console.log(err);
      throw err;
    };
  }
}