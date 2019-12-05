import * as types from './ActionTypes';
import * as constants from '../Utils/Constants';
import * as db from '../database/databaseActions';

export function loadUsers(users) {
  return { type: types.LOAD_USERS, users };
}

export function loadUsersFromStart(users) {
  return { type: types.LOAD_USERS_FROM_START, users };
}
 
export function loadUsersHasError(bool) {
  return { type: types.LOAD_USER_ERROR, hasUserError: bool };
}
export function loadUsersPending(bool) {
  return { type: types.LOAD_USER_PENDING, isUserLoading: bool };
}

export function loadLoginResponse(loginResponse) {
  return { type: types.LOAD_LOGIN_RESPONSE, loginResponse };
}

export function loadUsersAfterStart(users) {
  return { type: types.LOAD_USERS_AFTER_START, users };
}

export function fetchRemoteUsersFromApi(customerId, page, limit) {
  var body = null;
  var myInit = {
    method: 'GET',
    body: body
  };

  return dispatch => {
    db.getCustomerUserList().then((eventsList) => {
      dispatch((page == 1) ? loadUsersFromStart(eventsList) : loadUsersAfterStart(eventsList));
    }).catch((error) => {
      console.log(`Error: userLicenceAgreeButtonClick`, error);
    });
    dispatch(loadUsersPending(true));
    fetch(constants.SERVER_URL + `/usersDetails?customer=${customerId}&page=${page}&limit=${limit}`, myInit)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        dispatch(loadUsersPending(false));
        return response;
      })
      .then((response) => response.json())
      .then((responseJson) => {
        responseJson.forEach(element => {
          db.saveCustomerUserList(element).then().catch((error) => {
            console.log("Error: saveCustomerUserList | UserFeed", error);
          });
        });
      }).then(() => {
        db.getCustomerUserList().then((eventsList) => {
          dispatch((page == 1) ? loadUsersFromStart(eventsList) : loadUsersAfterStart(eventsList));
        }).catch((error) => {
          console.log(`Error: userLicenceAgreeButtonClick`, error);
        });
      })
      .catch((error) => {
        dispatch(loadUsersHasError(true));
      });
  };
}

export function loadUserDetailsAPI(customerId) {
  console.log('loadUserDetailsAPI called\n\n\n')
  var body = null;
  var myInit = {
    method: 'GET',
    body: body
  };

  return dispatch => {
    fetch(constants.SERVER_URL + '/usersDetails/getFewUserDetails/' + customerId, myInit)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      })
      .then((responseJson) => {
        dispatch(loadUsers(responseJson));
      })
      .catch((error) => {
        dispatch(loadUsersHasError(true));
      });
  };
}




export function userLicenceAgreeButtonClick() {
  return dispatch => {
    db.updateLoginInfo().then((eventsList) => {
      dispatch(loadLoginResponse(eventsList));
    }).catch((error) => {
      console.log(`Error: userLicenceAgreeButtonClick`, error);
    });
  };

}
