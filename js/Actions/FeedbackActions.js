import * as types from './ActionTypes';
import * as constants from '../Utils/Constants';
import * as db from '../database/databaseActions';
import * as schemaType from '../schemas/schemaTypes';

export function appendSavedFeedbackToEvents(events) {
  return { type: types.APPEND_SAVED_FEEDBACK_TO_EVENTS, events };
}

export function saveFeedbackHasError(bool) {
  return { type: types.SAVE_FEEDBACK_HAS_ERROR, hasFeedbackSaveError: bool };
}

export function saveFeedbackSuccess(bool) {
  return { type: types.SAVE_FEEDBACK_SUCCESS, isFeedbackSavedSuccess: bool };
}

export function loadFeedbackHistory(feedbacklist) {
  return { type: types.LOAD_FEEDBACK_HISTORY, feedbacklist: feedbacklist };
}

export function saveFeedbackToDB(feedback) {
  var body = JSON.stringify(feedback);
  var headers = new Headers({
    "Content-Type": "application/json"
  });
  var param = {
    method: 'POST',
    body: body,
    headers: headers
  };
  return dispatch =>
    db.saveFeedbackToDB(schemaType.TICKET_SCHEMA, feedback).then((eventsList) => {
    
      dispatch(appendSavedFeedbackToEvents(eventsList));
      fetch(constants.SERVER_URL + '/feedback/add', param)
        .then((response) => {
          dispatch(saveFeedbackSuccess((response.ok)?true:false));        
          return response;
        })
        .catch((error) => {
          dispatch(saveFeedbackHasError(true));
        });
    }).catch((error) => {
      console.log("Error: saveFeedbackToDB ", error);
    });
}

export function getFeedbackHistoryByTicketId(ticketId) {
  // var body = JSON.stringify(feedback);
  var body = null;
  var myInit = {
    method: 'GET',
    body: body,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  let maxCheckupTime = 0;
  return dispatch => {
    db.getFeedbackHistory(ticketId).then((eventsList) => {
      maxCheckupTime = eventsList.maxCheckupTime;
      dispatch(loadFeedbackHistory(eventsList.list));
    }).catch((error) => {
      console.log("Error: getFeedbackHistory 2", error);
    });
    fetch(constants.SERVER_URL + '/feedback/history/' + ticketId + '/' + maxCheckupTime, myInit)
      .then((response) => {
        if (!response.ok) {
          dispatch(saveFeedbackSuccess(false));
        }
        return response.json();
      }).then((responseJson) => {
        responseJson.forEach(element => {
          // if (element.dateTime > maxCheckupTime || maxCheckupTime === 0) {
          delete element.interventionId;
          db.saveFeedbackHistory(schemaType.FEEDBACK_HISTORY, element).then((eventsList) => {
          }).catch((error) => {
            console.log("Error: saveFeedbackToDB | getFeedbackHistoryByTicketId ", error);
          });
          // }
        });
      }).then((eventsList) => {
        db.getFeedbackHistory(ticketId).then((eventsList) => {
          dispatch(loadFeedbackHistory(eventsList.list));
        }).catch((error) => {
          console.log("Error: getFeedbackHistory1 ", error);
        });
      }).catch((error) => {
        console.log("Error: getFeedbackHistory 2", error);
      });

  }
}