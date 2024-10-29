import userDA from '../da/user';
import * as actions from '../store/actions'
import moment from 'moment';

export default class AmplifyBridge {
    constructor(store) {
        this.store = store;
    }

    subscribeToStore = () => {
        this.unsubscribeStore = this.store.subscribe(this.storeListener);
    }

    unsubscribeFromStore = () => {
        this.unsubscribeStore();
    }

    selectUser(state) {
        return state.user
    }

    tryUpdate() {
        if (this.isPostponed) {
            //console.log("Already postponed")
            return;
        }
        setTimeout(async () => {
            //console.log("trying to update after timeout")
            this.operationInProgress = true;
            const state = this.store.getState();
            const userState = this.selectUser(state)
            this.store.dispatch(actions.updateUserFromDb({}))
            const newUser = await this.saveUserUpdates(userState)
            newUser && this.store.dispatch(actions.updateUserFromDb({ id: newUser.id }))
            this.operationInProgress = false;
            this.last_client_timestamp = userState.client_timestamp;
            this.isPostponed = false;
            //console.log("Successfuly updated the db after postponing")
        }, 10000);
        //console.log("Postponinf first time")
        this.isPostponed = true;
    }

    storeListener = async () => {
        const state = this.store.getState();
        const userState = this.selectUser(state)
        if (!this.last_client_timestamp) {
            this.last_client_timestamp = moment(userState.client_timestamp).subtract(20, 'seconds');
        }

        if (this.operationInProgress) {
            //console.log("Postpone update due to progress")
            this.tryUpdate();
            return;
        }

        if (userState.client_timestamp.diff(this.last_client_timestamp, 'seconds') < 5) {
            //console.log("Postpone update due to last_client_timestamp")
            this.tryUpdate();
            return;
        }

        //console.log("Trying to update, the time is fine")
        if (!userState.db_timestamp ||
            userState.db_timestamp.isBefore(userState.client_timestamp)) {
            this.operationInProgress = true;
            this.store.dispatch(actions.updateUserFromDb({}))
            const newUser = await this.saveUserUpdates(userState)
            //console.log("new user")
            //console.log(newUser)
            newUser && this.store.dispatch(actions.updateUserFromDb({ id: newUser.id }))
            this.operationInProgress = false;
            this.last_client_timestamp = userState.client_timestamp;
            //console.log("Successfuly updated the db")
        } else {
            //console.log("Not updating due to db_timestamp")
        }
    }

    async saveUserUpdates(userToUpdate) {
        if (userToUpdate.email && userToUpdate.sessionState === 'signIn') {
            const user = await userDA.getByEmail(userToUpdate.email);
            if (!user) {
                const newUser = { email: userToUpdate.email };
                this.setUserToUpdate(userToUpdate, newUser);
                return userDA.add(newUser);
            } else {
                const existingUser = { id: user.id };
                this.setUserToUpdate(userToUpdate, existingUser);
                existingUser.expectedVersion = user.version;
                //console.log("existingUser")
                //console.log(existingUser)

                return userDA.update(existingUser);
            }
        }
    }

    setUserToUpdate(userToUpdate, newUser) {
        if (userToUpdate.firstName)
            newUser.firstName = userToUpdate.firstName;
        if (userToUpdate.lastName)
            newUser.lastName = userToUpdate.lastName;
        if (userToUpdate.dateOfBirth)
            newUser.dateOfBirth = moment(userToUpdate.dateOfBirth)
                .format('YYYY-MM-DDThh:mm:ss.sssZ');
        if (userToUpdate.vaccinationDate)
            newUser.vaccinationDate = userToUpdate.vaccinationDate
        if (userToUpdate.vaccinationCenter)
            newUser.vaccinationCenter = userToUpdate.vaccinationCenter;
        if (userToUpdate.postCode)
            newUser.postCode = userToUpdate.postCode;
        if (userToUpdate.typeOfDocument)
            newUser.typeOfDocument = userToUpdate.typeOfDocument;
        if (userToUpdate.nationality)
            newUser.nationality = userToUpdate.nationality;
        if (userToUpdate.userStatus)
            newUser.userStatus = userToUpdate.userStatus;
        if (userToUpdate.chatState)
            newUser.chatState = userToUpdate.chatState;
        if (userToUpdate.pushNotificationToken)
            newUser.pushNotificationToken = userToUpdate.pushNotificationToken;
        if (userToUpdate.pushNotificationService)
            newUser.pushNotificationService = userToUpdate.pushNotificationService;
        if (userToUpdate.sideEffects)
            newUser.sideEffects = userToUpdate.sideEffects;
        if (userToUpdate.sideEffects)
            newUser.sideEffectsDialogState = userToUpdate.sideEffectsDialogState;
        if (userToUpdate.isSideEffectScenarioCompleted)
            newUser.isSideEffectScenarioCompleted = userToUpdate.isSideEffectScenarioCompleted;
        if (userToUpdate.isTester)
            newUser.isTester = userToUpdate.isTester;
        if (userToUpdate.statusChangedAt)
            newUser.statusChangedAt = userToUpdate.statusChangedAt;
        if (userToUpdate.isQrCodeReady)
            newUser.isQrCodeReady = userToUpdate.isQrCodeReady;
        if (userToUpdate.consents)
            newUser.consents = userToUpdate.consents;
    }
}