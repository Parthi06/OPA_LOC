import * as types from './ActionTypes';
import * as constants from '../Utils/Constants';
import * as db from '../database/databaseActions';
import * as schemaType from '../schemas/schemaTypes';
import * as  mockData from '../mockApi/mock';
import _ from 'lodash';

export function loadCurrentPageNo(page) {
  return { type: types.LOAD_CUR_EVENT_PAGE, page };
}


export function fetchFeedEventsByAssetId(assetHistoryDetails) {
  return { type: types.FETCH_FEED_EVENT_BY_ASSETID, assetHistoryDetails };
}

export function loadEvents(events) {
  return { type: types.LOAD_EVENTS, events };
}

export function loadNewEvents(events) {

  return { type: types.LOAD_NEW_EVENTS, events };
}

export function loadNewEventInfo(newEventsInfo) {
  return { type: types.LOAD_NEW_EVENTS_INFO, newEventsInfo };
}

export function loadNewEventsPending(bool) {
  return { type: types.LOAD_NEW_EVENT_PENDING, isNewEventLoading: bool };
}

export function loadEventHasError(bool) {
  return { type: types.LOAD_EVENT_ERROR, hasEventError: bool };
}

export function saveUserPostSuccess(bool) {
  return { type: types.SAVE_USER_POST_SUCCESS, isSaveUserPostSuccess: bool };
}

export function loadEventsPending(bool) {
  return { type: types.LOAD_EVENT_PENDING, isEventLoading: bool };
}

export function loadEventsComplete(isEventLoadingComplete) {
  return { type: types.LOAD_EVENT_COMPLETE, isEventLoadingComplete };
}

export function appendEventCommentonEvents(events) {
  return { type: types.APPEND_EVENT_COMMENT_ON_EVENTS, events };
}

export function appendTicketCommentonEvents(events) {
  return { type: types.APPEND_TICKET_COMMENT_ON_EVENTS, events };
}

export function appendEventFollowonEvents(events) {
  return { type: types.APPEND_EVENT_FOLLOW_ON_EVENTS, events };
}

export function appendUserEventOnEvents(events) {
  return { type: types.APPEND_USER_EVENT_ON_EVENTS, events };
}

export function appendEventsLastUpdated(lastUpdated) {
  return { type: types.EVENTS_LAST_UPDATED, lastUpdated };
}

export function appendEventsOnNewTicket(events) {
  return { type: types.APPEND_EVENTS_ON_NEW_TICKET, events };
}

//'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJyb2JlcnRAb25jZWxhYnMuY29tIiwiZXhwIjoxNTIzMDA0Nzc4fQ.F4xQTvOGc-zrSIblt8TXWYSLiVANerrdij5sHksfg1yGXSk9RfUr_806J0w1YEZ1TO_fbzbyZfGFEIecUoiPWA'
export function loadEventsFromApi(customerId, userId, page, limit, isNewFeedsAvailable) {
  var body = null;
  var myInit = {
    method: 'GET',
    body: body,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  return dispatch => {
    dispatch(loadEventsPending(true));
    fetch(constants.SERVER_URL + `/events?customer=${customerId}&user=${userId}&page=${page}&limit=${limit}`, myInit)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }

        return response.json();
        // return mockData.MOCK_DATA;
      })
      .then((response) => {
        response.UserFeed.forEach(element => {
          db.save(schemaType.MAIN_SCHEMA, schemaType.USER_SCHEMA, element).then().catch((error) => {
            console.log("Error: loadEventsFromApi | UserFeed", error);
            // checkIfExists(schemaType.USER_SCHEMA, element);
          });
        });
        response.AssetFeed.forEach(element => {
          db.save(schemaType.MAIN_SCHEMA, schemaType.ASSET_SCHEMA, element).then().catch((error) => {
            console.log("Error: loadEventsFromApi | AssetFeed", error);
            // checkIfExists(schemaType.ASSET_SCHEMA, element);
          });
        });
        response.TicketFeed.forEach(element => {
          db.save(schemaType.MAIN_SCHEMA, schemaType.TICKET_SCHEMA, element).then().catch((error) => {
            console.log("Error: loadEventsFromApi | TicketFeed", error);
            // checkIfExists(schemaType.TICKET_SCHEMA, element);
          });
        });
      })
      .then(() => {
        db.findAll(schemaType.MAIN_SCHEMA).then((eventsList) => {
          dispatch((isNewFeedsAvailable && page == 1) ? loadNewEvents(eventsList) : loadEvents(eventsList));
          return (eventsList.length > 0) ? eventsList : [];
        }).catch((error) => {
          dispatch(loadEventsPending(false));
          dispatch(loadEventsComplete(true));
          dispatch(loadEventHasError(true));
          console.log(`Error: loadEventsFromApi : findAll`, error);
        });
      }).then((responseJson) => {
        dispatch((responseJson == null || responseJson == "" || responseJson == undefined) ? loadEventsComplete(true) : loadEventsComplete(false));
        dispatch(loadEventsPending(false));
      })
      .catch((error) => {// TODO retry
        dispatch(loadEventsPending(false));
        dispatch(loadEventsComplete(true));
        dispatch(loadEventHasError(true));
      });
  };
}

export function saveEventComentUsingAPI(comment, type) {
  var body = JSON.stringify(comment);
  var headers = new Headers({
    "Content-Type": "application/json"
  });
  var param = {
    method: 'POST',
    body: body,
    headers: headers
  };
  return dispatch => {
    db.updateCommetsOnDb(comment, type).then((eventsList) => {
      dispatch(appendEventCommentonEvents(eventsList));
      fetch(constants.SERVER_URL + '/events/Eventcomments/create', param)
        .then((response) => response.json())
        .catch((error) => {
          console.error(error);
        });
    }).catch((error) => {
      console.log("Error: updateEventCommetsOnDb |", error);
    });
  }
}

export function saveTicketComentUsingAPI(comment, type) {
  var body = JSON.stringify(comment);
  var headers = new Headers({
    "Content-Type": "application/json"
  });
  var param = {
    method: 'POST',
    body: body,
    headers: headers
  };
  return dispatch => {
    db.updateCommetsOnDb(comment, type).then((eventsList) => {
      dispatch(appendTicketCommentonEvents(eventsList));
      fetch(constants.SERVER_URL + '/events/Ticketcomments/create', param)
        .then((response) => { response.json() })
        .catch((error) => {
          console.error(error);
        });
    }).catch((error) => {
      console.log("Error: saveTicketComentUsingAPI |", error);
    });
  }
}

export function updateFollowToDB(EventFollow) {
  var body = JSON.stringify(EventFollow);
  var headers = new Headers({
    "Content-Type": "application/json"
  });

  var param = {
    method: 'POST',
    body: body,
    headers: headers
  };

  return dispatch => {
    var schemaName = "";
    if (EventFollow.eventFollowId.feedType == "UE") {
      schemaName = schemaType.USER_SCHEMA;
    } else if (EventFollow.eventFollowId.feedType == "AE") {
      schemaName = schemaType.ASSET_SCHEMA;
    } else {
      schemaName = schemaType.TICKET_SCHEMA;
    }
    db.updateFollowStatusOnDb(schemaName, EventFollow.eventFollowId.eventId, EventFollow.followFlag).then((eventsList) => {
      dispatch(appendEventFollowonEvents(eventsList));
      fetch(constants.SERVER_URL + '/events/follow/update', param)
        .then((response) => response.json())
        .catch((error) => {
          console.error(error);
        });
    }).catch((error) => {
      console.log("Error: updateFollowStatusOnDb |", error);
    });
  }
}


export function checkForNewFeeds(customerId, latestEventTimestamp, countOfAE, countOfUE, countOfT, userId, eventLastUpdated) {

  var body = null;
  var myInit = {
    method: 'GET',
    body: body,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  return dispatch => {
    db.getLastUpdateDate(eventLastUpdated).then((data) => {
      var queryBuilder = "";
      queryBuilder += "/events/new?customer=" + customerId + "&user=" + userId + "&userEventLastUpdated=" + data.userEventLastUpdated;
      queryBuilder += "&assetEventLastUpdated=" + data.assetEventLastUpdated;
      queryBuilder += "&ticketEventLastUpdated=" + data.ticketEventLastUpdated;
      fetch(constants.SERVER_URL + queryBuilder, myInit)
        .then((response) => {
          return response.json();
          // return mockData.MOCK_DATA;
        })
        .then((responseJson) => {
          try {                
             // console.log('resoponse is ' + JSON.stringify(responseJson))

            responseJson.TicketFeed.forEach(element => {
              //If there are ticket feeds then get the new user and asset feeds from newfeed schema and check
              //for events corresponding to those tickets.
               //to delete UE or AE when a ticket corresponding to it arrives
               if(element.feedType == "UT"){
                  db.removeAssociatedEventForNewTickets(schemaType.USER_SCHEMA, element.eventId).then((eventsList) => {
                  dispatch(appendEventsOnNewTicket(eventsList));
                  // dispatch(appendTicketIdOnAssociatedTickets(eventsList));
                  }).catch((error) => {
                    console.log("Error: removeAssociatedEventForNewTickets | UserEvent", error);
                  });
              } else if(element.feedType == "AT"){
                  db.removeAssociatedEventForNewTickets(schemaType.ASSET_SCHEMA, element.eventId).then((eventsList) => {
                  dispatch(appendEventsOnNewTicket(eventsList));
                  // dispatch(appendTicketIdOnAssociatedTickets(eventsList));
                  }).catch((error) => {
                    console.log("Error: removeAssociatedEventForNewTickets | AssetEvent", error);
                  });
              }
              eventLastUpdated.ticketFeed = element.lastUpdated;
              db.saveNewFeed(schemaType.NEWFEED_SCHEMA, schemaType.NEWFEED_TICKET_SCHEMA, element).then().catch((error) => {
                console.log("Error: loadEventsFromApi | TicketFeed", error);
              });
            })
            responseJson.UserFeed.forEach((element, index) => {
                eventLastUpdated.userFeed = element.lastUpdated;
                db.saveNewFeed(schemaType.NEWFEED_SCHEMA, schemaType.NEWFEED_USER_SCHEMA, element).then().catch((error) => {
                  console.log("Error: loadEventsFromApi | UserFeed", error);
                });
            });
            responseJson.AssetFeed.forEach(element => {
           //   console.log('\n' + element +' Asset feed coubnnt' )

                eventLastUpdated.assetFeed = element.lastUpdated;
                db.saveNewFeed(schemaType.NEWFEED_SCHEMA, schemaType.NEWFEED_ASSET_SCHEMA, element).then().catch((error) => {
                  console.log("Error: loadEventsFromApi | AssetFeed", error);
                });
            });
          }
          catch (e) {
            console.log("Error: checkForNewFeeds", e);
          }
        }).then(() => {
          db.getEventsCount().then((returnData) => {
            if (countOfAE != returnData.countOfAE || countOfUE != returnData.countOfUE || countOfT != returnData.countOfT)
              dispatch(loadNewEventInfo(returnData));
          }).catch((error) => {
            
            console.log("Error: loadEventsFromApi | AssetFeed", error);
          });
        }).then((returnData) => {
          dispatch(appendEventsLastUpdated(eventLastUpdated));
        })
        .catch((error) => {
          console.error(error);
        });
    }).catch((error) => {
      console.log("Error: checkForNewFeeds |", error);
    });
  };
}

export function saveUserEventUsingAPI(event) {
  var body = JSON.stringify(event);
  var headers = new Headers({
    "Content-Type": "application/json"
  });

  var param = {
    method: 'POST',
    body: body,
    headers: headers
  };

  return dispatch =>
    fetch(constants.SERVER_URL + '/events/create', param)
      .then((response) => {
        if (!response.ok) {
          dispatch(saveUserPostSuccess(false));
        }
        dispatch(saveUserPostSuccess(true));
        return response.json();
      })
      .then((responseJson) => {
        db.saveNewFeed(schemaType.MAIN_SCHEMA, schemaType.USER_SCHEMA, responseJson).then((respose) => {
          db.findAll(schemaType.MAIN_SCHEMA).then((eventsList) => {
            dispatch(appendUserEventOnEvents(eventsList));
          }).catch((error) => {
            dispatch(saveUserPostSuccess(false));
            console.log(`Error: saveUserEventUsingAPI : findAll`, error);
          });
        }).catch((error) => {
          dispatch(saveUserPostSuccess(false));
          console.log(`Error: saveNewFeed : saveNewFeed`, error);
        });
      })
      .catch((error) => {
        dispatch(saveUserPostSuccess(false));
        console.log(`Error: saveNewFeed2 : saveNewFeed2`, error);
      });
}

//Currently Not Using
function checkIfExists(schemaName, event) {
  console.log("checkIfExists", JSON.stringify(event));
  db.updateById(schemaName, event).then((event) => {
  }).catch((error) => {
    console.log("Error: checkIfExists |", schemaName, error);
  });
}

export function loadEventsFromDb(customerId, userId, page, limit, isNewFeedsAvailable) {
  var body = null;
  var myInit = {
    method: 'GET',
    body: body,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  return dispatch => {
    dispatch(loadEventsPending(true));
    db.findAll(schemaType.MAIN_SCHEMA).then((eventsList) => {
      dispatch((isNewFeedsAvailable && page == 1) ? loadNewEvents(eventsList) : loadEvents(eventsList));
      return (eventsList.length > 0) ? eventsList : [];
    }).catch((error) => {
      console.log(`Error: loadEventsFromApi : findAll`, error);
    });
  };
}

export function updateEventsStateWithNewFeeds(btnId, newEventsInfo) {
  return dispatch => {
    dispatch(loadEventsPending(true));
    db.updateEventsStateWithNewFeeds().then((newfeeedSchema) => {
      return newfeeedSchema;
    }).then((newfeeedSchema) => {
      let objectToArrayHelper = null;
      if (newfeeedSchema.length != 0) {
        if (btnId == 3) {
          newfeeedSchema[0].userFeed.forEach(element => {
            objectToArrayHelper = JSON.parse(JSON.stringify(element));
            objectToArrayHelper.eventComments = _.values(objectToArrayHelper.eventComments);
            db.save(schemaType.MAIN_SCHEMA, schemaType.USER_SCHEMA, objectToArrayHelper).then().catch((error) => {
              console.log("Error: loadEventsFromApi | UserFeed", error);
            });
          });
        }
        else if (btnId == 2) {
          newfeeedSchema[0].assetFeed.forEach(element => {
            objectToArrayHelper = JSON.parse(JSON.stringify(element));
            objectToArrayHelper.eventComments = _.values(objectToArrayHelper.eventComments);
            db.save(schemaType.MAIN_SCHEMA, schemaType.ASSET_SCHEMA, objectToArrayHelper).then().catch((error) => {
              console.log("Error: loadEventsFromApi | UserFeed", error);
            });
          });
        } else if (btnId == 1) {
          newfeeedSchema[0].ticketFeed.forEach(element => {
            objectToArrayHelper = JSON.parse(JSON.stringify(element));
            objectToArrayHelper.eventComments = _.values(objectToArrayHelper.eventComments);
            objectToArrayHelper.ticketComments = _.values(objectToArrayHelper.ticketComments);
            db.save(schemaType.MAIN_SCHEMA, schemaType.TICKET_SCHEMA, objectToArrayHelper).then().catch((error) => {
              console.log("Error: loadEventsFromApi | UserFeed", error);
            });
          });
        }
      }
    }).then(() => {
      db.findAll(schemaType.MAIN_SCHEMA).then((eventsList) => {
        dispatch(loadNewEvents(eventsList));
        dispatch(loadEventsComplete(true));
        deleteNewFeedsOldData(btnId);
        // if (btnId == 3) {
        //   newEventsInfo.countOfUE = 0;
        // } else if (btnId == 2) {
        //   newEventsInfo.countOfAE = 0;
        // } else {
        //   newEventsInfo.countOfT = 0;
        // }
        // dispatch(loadNewEventInfo(newEventsInfo));
      }).catch((error) => {
        console.log(`Error: loadEventsFromApi : findAll`, error);
      });
    }).catch((error) => {
      console.log(`Error: updateEventsStateWithNewFeeds`, error);
    });
  };
}

function deleteNewFeedsOldData(btnId) {
  db.deleteNewFeedsOldData(btnId).then((eventsList) => {
  }).catch((error) => {
    console.log(`Error: deleteNewFeedsOldData : findAll`, error);
  });
}

export function loadFeedEventsByAssetId(assetId, userId, pageValue, pageLimit) {
  var body = null;
  var myInit = {
    method: 'GET',
    body: body,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  return dispatch => {
    //http://localhost:9008/opa_rest/events/eventHistory?assetId=61&userId=1&page=1&limit=10
    fetch(constants.SERVER_URL +'/events/eventHistory?assetId=' + assetId + '&userId= '+userId+'&page='+pageValue+'&limit='+pageLimit,myInit).
    then((resp) => {
        return resp.json();
    }).then((response) => {
      response.AssetFeed.forEach(element => {
        db.save(schemaType.MAIN_SCHEMA, schemaType.ASSET_SCHEMA, element).then().catch((error) => {
          console.log("Error: loadFeedEventsByAssetId | AssetFeed", error);
        });
      });
      response.TicketFeed.forEach(element => {
        db.save(schemaType.MAIN_SCHEMA, schemaType.TICKET_SCHEMA, element).then().catch((error) => {
          console.log("Error: loadFeedEventsByAssetId | TicketFeed", error);
        });
      });
    })
    .then(() => {
          db.findAll(schemaType.MAIN_SCHEMA).then((eventsList) => {        
          dispatch(fetchFeedEventsByAssetId(eventsList));
      }).catch((error)  =>  {
          console.error( 'Error during feed fetch' + error);
      })
   })
  };
}
