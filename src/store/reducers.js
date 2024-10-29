import { combineReducers } from 'redux';
//import {DataStore} from '@aws-amplify/datastore';
//import * as models from '../models';
import moment from 'moment';
import UserStatus from '../constants/userStatus'

import {
  UPDATE_USER,
  UPDATE_NAVIGATION,
  INIT_USER,
  ADD_MESSAGE,
  CLEAN_MESSAGES,
  ADD_SIDEEFFECTS_MESSAGE,
  CLEAN_SIDEEFFECTS_MESSAGES,
  UPDATE_SIDEEFFECTS,
  UPDATE_USER_FROM_DB,
  INIT_USER_FROM_DB,
  ADD_SIDEEFFECT,
  CLEAN_SIDEEFFECTS,
  DELETE_USER
} from './actions';

function user(state = { userStatus: UserStatus.UNVERIFIED }, action) {
  const timestamp = moment();
  switch (action.type) {
    case UPDATE_USER:
      console.log("state.userStatus "+state.userStatus)
      console.log("action.user.userStatus "+action.user.userStatus)
      if(action.user.userStatus && state.userStatus!==action.user.userStatus){
        action.user.statusChangedAt = moment().unix();
        action.user.homeDialogState = null;
      }
      return { ...state, ...action.user, client_timestamp: timestamp };

    case INIT_USER:
      return { ...state, ...action.user, client_timestamp: timestamp };

    case INIT_USER_FROM_DB:
      return { ...state, ...action.user, client_timestamp: timestamp, db_timestamp: timestamp };

    case UPDATE_USER_FROM_DB:
      return { ...state, ...action.user, client_timestamp: timestamp, db_timestamp: timestamp };

    case ADD_SIDEEFFECT:
      const sideEffects = [...state.sideEffects, action.sideEffect];
      return { ...state, sideEffects: sideEffects, client_timestamp: timestamp };

    case CLEAN_SIDEEFFECTS:
      return { ...state, sideEffects: [], client_timestamp: timestamp };

    case DELETE_USER:
      return { sessionState: "signOut", client_timestamp: timestamp, db_timestamp: timestamp };

    default:
      return state;
  }
}

function navigationData(state = {}, action) {
  switch (action.type) {
    case UPDATE_NAVIGATION:
      return { ...state, ...action.navigationData };
    default:
      return state;
  }
}

function messages(state = [], action) {
  switch (action.type) {
    case ADD_MESSAGE:
      return [...state, action.message];
    case CLEAN_MESSAGES:
      return [];
    default:
      return state;
  }
}

function sideEffectsMessages(state = [], action) {
  switch (action.type) {
    case ADD_SIDEEFFECTS_MESSAGE:
      return [...state, action.message];
    case CLEAN_SIDEEFFECTS_MESSAGES:
      return [];
    default:
      return state;
  }
}

/*** Add more reducers here ***/

const rootReducer = combineReducers({
  user,
  navigationData,
  messages,
  sideEffectsMessages
  //currentSideEffects,
  //sideEffectsHistory,
  /*** List other reducers here ***/
});

export default rootReducer;
