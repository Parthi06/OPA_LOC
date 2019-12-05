import * as types from '../Actions/ActionTypes';
import InitialState from './InitialState';
import update from 'immutability-helper';

export default function assetReducer(state = InitialState.assets, action) {
      switch (action.type) {
            case types.LOAD_ALL_ASSETS:
                  return action.assets;
            case types.APPEND_TICKETID_ON_ASSOCIATED_TICKETS:
                  return action.events;
            default:
                  return state;
      }
}

export function loadAssetListReducer(state = InitialState.assetList, action) {
      switch (action.type) {
            case types.LOAD_ASSETS:
                  return action.assetList;
            case types.LOAD_ASSETS_FROM_START:
                  return action.assetList;
            default:
                  return state;
      }
}

export function processedDataReducer(state = InitialState.processedData, action) {
      switch (action.type) {
            case types.LOAD_ALL_PROCESSED_DATA_FOR_AN_ASSET:
                  return action.processedData;
            case types.UPDATE_MOTE_STATE:
                  return { ...state, state: action.eventAction }; 
            default:
                  return state;
      }
}

export function processedDataError(state = false, action) {
      switch (action.type) {
            case types.LOAD_PROCESSED_DATA_HAS_ERROR:
                  return action.hasProcessedDataError;
            default:
                  return state;
      }
}

export function processedDataPending(state = true, action) {
      switch (action.type) {
            case types.LOAD_PROCESSED_DATA_PENDING:
                  return action.isProcessedDataLoading;
            default:
                  return state;
      }
}

export function assetError(state = false, action) {
      switch (action.type) {
            case types.LOAD_ASSET_ERROR:
                  return action.hasAssetsError;
            default:
                  return state;
      }
}

export function assetPending(state = true, action) {
      switch (action.type) {
            case types.LOAD_ASSETS_PENDING:
                  return action.isAssetsLoading;
            default:
                  return state;
      }
}

export function assetCountPending(state = true, action) {
      switch (action.type) {
            case types.LOAD_ASSETS_COUNT_PENDING:
                  return action.isAssetCountLoading;
            default:
                  return state;
      }
}

export function assetPrognosisCount(state = InitialState.assetCount, action) {
      switch (action.type) {
            case types.LOAD_ASSETS_COUNT:
                  return action.assetCount;
            default:
                  return state;
      }
}


export function loadAssetById(state = InitialState.assetList, action) {
      switch (action.type) {
            case types.LOAD_ASSET_BYID:
                  return action.asset;
            default:
                  return state;
      }
}


export function loadassetOperationalInfoReducer(state = InitialState.assetOperationalInfoList,action)
{
    switch(action.type)
    {
      case types.LOAD_ASSET_OPERATIONAL_INFO:
      return action.assetOperationalInfoList;
      default:
            return state;
    }
}

export function oneStepFeedbackResponseReducer(state = false, action)
{
    switch(action.type)
    {
      case types.ONE_STEP_FEEDBACK_RESULT:
            return action.ticketCreated;
      default:
            return state;
    }
}

export function oneStepFeedbackInitiatedReducer(state = false, action)
{
    switch(action.type)
    {
      case types.ONE_STEP_FEEDBACK_API_CALL_INITIATED:
            return action.oneStepFeedbackAPIInitiated;
      default:
            return state;
    }
}

export function loadAllAssetTags (state = InitialState.loadAllAssetTags, action)
{
    switch(action.type)
    {
      case types.LOAD_ASSET_TAGS:
            return action.assetTags;
      default:
            return state;
    }
}

export function loadAllAssetsByCustomerId (state = InitialState.assetsByCustomerId, action)
{
    switch(action.type)
    {
      case types.LOAD_ALL_ASSETS_BY_CUSTOMER_ID:
            return action.assetsByCustomerId;
      default:
            return state;
    }
}
//LOAD_ALL_ASSETS_BY_CUSTOMER_ID