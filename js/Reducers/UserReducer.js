import * as types from '../Actions/ActionTypes';
import InitialState from './InitialState';

export default function userReducer(state = InitialState.users, action) {
      switch (action.type) {
            case types.LOAD_USERS:
                  return action.users;
            case types.LOAD_USERS_FROM_START:
                  return action.users;
            case types.LOAD_USERS_AFTER_START:
                  return action.users;
            default:
                  return state;
      }
}

export function userError(state = false, action) {
      switch (action.type) {
            case types.LOAD_USER_ERROR:
                  return action.hasUserError;
            default:
                  return state;
      }
}

export function userPending(state = false, action) {
      switch (action.type) {
            case types.LOAD_USER_PENDING:
                  return action.isUserLoading;
            default:
                  return state;
      }
}
