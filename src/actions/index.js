import Constants  from '../constants';
import axios from 'axios';
//const ROOT_URL = 'http://localhost:5000';

export const fetchDemographics = (myId) => (dispatch) => {

    axios.get(Constants.ROOT_URL + '/api/healthrecord/' + myId + '/demographics')
        .then (({data}) => {
            dispatch(setDemographicDetails(data));
        });
};


function setDemographicDetails(data) {
    return {
        type: Constants.SET_DEMOGRAPHIC_DETAILS,
        payload: data
    };
}

export const fetchAllergies = (myId) => (dispatch) => {
    axios.get(Constants.ROOT_URL + '/api/healthrecord/' + myId + '/allergies')
        .then (({data}) => {
            dispatch(setAllergyDetails(data));
        });
};


function setAllergyDetails(data) {
    return {
        type: Constants.SET_ALLERGY_DETAILS,
        payload: data
    };
}

export const fetchMedications = (myId) => (dispatch) => {
    axios.get(Constants.ROOT_URL + '/api/healthrecord/' + myId + '/medications')
        .then (({data}) => {
            dispatch(setMedicationDetails(data));
        });
};


function setMedicationDetails(data) {
    return {
        type: Constants.SET_MEDICATION_DETAILS,
        payload: data
    };
}

export const fetchProviders = (myId) => (dispatch) => {
    axios.get(Constants.ROOT_URL + '/api/healthrecord/' + myId + '/providers')
        .then (({data}) => {
            dispatch(setProviderDetails(data));
        });
};


function setProviderDetails(data) {
    return {
        type: Constants.SET_PROVIDER_DETAILS,
        payload: data
    };
};


export const fetchM3Prescriptions = () => (dispatch) => {
    axios.get(Constants.ROOT_URL + '/api/m3/m3scripts')
        .then (({data}) => {
            console.log("Data length is ", data.length)
            if(data.length === 0)
                dispatch({ type: Constants.NOT_FOUND })
            dispatch(setM3PrescriptionDetails(data));
        });
};


function setM3PrescriptionDetails(data) {
    console.log("M3 data is ", data);
    console.log("Type is ", Constants.SET_M3PRESCRIPTION_DETAILS);
    
    return {
        type: Constants.SET_M3PRESCRIPTION_DETAILS,
        payload: data
    };
};



export const fetchMyM3Prescriptions = () => (dispatch) => {
    axios.get(Constants.ROOT_URL + '/api/m3/' +Constants.ETH_ADDRESS + '/pharmacyscripts')
        .then (({data}) => {
            console.log("data is ", data);
            if(data.length === 0)
                dispatch({ type: Constants.NOT_FOUND })
            dispatch(setM3PrescriptionDetails(data));
        });
};

export const fetchMyPatientShares = (address) => (dispatch) => {
    axios.get(Constants.ROOT_URL + '/api/getkeyevents/' + address)
    .then(({data}) => {
        if(data.length === 0) 
            dispatch({type: Constants.NOT_FOUND})
        dispatch(setMyPatientShareDetails(data));
    });
};

function setMyPatientShareDetails(data) {
    return {
        type: Constants.SET_MYPATIENT_SHARE_DETAILS,
        payload: data
    };
};




