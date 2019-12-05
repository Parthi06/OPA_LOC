import * as types from './ActionTypes';
import * as constants from '../Utils/Constants';
import * as AppUtilityFns from '../Utils/AppUtils';
import * as appConstants from '../Utils/AppConstants';
import * as db from '../database/databaseActions';
import packageJson from '../../version.json';


export function login(loginflag) {
  return { type: types.LOGIN, loginflag };
}

export function logout(loginflag) {
  return { type: types.LOGOUT, loginflag };
}

export function loadLoginResponse(loginResponse) {
  return { type: types.LOAD_LOGIN_RESPONSE, loginResponse };
}

export function updateLoginResponse(bool) {
  return { type: types.UPDATE_LOGIN_RESPONSE, loginBool: bool };
}

export function authenticationHasError(bool) {
  return { type: types.AUTHENTICATION_ERROR, hasAuthenticationError: bool };
}

export function authenticationPending(bool) {
  return { type: types.AUTHENTICATION_PENDING, isAuthenticationPending: bool };
}

export function changePasswordResponse(changePasswordResponse) {
  return { type: types.CHANGE_PASSWORD_RESPONSE, changePasswordResponse };
}

export function changePasswordHasError(bool) {
  return { type: types.CHANGEPASSWORD_ERROR, hasPasswordChangeError: bool };
}

export function updateTokenExpireStatus(bool) {
  return { type: types.TOKEN_EXPIRE, tokenExpire: bool };
}

export function appUpgradationChecker( upgradationStatus ) {
  return { type: types.APP_UPGRADE, upgradationStatus: upgradationStatus };
}

export function verifyAuthenticationFromApi(userName, password, custDomain) {
  var tokenValue;
  var body = {
    username: userName,
    password: password,
    customerDomain: custDomain
  };
  body = JSON.stringify(body);
  var headers = new Headers({
    "Content-Type": "application/json"
  });
  var param = {
    method: 'POST',
    body: body,
    headers: headers
  };
  var bodyLogin = {
    username: userName,
    password: password
  };
  bodyLogin = JSON.stringify(bodyLogin);
  return dispatch => {
    // dispatch(authenticationPending(true));
    fetch(constants.SERVER_URL + '/users/authentication', param)
      .then((response) => {
        if (!response.ok) {
          dispatch(authenticationHasError(true));
        }
        /*
        if (!JSON.parse(response._bodyText).authFlag) {
          dispatch(authenticationHasError(false));
          dispatch(loadLoginResponse(JSON.parse(response._bodyText)));
        }*/
        tokenValue = response.headers.map.authorization; 
        //return response.headers.map.authorization;
        return response.json();
      })
      .then((responseInitial) => {
        console.log('------------------------------------'+JSON.stringify(responseInitial))
            if (!responseInitial.authFlag) {
              dispatch(authenticationHasError(false));
              dispatch(loadLoginResponse(responseInitial));
            }
        if (!tokenValue)
          return false;
        console.log('====================================================='+tokenValue)
        param = {
          method: 'POST',
          body: bodyLogin,
          headers: {
            'Authorization': tokenValue,
            "Content-Type": "application/json"
          }
        };

        fetch(constants.SERVER_URL + '/users/loginAuthentication', param) //Ticket #205
          .then((response) => {
            console.log('------------------    login authentication called      ------------------' + JSON.stringify(response))
            if (!response.ok) {
              dispatch(loadLoginResponse([]));
              dispatch(authenticationHasError(true));
            }
            // dispatch(authenticationPending(false));
            return response.json();
          }).then((responseJson) => {
            responseJson.token = tokenValue;
            if (responseJson.authFlag && responseJson.errorMessage == "SUCCESS") {
              /**---------------------------- user app version updation------------------------------------- */
              console.log('\nAdding user app version to db ---------\n' + responseJson.userId)
              let userAppVersion = {
                method: 'POST',
                body: JSON.stringify({
                  "userId":responseJson.userId,
                  "appVersion":packageJson.version
                }),
                headers: {
                  "Content-Type": "application/json",
                  'Authorization': responseJson.token
                }
              }
              fetch(constants.SERVER_URL + '/users/updateVersion', userAppVersion) 
              .then((response) => {
                console.log( JSON.stringify(response) +'\n User app  version initial response---- \n' + response)
                return response.text();
              }) .then((response) => {
                console.log('\n user app version updation\n' + response)
              })
              responseJson.logo = "data:image/png;base64," + responseJson.logo;
              db.saveLoginInfo(responseJson).then((resolve) => {
                dispatch(loadLoginResponse(resolve[0]));
                dispatch(authenticationPending(false));
                dispatch(authenticationHasError(false));
              }).catch((error) => console.log("Couldnt save login info to db" + error));
            }
          })
          .catch((error) => {// TODO retry
            console.log("error1", error);
            dispatch(loadLoginResponse([]));
            dispatch(authenticationHasError(true));
          });
      })
      .catch((error) => {// TODO retry
        console.log("error2", error);
        dispatch(loadLoginResponse([]));
        dispatch(authenticationHasError(true));
      });
  };
}



export function changePassword(oldPassword, newPassword, userId) {
  var body = { //Ticket #205
    "userId":userId,
    "oldPassword":oldPassword,
    "password":newPassword
  };
  body = JSON.stringify(body);
  var headers = new Headers({
    "Content-Type": "application/json"
  });
  var param = {
    method: 'POST',
    body: body,
    headers: headers
  };
  return dispatch => {
    // dispatch(authenticationPending(true)); http://localhost:9008/opa_rest/users/changePassword
    fetch(constants.SERVER_URL + '/users/changePassword', param) 
      .then((response) => {
        if (!response.ok) {
          dispatch(changePasswordHasError(true));
        }
        return response.json();
      })
      .then((responseJson) => {
        dispatch(changePasswordResponse(responseJson));
      })
      .catch((error) => {// TODO retry
        dispatch(changePasswordHasError(true));
      });
  };
}

export function logoutOnChangePassword() {
  return dispatch => {
    db.removeLoginInfo().then().catch((error) => console.log("Couldnt remove login info from db" + error));
  };
}

export function checkForAppUpgradation() {
  console.log('checkForAppUpgradation called---------------------------' + packageJson.version )
  //upgradeResponse:['Y','N'] = [ later upgrade , force upgrade ]
  const today       = new Date();
  let forceUpgrade  = false;
  let laterUpgrade  = false;
  let numberOfDays  = -1;
  var headers       = new Headers({
    "Content-Type"  : "application/json"
  });
  var param         = { method: 'GET', headers: headers };

  return dispatch => {
    fetch(constants.SERVER_URL + '/users/appUpdationCheck?currentAppVersion=' + packageJson.version , param)
    .then( (response) => {
        return response.json();
    })
    .then((responseJson)  =>  {
        if( responseJson[1] == appConstants.FORCE_UPGRADE ) {
            forceUpgrade = true;
            dispatch(appUpgradationChecker( { forceUpgrade:forceUpgrade, laterUpgrade:laterUpgrade } ))
        } else if( responseJson[0] == appConstants.LATER_UPGRADE ) {
              db.fetchUpgradeWindowDisplayedTimeStamp( types.FORCE_UPGRADE )
                .then((prevWindowTimeStamp) => {
                        numberOfDays = AppUtilityFns.findNumberOfDaysBetweenDates(today, new Date(prevWindowTimeStamp))
                        console.log(numberOfDays + 'is the number of days : prev' + prevWindowTimeStamp)
                        if ( numberOfDays < 0 || prevWindowTimeStamp.length === 0 ) {
                            laterUpgrade = true
                            db.saveUpgradeWindowDisplayedTimeStamp( types.FORCE_UPGRADE, today )
                            .then((value) => {
                                dispatch(appUpgradationChecker( { forceUpgrade:forceUpgrade, laterUpgrade:laterUpgrade  }  ))
                            })
                            .catch((error) => {
                                console.log("Error: saveUpgradeWindowDisplayedTimeStamp", error);
                            });
                        } else if ( numberOfDays > 7 ) {
                              laterUpgrade = true
                              db.saveUpgradeWindowDisplayedTimeStamp( types.FORCE_UPGRADE, today )
                              .then((value) => {
                                  console.log('No of days greater than 7 app will display later upgradation window  --    - - - --  - ')
                                  dispatch(appUpgradationChecker( { forceUpgrade:forceUpgrade, laterUpgrade:laterUpgrade  }  ))
                              })
                              .catch((error) => {
                                  console.log("Error: saveUpgradeWindowDisplayedTimeStamp", error);
                              });
                        } else {
                          console.log('App will not show later or force upgrade window ')
                          dispatch(appUpgradationChecker( { forceUpgrade:forceUpgrade, laterUpgrade:laterUpgrade } ))
                        }
                   })
                .catch((error) => {
                        console.log(`Error: checkForAppUpgradation      -      -    - : `, error);
                });     
        }
    })
    .catch( (error) => {
        dispatch(appUpgradationChecker( { forceUpgrade:forceUpgrade, laterUpgrade:laterUpgrade  }  ))
        console.log('Error during app version upgrade checking  - - - ' + error)
    })
}
}
