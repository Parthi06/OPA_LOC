import * as types from './ActionTypes';
import * as constants from '../Utils/Constants';

export function loadFaultEnums(faultEnums) {
  return { type: types.LOAD_FAULT_ENUMS, faultEnums };
}
export function loadFaultEnumsFromApi() {
  var body = null;
  var myInit = {
    method: 'GET',
    body: body,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  return dispatch =>
    fetch(constants.SERVER_URL + '/fault/enums', myInit)
      .then((response) => response.json())
      .then((responseJson) => {
        dispatch(loadFaultEnums(responseJson));
      })
      .catch((error) => {
        console.error(error);
      });
}
