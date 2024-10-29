const UPDATE_USER = 'UPDATE_USER';
const INIT_USER = 'INIT_USER';
const DELETE_USER = 'DELETE_USER';


// when user sign in / out
function updateUser(user) {
  return {
    type: UPDATE_USER,
    user,
  };
}

export { UPDATE_USER }; //Actions
export { updateUser }; //Actions creators

export { INIT_USER }; //Actions
export { initUser }; //Actions creators
function initUser(user) {
  return {
    type: INIT_USER,
    user,
  };
}

export { DELETE_USER }; //Actions
export { deleteUser }; //Actions creators
function deleteUser() {
  return {
    type: DELETE_USER
  };
}

const INIT_USER_FROM_DB = 'INIT_USER_FROM_DB';
export { INIT_USER_FROM_DB }; //Actions
export { initUserFromDb }; //Actions creators

function initUserFromDb(user) {
  return {
    type: INIT_USER_FROM_DB,
    user,
  };
}

function updateUserFromDb(user) {
  return {
    type: UPDATE_USER_FROM_DB,
    user,
  };
}


const UPDATE_USER_FROM_DB = 'UPDATE_USER_FROM_DB';
export { UPDATE_USER_FROM_DB }; //Actions
export { updateUserFromDb }; //Actions creators

/******* Navigation *******/
const UPDATE_NAVIGATION = 'UPDATE_NAVIGATION';
// when user sign in / out
function updateNavigation(navigationData) {
  return {
    type: UPDATE_NAVIGATION,
    navigationData,
  };
}

export { UPDATE_NAVIGATION }; //Actions
export { updateNavigation }; //Actions creators
/******* END Navigation *******/

/******* Side Effect *******/

const ADD_SIDEEFFECT = 'ADD_SIDEEFFECT';
function addSideEffect(sideEffect) {
  return {
    type: ADD_SIDEEFFECT,
    sideEffect,
  };
}
export { ADD_SIDEEFFECT };
export { addSideEffect };

const CLEAN_SIDEEFFECTS = 'CLEAN_SIDEEFFECTS';
function cleanSideEffects() {
  return {
    type: CLEAN_SIDEEFFECTS,
  };
}
export { CLEAN_SIDEEFFECTS };
export { cleanSideEffects };




/*const UPDATE_SIDEEFFECTS = 'UPDATE_SIDEEFFECTS';
function updateSideEffects(currentSideEffects) {
  return {
    type: UPDATE_SIDEEFFECTS,
    currentSideEffects,
  };
}

export { UPDATE_SIDEEFFECTS }; //Actions
export { updateSideEffects }; //Actions creators */

// SIDEEFFECTS_HISTORY
/*
const ADD_SIDEEFFECTS_HISTORY = 'ADD_SIDEEFFECTS_HISTORY';
function addSideEffectsHistory(sideEffectsHistory) {
  return {
    type: ADD_SIDEEFFECTS_HISTORY,
    sideEffectsHistory,
  };
}
export { ADD_SIDEEFFECTS_HISTORY }; //Actions
export { addSideEffectsHistory }; //Actions creators

const CLEAN_SIDEEFFECTS_HISTORY = 'CLEAN_SIDEEFFECTS_HISTORY';
function cleanSideEffectsHistory() {
  return {
    type: CLEAN_SIDEEFFECTS_HISTORY,
  };
}
export { CLEAN_SIDEEFFECTS_HISTORY }; //Actions
export { cleanSideEffectsHistory }; //Actions creators
*/

/******* END SideEffect *******/

/******* Messages *******/
const ADD_MESSAGE = 'ADD_MESSAGE';
const CLEAN_MESSAGES = 'CLEAN_MESSAGES';

function addMessage(message) {
  return {
    type: ADD_MESSAGE,
    message,
  };
}

function cleanMessages() {
  return {
    type: CLEAN_MESSAGES,
  };
}

export { ADD_MESSAGE, CLEAN_MESSAGES }; //Actions
export { addMessage, cleanMessages }; //Actions creators

/******* END Messages *******/

/******* SideEffects Messages *******/
const ADD_SIDEEFFECTS_MESSAGE = 'ADD_SIDEEFFECTS_MESSAGE';
const CLEAN_SIDEEFFECTS_MESSAGES = 'CLEAN_SIDEEFFECTS_MESSAGES';

function addSideEffectsMessage(message) {
  return {
    type: ADD_SIDEEFFECTS_MESSAGE,
    message,
  };
}

function cleanSideEffectsMessages() {
  return {
    type: CLEAN_SIDEEFFECTS_MESSAGES,
  };
}

export { ADD_SIDEEFFECTS_MESSAGE, CLEAN_SIDEEFFECTS_MESSAGES }; //Actions
export { addSideEffectsMessage, cleanSideEffectsMessages }; //Actions creators

/******* END SideEffects Messages *******/
