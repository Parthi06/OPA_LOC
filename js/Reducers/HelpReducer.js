import * as types from '../Actions/ActionTypes';
import InitialState from './InitialState';

export default function loadMetricsDetailsReducer(state = InitialState.metrics, action)
{
     switch(action.type)
     {
       case types.FETCH_GRAPH_METRICS:
            return action.metrics;
       default:
            return state;
     }
}
