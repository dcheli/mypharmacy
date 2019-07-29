import { combineReducers } from 'redux';
import DemographicsReducer from './demographics';
import AllergiesReducer from './allergies';
import MedicationsReducer from './medications';
import ProvidersReducer from './providers';
import MyM3Prescriptions from './mym3prescriptions';
import PatientShares from './patientshares';

const rootReducer = combineReducers({
  demographics: DemographicsReducer,
  allergies: AllergiesReducer,
  medications: MedicationsReducer,
  providers: ProvidersReducer,
  mym3prescriptions: MyM3Prescriptions,
  patientShares: PatientShares
});

export default rootReducer;
