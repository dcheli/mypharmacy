import Constants from '../constants';

export default function(state={}, action) {
    switch(action.type){
        case Constants.FETCH_HEALTH_RECORD:
            return action.payload.data;
        default:
            return state;
    };
}