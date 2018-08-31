import Constants from '../constants';

// State argument is not application state, only the state
// this reducer is responsible for.
export default function(state = {}, action) {
    
    switch (action.type) {
      case  Constants.SET_M3PRESCRIPTION_DETAILS:
          console.log(Constants.SET_M3PRESCRIPTION_DETAILS);
        
          return { 
              mym3prescriptions: action.payload
             };
      case Constants.API_STARTS:
          console.log(Constants.API_STARTS);
          if (action.payload === Constants.SET_M3PRESCRIPTION_DETAILS) {
              return {
                  ...state,
                  isLoadingData: true
              };
          }
          break;
      case Constants.API_END:
          console.log(Constants.API_END);
          if (action.payload === Constants.SET_M3PRESCRIPTION_DETAILS) {
          return {
              ...state,
              isLoadingData: false
              };
          }
          break;
      default:
        return state;
    }
  }