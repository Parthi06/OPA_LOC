import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import eventReducer from "./EventReducer";
import { eventError, eventPending, eventLoadingComplete, ticketCreatedSuccess, feedbackSaveSuccess, userPostSaveSuccess, ticketAssignedSaveSuccess, feedbackSaveError, fetchTicketEventReducer, newEventInfoReducer, newEventPending, curEventPage, eventLastUpdated, loadFeedbackHistory, loadTicketHistory, assetHistoryDetailsReducer, openTicketsIdWithAssetDetails } from "./EventReducer";
import assetReducer from "./AssetReducer";
import { assetError, assetPending, assetPrognosisCount, loadAssetListReducer, assetCountPending, processedDataReducer, processedDataPending, processedDataError, loadAssetById, loadassetOperationalInfoReducer, loadAllAssetTags, oneStepFeedbackInitiatedReducer, oneStepFeedbackResponseReducer, loadAllAssetsByCustomerId } from "./AssetReducer";
import loginReducer from "./LoginReducer";
import { loginError, loginPending, userLogin, changePassword, changePasswordError, tokenExpireStatus,appUpgradationStatus } from "./LoginReducer";
import userReducer from "./UserReducer";
import { userError, userPending } from "./UserReducer";
import faultEnumReducer from "./FaultEnumReducer";
import loadMetricsDetailsReducer from './HelpReducer';

const rootReducer = (state, action) => {
  if (action.type == 'LOGOUT') {
    console.log("CLEAR REDUX DATA")
    state = undefined;
  }
  return appReducer(state, action);
}

const appReducer = combineReducers({
  form: formReducer,
  eventReducer,
  eventError,
  eventPending,
  eventLoadingComplete,
  newEventPending,
  newEventInfoReducer,
  curEventPage,
  fetchTicketEventReducer,
  feedbackSaveError,
  ticketCreatedSuccess,
  userPostSaveSuccess,
  feedbackSaveSuccess,
  ticketAssignedSaveSuccess,
  loginReducer,
  loginError,
  loginPending,
  userLogin,
  userReducer,
  userError,
  userPending,
  assetReducer,
  assetError,
  assetPending,
  loadAssetListReducer,
  processedDataReducer,
  processedDataError,
  processedDataPending,
  assetPrognosisCount,
  assetCountPending,
  faultEnumReducer,
  eventLastUpdated,
  loadAssetById,
  loadassetOperationalInfoReducer,
  loadFeedbackHistory,
  loadTicketHistory,
  changePassword,
  changePasswordError,
  tokenExpireStatus,
  assetHistoryDetailsReducer,
  appUpgradationStatus,
  openTicketsIdWithAssetDetails,
  loadAllAssetTags,
  oneStepFeedbackResponseReducer,
  oneStepFeedbackInitiatedReducer,
  loadMetricsDetailsReducer,
  loadAllAssetsByCustomerId
});

export default rootReducer;
