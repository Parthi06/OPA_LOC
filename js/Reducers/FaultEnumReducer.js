import * as types from '../Actions/ActionTypes';
import InitialState from './InitialState';

export default function faultEnumReducer(state = InitialState.faultEnums,action)
{
     switch(action.type)
     {
       case types.LOAD_FAULT_ENUMS:
        return action.faultEnums;
       default:
        return state;
     }
}
