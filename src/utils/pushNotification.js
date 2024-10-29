import PushNotification from '@aws-amplify/pushnotification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotificationAndroid from "react-native-push-notification";
import { Platform } from "react-native";
import Auth from '@aws-amplify/auth';
import Session from '../utils/Session';
import {initUserFromDb} from '../store/actions';
import store from "../store";

export default class PushNotificationTools {
    static registerNotification = (callback) => {
        console.log("Platform.OS")
        console.log(Platform)
        //if (Platform.OS === "ios") {
        //    this.registerIOS(callback);
        //} else {
            this.registerAndroid(callback);
        //}
    }

    static registerIOS = (callback) => {

        // get the notification data when notification is received
        PushNotification.onNotification((notification) => {
            // Note that the notification object structure is different from Android and IOS
            console.log('in app notification', notification);

            // required on iOS only (see fetchCompletionHandler docs: https://github.com/react-native-community/push-notification-ios#finish)
            if (Platform.OS === 'ios') {
                notification.finish(PushNotificationIOS.FetchResult.NoData);
            }
        });

        if (Platform.OS === 'ios') {
            PushNotification.requestIOSPermissions()
        }

        // get the registration token
        // This will only be triggered when the token is generated or updated.
        PushNotification.onRegister((token) => {
            console.log('in app registration', token);
            callback(token)
            //PushNotification.updateEndpoint(token)
        });

        // get the notification data when notification is opened
        PushNotification.onNotificationOpened((notification) => {
            console.log('the notification is opened', notification);
        });
    }

    static registerAndroid = (callback) => {
        // Must be outside of any component LifeCycle (such as `componentDidMount`).
        PushNotificationAndroid.configure({
            // (optional) Called when Token is generated (iOS and Android)
            onRegister: function (tokenObject) {
                console.log("TOKEN:", tokenObject);
                callback(tokenObject.token, tokenObject.os);
            },

            // (required) Called when a remote is received or opened, or local notification is opened
            onNotification: function (notification) {
                console.log("NOTIFICATION:", notification.data);

                // process the notification
                if (Platform.OS !== "ios") {
                    PushNotificationTools.addNotificationRequest({
                        title: notification.data["pinpoint.notification.title"],
                        body: notification.data["pinpoint.notification.body"],
                    });
                }

                Auth.currentAuthenticatedUser().then(user=>{
                    Session.updateUserStatus(user.attributes.email,(user) => store.dispatch(initUserFromDb(user)))
                    notification.finish(PushNotificationIOS.FetchResult.NoData);
                });
                // (required) Called when a remote is received or opened, or local notification is opened
            },

            // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
            onAction: function (notification) {
                console.log("ACTION:", notification.action);
                console.log("NOTIFICATION:", notification);
                // process the action
            },

            // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
            onRegistrationError: function (err) {
                console.log("===========notification:", err);
                console.error(err.message, err);
            },

            // IOS ONLY (optional): default: all - Permissions to register.
            permissions: {
                alert: true,
                badge: true,
                sound: true,
            },

            // Should the initial notification be popped automatically
            // default: true
            popInitialNotification: true,

            /**
             * (optional) default: true
             * - Specified if permissions (ios) and token (android and ios) will requested or not,
             * - if not, you must call PushNotificationsHandler.requestPermissions() later
             * - if you are not using remote notification or do not have Firebase installed, use this:
             *     requestPermissions: Platform.OS === 'ios'
             */
            requestPermissions: true,
        });
    }

    static addNotificationRequest = (request) => {
        if (Platform.OS === "ios") {
            PushNotificationIOS.addNotificationRequest(request);
        } else {
            PushNotificationAndroid.localNotification({
                /* Android Only Properties */
                channelId: "checkmenow", // (required) channelId, if the channel doesn't exist, it will be created with options passed above (importance, vibration, sound). Once the channel is created, the channel will not be update. Make sure your channelId is different if you change these options. If you have created a custom channel, it will apply options of the channel.
                invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true

                /* iOS and Android properties */
                title: request.title, // (optional)
                message: request.body, // (required)
                userInfo: request.userInfo, // (optional) default: {} (using null throws a JSON value '<null>' error)
            });
        }
    }
}