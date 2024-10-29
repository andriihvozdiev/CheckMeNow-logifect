import {createStore, applyMiddleware} from 'redux';
const asyncDispatchMiddleware = (store) => (next) => (action) => {
  let syncActivityFinished = false;
  let actionQueue = [];

  function flushQueue() {
    actionQueue.forEach((a) => store.dispatch(a)); // flush queue
    actionQueue = [];
  }

  function asyncDispatch(asyncAction) {
    actionQueue = actionQueue.concat([asyncAction]);

    if (syncActivityFinished) {
      flushQueue();
    }
  }

  const actionWithAsyncDispatch = Object.assign({}, action, {asyncDispatch});

  next(actionWithAsyncDispatch);
  syncActivityFinished = true;
  flushQueue();
};
import rootReducer from './reducers';

const store = createStore(
  rootReducer,
  {},
  applyMiddleware(asyncDispatchMiddleware),
);

export default store;
