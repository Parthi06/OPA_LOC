import * as types from './ActionTypes';
import * as constants from '../Utils/Constants';
import * as appConstants from '../Utils/AppConstants';
import * as db from '../database/databaseActions';
import * as schemaType from '../schemas/schemaTypes';
import * as userActions from './UserActions';
import { decode } from 'base-64';
import { Alert } from 'react-native';


export function loadAssets(assetList) {
  return { type: types.LOAD_ASSETS, assetList };
}

export function loadAllAssets(assets) {
  return { type: types.LOAD_ALL_ASSETS, assets };
}

export function loadAllProcessedDataForAnAsset(processedData) {
  return { type: types.LOAD_ALL_PROCESSED_DATA_FOR_AN_ASSET, processedData };
}

export function loadAssetsFromStart(assetList) {
  return { type: types.LOAD_ASSETS_FROM_START, assetList };
}

export function loadAssetsHasError(bool) {
  return { type: types.LOAD_ASSETS_ERROR, hasAssetsError: bool };
}

export function loadAssetsPending(bool) {
  return { type: types.LOAD_ASSETS_PENDING, isAssetsLoading: bool };
}

export function loadProcessedDataHasError(bool) {
  return { type: types.LOAD_PROCESSED_DATA_HAS_ERROR, hasProcessedDataError: bool };
}

export function loadProcessedDataPending(bool) {
  return { type: types.LOAD_PROCESSED_DATA_PENDING, isProcessedDataLoading: bool };
}

export function loadAssetsCountPending(bool) {
  return { type: types.LOAD_ASSETS_COUNT_PENDING, isAssetCountLoading: bool };
}


export function loadAssetsCount(assetCount) {
  return { type: types.LOAD_ASSETS_COUNT, assetCount };
}

export function loadAssetsById(asset) {
  return { type: types.LOAD_ASSET_BYID, asset };
}

export function loadAssetOperationalInfo(assetOperationalInfoList) {
  return { type: types.LOAD_ASSET_OPERATIONAL_INFO, assetOperationalInfoList };
}

export function updateMoteState( eventAction) {
  return { type: types.UPDATE_MOTE_STATE, eventAction };
}

export function fetchAllAssetTagsByCustomerId( assetTags ) {
  return { type: types.LOAD_ASSET_TAGS, assetTags };
}

//----

export function oneStepFeedbackAPIInitiated( oneStepFeedbackAPIInitiated ) {
  return { type: types.ONE_STEP_FEEDBACK_API_CALL_INITIATED, oneStepFeedbackAPIInitiated:oneStepFeedbackAPIInitiated };
}

export function oneStepFeedbackAPICompleted( ticketCreated ) {
  return { type: types.ONE_STEP_FEEDBACK_RESULT, ticketCreated:ticketCreated };
}

export function loadAllAssetByCustomerId( assets ) {
  return { type: types.LOAD_ALL_ASSETS_BY_CUSTOMER_ID, assetsByCustomerId:assets };
}
//-----


export function loadAssetsFromApi(customerId, page, limit) {
  var body = null;
  var myInit = {
    method: 'GET',
    body: body,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  let eventsList = null;

  return dispatch => {
    dispatch(loadAssetsPending(true));
    db.findAllAssets(schemaType.ASSETLIST_SCHEMA, page).then((eventsList) => {
      dispatch((page == 1) ? loadAssetsFromStart(eventsList) : loadAssets(eventsList));
    }).catch((error) => {
      console.log(`Error: loadAssetsFromApi : Asset List find`, error);
    });
    fetch(constants.SERVER_URL + `/assets/fetchAssetsInLimit?customer=${customerId}&page=${page}&limit=${limit}`, myInit)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        dispatch(loadAssetsPending(false));
        return response;
      })
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {
        responseJson.forEach(element => {
          db.saveAssetsList(schemaType.ASSETLIST_SCHEMA, element).then((value) => {
          }).catch((error) => {
            console.log("Error: loadAssetsFromApi | Assets List Save", error);
          });
        });
        return responseJson;
      })
      .then((responseJson) => {
        db.findAllAssets(schemaType.ASSETLIST_SCHEMA, page).then((eventsList) => {
          eventsList = eventsList;
          dispatch((page == 1) ? loadAssetsFromStart(eventsList) : loadAssets(eventsList));
        }).catch((error) => {
          console.log(`Error: loadAssetsFromApi : Asset List find`, error);
        });
      })
      .catch((error) => {
        dispatch(loadAssetsHasError(true));
        console.log(`Error: loadAssetsFromApi : Error`, error);
      });
  };
}

export function loadProcessedDataFromAPI(assetId, showloadingBar) {
  let urlParam = ""
  urlParam=  "/motereport/processedData/" + assetId 
  var body = null;
  var myInit = {
    method: 'GET',
    body: body,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  return dispatch => {
    if (showloadingBar)
      dispatch(loadProcessedDataPending(true));
    db.getProcessedData(schemaType.PROCESSED_GRAPH_DATA, assetId).then((assetGraphData) => {
      if (assetGraphData.moteId) {           
        dispatch(loadAllProcessedDataForAnAsset(assetGraphData));
        dispatch(loadProcessedDataPending(false));
      }
    }).catch((error) => {
      console.log(`Error: getProcessedData :getProcessedData find`, error);
    });
    fetch(constants.SERVER_URL + urlParam, myInit)
      .then((response) => {
        if (!response.ok) {
          dispatch(loadProcessedDataHasError(true));
        }
        dispatch(loadProcessedDataPending(false));
        return response.json();
      })
      .then((responseJson) => {
        dispatch(loadAllProcessedDataForAnAsset(responseJson));
        if (responseJson) {
          db.saveProcessedData(schemaType.PROCESSED_GRAPH_DATA, responseJson).then((value) => {
          }).catch((error) => {
            console.log("Error: saveProcessedData | saveProcessedData  Save", error);
          });
        }
      })
      .catch((error) => {// TODO retry
        dispatch(loadProcessedDataHasError(true));
        console.log("Error: loadProcessedDataFromAPI Error: ", error);
      });
  };
}

export function fetchAssetsCount(customerId) {
  var body = null;
  var myInit = {
    method: 'GET',
    body: body,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  return dispatch => {
    dispatch(loadAssetsCountPending(true));
    fetch(constants.SERVER_URL + `/assets/count/customer/` + customerId, myInit)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        dispatch(loadAssetsCountPending(false));
        return response;
      })
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {
        dispatch(loadAssetsCount(responseJson));
        return responseJson;
      })
      .catch((error) => {// TODO retry
        dispatch(loadAssetsCountPending(false));
        console.log("fetchAssetsCount Error", error);
      });
  };
}

export function loadAssetsByIdFromApi(assetId) {
  var body = null;
  var myInit = {
    method: 'GET',
    body: body,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  return dispatch => {
        db.getAssetDetailsById( assetId ).then((value) => {
                dispatch(loadAssetsById(value));
          }).catch((error) => {
                console.log("Error: getAssetDetailsById", error);
          });
    dispatch(loadAssetsPending(true));
    fetch(constants.SERVER_URL + `/assets/loadAssets/` + assetId, myInit)
      .then((response) => {
        if (!response.ok) {
          return null;
          // throw Error(response.statusText);
        }
        dispatch(loadAssetsPending(false));
        return response.json();
      })
      .then((responseJson) => {
        if (responseJson && responseJson !== null) {
          dispatch(loadAssetsById(responseJson));
            db.saveAssetsList(schemaType.ASSETLIST_SCHEMA, responseJson).then((value) => {
            }).catch((error) => {
              console.log("Error: loadAssetsByIdFromApi | Assets List Save", error);
            });
        }
      }) 
      .catch((error) => {// TODO retry
        dispatch(loadAssetsHasError(true));
        console.log("loadAssetsByIdFromApi Error:", error);
      });
  };
}

export function loadAssetOperationalInfoFromApi(assetId) {
  var body = null;
  var myInit = {
    method: 'GET',
    body: body
  };
  return dispatch => {
    db.getAssetOperationalInfo(assetId).then((value) => {
      dispatch(loadAssetOperationalInfo(value));
    }).catch((error) => {
      console.log("Error: loadAssetOperationalInfoFromApi 2", error);
    });
    fetch(constants.SERVER_URL + '/assets/state/' + assetId, myInit)
      .then((response) => {
        if (!response.ok) {
          return null;
          // throw Error(response.statusText);
        }
        return response.json()
      })
      .then((responseJson) => {
        if (responseJson && responseJson !== null) {
          if (responseJson.customInfo && responseJson.customInfo != null)
            responseJson.customInfo = decode(responseJson.customInfo);
          dispatch(loadAssetOperationalInfo(responseJson));
          db.saveAssetOperationalInfo(responseJson).then((data) => {
          }).catch((error) => {
            console.log("Error: saveAssetOperationalInfo", error);
          });
        }
      }).catch((error) => {
        console.error("Error: loadAssetOperationalInfoFromApi", error);
      });
  }
}


export function updateMoteStatus( assetId, moteId, eventAction ) {
  var headers = new Headers({
    "Content-Type": "application/json"
  });
  var param = {
    method: 'POST',
    headers: headers
  };  
  return dispatch => {
  fetch(constants.SERVER_URL + '/motereport/changeMoteState/'+ moteId  +'/'+ eventAction , param)
    .then((response)  =>  { 
        return response.text()
    })
    .then((respJson)  =>  {
        if ( respJson === "SUCCESS" ) {  
          if( eventAction ==='D' )  {
            dispatch (updateMoteState( "Inactive"));
            db.saveProcessedData(schemaType.PROCESSED_GRAPH_DATA, { assetId:assetId, state: "Inactive" } ).then((value) => {
            }).catch((error) => {
                console.log("Error: saveProcessedData | saveProcessedData  Save", error);
            });
          }
          else {
            db.saveProcessedData(schemaType.PROCESSED_GRAPH_DATA,  {assetId:assetId, state:"Deployed"}).then((value) => {
            }).catch((error) => {
                console.log("Error: saveProcessedData | saveProcessedData  Save", error);
            });
            dispatch (updateMoteState("Deployed"));
          }
      }
     })
    .catch((error)  =>  {
        console.error( 'Error during mote status updation : ' + error);
    });
}
}


export function saveFeedBack (feedbackPostData) {
  var body = JSON.stringify( feedbackPostData );
  var headers = new Headers({
    "Content-Type": "application/json"
  });
  var param = {
    method: 'POST',
    body: body,
    headers: headers
  };
  return dispatch => {
          dispatch(oneStepFeedbackAPICompleted(false))
          dispatch(oneStepFeedbackAPIInitiated(true));
    fetch(constants.SERVER_URL +'/events/oneStepFeedBack/true/true/true',param).
    then((resp) => {
      if(resp.ok) {
          Alert.alert(appConstants.CREATED_TICKET);
          dispatch(oneStepFeedbackAPICompleted(true))
          dispatch(oneStepFeedbackAPIInitiated(false))
      } 
    }).catch((error)  =>  {
          Alert.alert(appConstants.ERROR_ONE_STEP_FEEDBACK);
          dispatch(oneStepFeedbackAPICompleted(true))
          dispatch(oneStepFeedbackAPIInitiated(false))
          console.error( 'Error during one step feedback' + error);
  });
  };
 } 

export function fetchAssetTagsByCustomerId( customerId ) {
  var body = null;
  var myInit = {
    method: 'GET',
    body: body,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  return dispatch => {
    fetch(constants.SERVER_URL + `/assets/assetTags/` + customerId, myInit)
      .then((response) => {
        if ( response.ok ) {
          return response.json();
        }
      })
      .then((responseJson) => {
        dispatch( fetchAllAssetTagsByCustomerId( responseJson ) );
      })
      .catch((error) => {    
        console.log("fetchAssetTagsByCustomerId  Error", error);
      });
  };
}


//Fetch all asset for dashboard page
//https://dev.d-opabydesigns.com/opa_rest/assets/fetchAssets/1
export function fetchAllAssetByCustomerId( customerId ) {
  var body = null;
  var myInit = {
    method: 'GET',
    body: body,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  return dispatch => {
    fetch(constants.SERVER_URL + `/assets/fetchAssets/` + customerId, myInit)
      .then((response) => {
        if ( response.ok ) {
          return response.json();
        }
      })
      .then((responseJson) => {
        dispatch( loadAllAssetByCustomerId(responseJson) );
      })
      .catch((error) => {    
        console.log("fetchAssetTagsByCustomerId  Error", error);
      });
  };
}