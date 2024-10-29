import * as Keychain from 'react-native-keychain';
import { Platform } from 'react-native';

export default class {
    static async setBiometrics(username, password) {
        const BiometryType = await Keychain.getSupportedBiometryType();
        console.log("BiometryType")
        console.log(BiometryType)
        try {
            const result = await Keychain.setInternetCredentials(
                "amplify",
                username,
                password,
                {
                    accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
                    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
                    securityLevel: Keychain.SECURITY_LEVEL.SECURE_SOFTWARE
                },
            );
            return result;
        } catch (error) {
            console.log(error);
        }
    }

    static async checkBiometrics() {
        try {
            const result = await Keychain.getInternetCredentials("amplify");
            console.log('checkBiometrics');
            console.log(result);
            return result;
        } catch (error) {
            //throw error;
            console.log('checkBiometrics error');
            console.log(error);
        }
    }

    static async resetBiometrics() {
        try {
            const result = await Keychain.resetInternetCredentials("amplify");
            return result;
        } catch (error) {
            console.log(error);
        }
    }

    //Temp Biometrics ------------------

    static async setBiometricsTemp(username, password) {
        const BiometryType = await Keychain.getSupportedBiometryType();
        console.log("BiometryType")
        console.log(BiometryType)
        try {
            const result = await Keychain.setInternetCredentials(
                "amplify-temp",
                username,
                password,
                {
                    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
                    securityLevel: Keychain.SECURITY_LEVEL.SECURE_SOFTWARE
                },
            );
            return result;
        } catch (error) {
            console.log(error);
        }
    }



    static async checkBiometricsTemp() {
        try {
            const result = await Keychain.getInternetCredentials("amplify-temp");
            return result;
        } catch (error) {
            console.log('checkBiometrics error');
            console.log(error);
        }
    }

    static async resetBiometricsTemp() {
        try {
            const result = await Keychain.resetInternetCredentials("amplify-temp");
            return result;
        } catch (error) {
            console.log(error);
        }
    }


    // -------PIN Code -------------
    static async setPin(pinCode) {
        try {
            const result = await Keychain.setGenericPassword('pinCode', pinCode,
                {
                    service: "local_pin",
                    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
                    securityLevel: Keychain.SECURITY_LEVEL.SECURE_SOFTWARE
                },
            );

            return result;
        } catch (error) {
            console.log(error);
        }
    }

    static async getPin() {
        try {
            const result = await Keychain.getGenericPassword({
                service: "local_pin"
            });
            return result;
        } catch (error) {
            console.log('Pin Error');
            console.log(error);
        }
    }
    static async resetPin() {
        try {
            const result = await Keychain.resetGenericPassword({
                service: "local_pin"
            });
            return result;
        } catch (error) {
            console.log(error);
        }
    }
}
