import * as types from '../Actions/ActionTypes';
import InitialState from './InitialState';
import update from 'immutability-helper';

export default function loginReducer(state = InitialState.loginResponse, action) {
      switch (action.type) {
            case types.LOAD_LOGIN_RESPONSE:
                  return action.loginResponse;
            case types.UPDATE_LOGIN_RESPONSE:
                  const newStateAfterUpdate = update(state, { authFlag: { $set: action.loginBool } });
                  return newStateAfterUpdate;
            default:
                  return state;
      }
}

export function loginError(state = false, action) {
      switch (action.type) {
            case types.AUTHENTICATION_ERROR:
                  return action.hasAuthenticationError;
            default:
                  return state;
      }
}

export function loginPending(state = false, action) {
      switch (action.type) {
            case types.AUTHENTICATION_PENDING:
                  return action.isAuthenticationPending;
            default:
                  return state;
      }
}

export function userLogin(state = false, action) {
      switch (action.type) {
            case 'LOGIN':
                  return true;
            case 'LOGOUT':
                  return false;
            default:
                  return state;
      }
}

export function changePassword(state = [], action) {
      switch (action.type) {
            case types.CHANGE_PASSWORD_RESPONSE:
                  return action.changePasswordResponse;
            default:
                  return state;
      }
}


export function changePasswordError(state = false, action) {
      switch (action.type) {
            case types.CHANGEPASSWORD_ERROR:
                  return action.hasPasswordChangeError;
            default:
                  return state;
      }
}

export function tokenExpireStatus(state = false, action) {
      switch (action.type) {
            case types.TOKEN_EXPIRE:
                  return action.tokenExpire;
            default:
                  return state;
      }
}

export function appUpgradationStatus( state = InitialState.initialUpgradationStatus, action ) {
      switch (action.type) {
            case types.APP_UPGRADE:
                 return action.upgradationStatus;
            default:
                 return state;
      }
}
