import * as types from '../Actions/ActionTypes';
import InitialState from './InitialState';

export default function eventReducer(state = InitialState.events, action) {
      switch (action.type) {
            case types.LOAD_EVENTS:
                  return action.events;
                  break;

            case types.APPEND_USER_EVENT_ON_EVENTS:
                  //console.log("APPEND_USER_EVENT_ON_EVENTS", action.events)
                  return action.events;
                  break;

            case types.APPEND_EVENT_COMMENT_ON_EVENTS:
                  return action.events;
                  break;

            case types.APPEND_TICKET_COMMENT_ON_EVENTS:
                  return action.events;
                  break;

            case types.APPEND_EVENT_FOLLOW_ON_EVENTS:
                  return action.events;
                  break;

            case types.LOAD_NEW_EVENTS:
                  return action.events;
                  break;

            case types.APPEND_EVENTS_ON_TICKET_UPDATION:
                  // var indexOfEvent = null;
                  // state.map((item, index) => { if (item.eventId == action.ticket.eventId) { indexOfEvent = index; } });
                  // const newStateAfterTicketAppend = update(state, {
                  //       [indexOfEvent]: {
                  //             ticketState: { $set: action.ticket.ticketState },
                  //             ticketClosedBy: { $set: action.ticket.ticketClosedBy },
                  //             ticketLastUpdated: { $set: action.ticket.ticketLastUpdated },
                  //             ticketReopenedDate: { $set: action.ticket.ticketReopenedDate },
                  //             hasFeedback: { $set: action.ticket.hasFeedback }
                  //       }
                  // });
                  return action.events;
                  break;

            case types.APPEND_EVENTS_ON_TICKET_CREATION:
                  // var indexOfEvent = null;
                  // state.map((item, index) => { if (item.eventId == action.ticket.eventId) { indexOfEvent = index; } });
                  // const newStateAfterTicketCreation = update(state, {
                  //       [indexOfEvent]: {
                  //             eventHasTicket: { $set: "YES" }
                  //       }
                  // });
                  return action.events;
            case types.APPEND_EVENTS_ON_NEW_TICKET:              
                  return action.events;

            case types.APPEND_SAVED_FEEDBACK_TO_EVENTS:
                  // var indexOfEvent = null;
                  // state.map((item, index) => { if (item.ticketId == action.feedback.ticketId) { indexOfEvent = index; } });
                  // const newStateAfterFeedbackAppend = update(state, {
                  //       [indexOfEvent]: {
                  //             checkupResult: { $set: action.feedback.checkupResult },
                  //             diagnosis: { $set: action.feedback.checkupFaultDiagnosisEnum },
                  //             hasFeedback: { $set: "Y" }
                  //       }
                  // });
                  return action.events;

            case types.APPEND_EVENTS_ON_TICKET_ASSIGNED_CHANGE:

                  // var indexOfEvent = null;
                  // state.map((item, index) => { if (item.ticketId == action.assignedPerson.ticketId) { indexOfEvent = index; } });
                  // const newStateAfterassignedPersonAppend = update(state, {
                  //       [indexOfEvent]: {
                  //             ticketAssignedTo: { $set: action.assignedPerson.assignedPerson }
                  //       }
                  // });
                  //console.log("action evnts", action.events[0].ticketFeed);
                  return action.events;

            default:
                  return state;
      }
}

export function curEventPage(state = 1, action) {
      switch (action.type) {
            case types.LOAD_CUR_EVENT_PAGE:
                  return action.page;
                  break;
            default:
                  return state;
      }
}

export function fetchTicketEventReducer(state = InitialState.ticketEvent, action) {
      switch (action.type) {
            case types.LOAD_FETCHED_TICKET_EVENT:
                  return action.ticketEvent;
            default:
                  return state;
      }
}

export function eventError(state = false, action) {
      switch (action.type) {
            case types.LOAD_EVENT_ERROR:
                  return action.hasEventError;
                  break;
            default:
                  return state;
      }
}

export function feedbackSaveError(state = false, action) {
      switch (action.type) {
            case types.SAVE_FEEDBACK_HAS_ERROR:
                  return action.hasFeedbackSaveError;
                  break;
            default:
                  return state;
      }
}

export function feedbackSaveSuccess(state = false, action) {
      switch (action.type) {
            case types.SAVE_FEEDBACK_SUCCESS:
                  return action.isFeedbackSavedSuccess;
                  break;
            default:
                  return state;
      }
}

export function ticketAssignedSaveSuccess(state = false, action) {
      switch (action.type) {
            case types.SAVE_TICKET_ASSIGNED_TO_SUCCESS:
                  return action.isAssignedToSaveSuccess;
                  break;
            default:
                  return state;
      }
}

export function userPostSaveSuccess(state = false, action) {
      switch (action.type) {
            case types.SAVE_USER_POST_SUCCESS:
                  return action.isSaveUserPostSuccess;
                  break;
            default:
                  return state;
      }
}

export function ticketCreatedSuccess(state = false, action) {
      switch (action.type) {
            case types.TICKET_CREATED_SUCCESS:
                  return action.isTicketCreatedSuccess;
                  break;
            default:
                  return state;
      }
}

export function eventPending(state = true, action) {
      switch (action.type) {
            case types.LOAD_EVENT_PENDING:
                  return action.isEventLoading;
                  break;
            default:
                  return state;
      }
}

export function newEventInfoReducer(state = InitialState.newEventsInfo, action) {

      switch (action.type) {
            case types.LOAD_NEW_EVENTS_INFO:
                  return action.newEventsInfo;
                  break;
            default:
                  return state;
      }
}

export function newEventPending(state = true, action) {
      switch (action.type) {
            case types.LOAD_NEW_EVENT_PENDING:
                  return action.isNewEventLoading;
                  break;
            default:
                  return state;
      }
}


export function eventLoadingComplete(state = false, action) {
      switch (action.type) {
            case types.LOAD_EVENT_COMPLETE:
                  return action.isEventLoadingComplete;
                  break;
            default:
                  return state;
      }
}

export function eventLastUpdated(state = InitialState.lastUpdated, action) {
      switch (action.type) {
            case types.EVENTS_LAST_UPDATED:
                  return action.lastUpdated;
                  break;
            default:
                  return state;
      }
}


export function loadFeedbackHistory(state = InitialState.feedbackHistory, action) {
      switch (action.type) {
            case types.LOAD_FEEDBACK_HISTORY:
                  return action.feedbacklist;
                  break;
            default:
                  return state;
      }
}

export function loadTicketHistory(state = InitialState.ticketHistory, action) {
      switch (action.type) {
            case types.TICKET_HISTORY:
                  return action.historylist;
                  break;
            default:
                  return state;
      }
}

export function assetHistoryDetailsReducer(state = InitialState.assetHistoryDetails,action)
{
    switch(action.type)
    {
            case types.FETCH_FEED_EVENT_BY_ASSETID:
                  return action.assetHistoryDetails;
            default:
                  return state;
     }
}

export function openTicketsIdWithAssetDetails( state = InitialState.openTicketsIdWithAssetDetailsObj, action ){
      switch(action.type)
      {
              case types.LOAD_FETCHED_OPEN_TICKETS_ID:
                    return action.openTicketsIdWithAssetDetailsObj;
              default:
                    return state;
       }
}