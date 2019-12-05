import * as types from './ActionTypes';
import * as constants from '../Utils/Constants';
import * as db from '../database/databaseActions';
import * as schemaType from '../schemas/schemaTypes';

export function appendEventsOnTicketUpdation(events) {
  return { type: types.APPEND_EVENTS_ON_TICKET_UPDATION, events };
}

export function loadOpenTicketsIdWithAssetDetails( openTicketsIdWithAssetDetailsObj ) {
  return { type: types.LOAD_FETCHED_OPEN_TICKETS_ID, openTicketsIdWithAssetDetailsObj };
}

export function loadFetchedTicketEvent(ticketEvent) {
  return { type: types.LOAD_FETCHED_TICKET_EVENT, ticketEvent };
}

export function appendEventsOnTicketCreation(events) {
  return { type: types.APPEND_EVENTS_ON_TICKET_CREATION, events };
}

export function appendTicketIdOnAssociatedTickets(events) {
  return { type: types.APPEND_TICKETID_ON_ASSOCIATED_TICKETS, events };
}

export function appendEventsOnTicketAssignedChange(events) {
  return { type: types.APPEND_EVENTS_ON_TICKET_ASSIGNED_CHANGE, events };
}

export function saveTicketAssignedToSuccess(bool) {
  return { type: types.SAVE_TICKET_ASSIGNED_TO_SUCCESS, isAssignedToSaveSuccess: bool };
}

export function ticketCreatedSuccess(bool) {
  return { type: types.TICKET_CREATED_SUCCESS, isTicketCreatedSuccess: bool };
}

export function loadTicketHistory(historylist) {
  return { type: types.TICKET_HISTORY, historylist: historylist };
}


export function saveTicketDataToDB(ticket, assetId) {
  var body = JSON.stringify(ticket);
  var headers = new Headers({
    "Content-Type": "application/json"
  });

  var param = {
    method: 'POST',
    body: body,
    headers: headers
  };
  return dispatch =>
    fetch(constants.SERVER_URL + '/tickets/create/' + assetId, param)
      .then((response) => {
        if (!response.ok) {
          dispatch(ticketCreatedSuccess(false));
        }

        dispatch(ticketCreatedSuccess(true));
        return response;
      })
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {
        if (ticket.feedType == "AE") {
          db.updateAssignedStatus(schemaType.ASSET_SCHEMA, ticket.eventId).then((eventsList) => {
            dispatch(appendEventsOnTicketCreation(eventsList));
            dispatch(appendTicketIdOnAssociatedTickets(eventsList));
          }).catch((error) => {
            console.log("Error: updateAssignedStatus | AssetEvent", error);
          });
        } else if (ticket.feedType == "UE") {
          db.updateAssignedStatus(schemaType.USER_SCHEMA, ticket.eventId).then((eventsList) => {
            dispatch(appendEventsOnTicketCreation(eventsList));
            dispatch(appendTicketIdOnAssociatedTickets(eventsList));
          }).catch((error) => {
            console.log("Error: updateAssignedStatus | UserEvent", error);
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
        dispatch(ticketCreatedSuccess(false));
      });
}

export function closeTicketUsingAPI(ticket, userId) {
  var body = JSON.stringify(ticket);
  var headers = new Headers({
    "Content-Type": "application/json"
  });
  var param = {
    method: 'POST',
    body: body,
    headers: headers
  };
  return dispatch =>
    fetch(constants.SERVER_URL + '/tickets/close/' + userId, param)
      .then((response) => { console.log("response", response); return response.json() })
      .then((responesJson) => {
        ticket.ticketState = responesJson.ticketState;
        db.closeTicket(schemaType.TICKET_SCHEMA, ticket).then((eventsList) => {
          dispatch(appendEventsOnTicketUpdation(eventsList));
        }).catch((error) => {
          console.log("Error: closeTicket", error);
        });
      })
      .catch((error) => {
        console.error(error);
      });

}

export function fetchTicketEventFromAPI(ticketId) {
  var body = null;
  var param = {
    method: 'POST'
  };

  return dispatch =>
    fetch(constants.SERVER_URL + '/events/ticketEvent/' + ticketId, param)
      .then((response) => response.json())
      .then((responseJson) => {
        dispatch(loadFetchedTicketEvent(responseJson));
      })
      .catch((error) => {
        console.error(error);
      });
}

export function updateTicketAssignedToDB(ticketId, ticketAssignedToName, eventId, ticketAssignedTo, userId) {
  var body = null;
  var headers = new Headers({
    "Content-Type": "application/json"
  });

  var param = {
    method: 'POST',
    body: body,
    headers: headers
  };
  console.log("ticketAssignedTo", ticketAssignedTo)
  return dispatch =>
    db.updateTicketAssignedToDB(schemaType.TICKET_SCHEMA, ticketAssignedToName, eventId, ticketAssignedTo).then((events) => {
      dispatch(saveTicketAssignedToSuccess(true));
      dispatch(appendEventsOnTicketAssignedChange(events));
      fetch(constants.SERVER_URL + '/tickets/update/' + ticketId + "/" + userId + "/" + ticketAssignedTo, param)
        .then((response) => {
          if (!response.ok) {
            dispatch(saveTicketAssignedToSuccess(false));
          }
          return response;
        })
        .catch((error) => {
          dispatch(saveTicketAssignedToSuccess(false));
        });
    }).catch((error) => {
      console.log("Error: updateTicketAssignedToDB ", error);
    });

}



export function getTicketHistoryByTicketId(ticketId) {
  // var body = JSON.stringify(feedback);
  var body = null;
  var myInit = {
    method: 'GET',
    body: body,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  let updatedAt;
  return dispatch => {
    db.getTicketHistoryByTicketId(ticketId).then((eventsList) => {
      dispatch(loadTicketHistory(eventsList));
    }).catch((error) => {
      console.log("Error: getTicketHistoryByTicketId 1 ", error);
    });


    fetch(constants.SERVER_URL + '/tickets/history/' + ticketId, myInit)
      .then((response) => {
        if (!response.ok) {
          console.log("getTicketHistoryByTicketId Response Error")
        }
        return response.json();
      }).then((responseJson) => {
        responseJson.forEach(element => {
          db.saveTicketHistory(schemaType.TICKET_HISTORY, element).then((eventsList) => {
          }).catch((error) => {
            console.log("Error: saveTicketHistory ", error);
          });
        });
      }).then((eventsList) => {
        db.getTicketHistoryByTicketId(ticketId).then((eventsList) => {
          dispatch(loadTicketHistory(eventsList));
        }).catch((error) => {
          console.log("Error: getTicketHistoryByTicketId 1 ", error);
        });
      }).catch((error) => {
        console.log("Error: getTicketHistoryByTicketId 2", error);
      });
  }
}

export function fetchOpenTicketsIdsWithAssetDetails( assetId ) {
  var myInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  return dispatch =>
    fetch( constants.SERVER_URL + '/assets/getAssetDetailsWithOpenTicketsId/' + assetId, myInit )
      .then( ( response ) => response.json())
      .then( ( responseJson ) => {
          console.log( JSON.stringify( responseJson ) + '')
          dispatch( loadOpenTicketsIdWithAssetDetails( responseJson ) );
      })
      .catch((error) => {
          console.error('Error in fetchOpenTicketsIdsWithAssetDetails api call '+error);
      });
}