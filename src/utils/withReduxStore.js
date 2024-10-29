import { connect } from 'react-redux';
import {
  updateNavigation,
  updateUser,
  initUser,
  initUserFromDb,
  updateUserFromDb,
  addMessage,
  cleanMessages,
  addSideEffectsMessage,
  cleanSideEffectsMessages,
  addSideEffect,
  cleanSideEffects,
  deleteUser
} from '../store/actions';

export default function withReduxStore(WrappedComponent) {
  const mapStateToProps = (state) => {
    return {
      navigationData: state.navigationData,
      user: state.user,
      messages: state.messages,
      sideEffectsMessages: state.sideEffectsMessages,
    };
  };

  const mapDispatchToProps = (dispatch) => {
    // Action
    return {
      // update user
      updateUser: (user) => dispatch(updateUser(user)),
      deleteUser: (user) => dispatch(deleteUser(user)),
      initUser: (user) => dispatch(initUser(user)),
      initUserFromDb: (user) => dispatch(initUserFromDb(user)),
      updateUserFromDb: (user) => dispatch(updateUserFromDb(user)),
      addMessageToStore: (message) => dispatch(addMessage(message)),
      cleanMessagesFromStore: () => dispatch(cleanMessages()),
      addSideEffectsMessageToStore: (message) => dispatch(addSideEffectsMessage(message)),
      cleanSideEffectsMessagesFromStore: () => dispatch(cleanSideEffectsMessages()),
      updateNavigation: (navigationData) =>
        dispatch(updateNavigation(navigationData)),
      addSideEffectToStore: (sideEffect) => dispatch(addSideEffect(sideEffect)),
      cleanSideEffectsFromStore: () => dispatch(cleanSideEffects()),
    };
  };

  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
