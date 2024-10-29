/* Amplify Params - DO NOT EDIT
    API_CHECKMENOWAPI_GRAPHQLAPIENDPOINTOUTPUT
    API_CHECKMENOWAPI_GRAPHQLAPIIDOUTPUT
    API_CHECKMENOWAPI_GRAPHQLAPIKEYOUTPUT
    ENV
    REGION
Amplify Params - DO NOT EDIT */

const axios = require('axios');
const qs = require('qs');
const graphql = require('graphql');
const AWS = require('aws-sdk');
const { print } = graphql;
const consts = require('./consts')
const { updateUserDetails, getUserDetails } = consts;
const convenetApi = require('./convenetApi');
const medicalRecordsProcessing = require('./medicalRecordsProcessing');

const getUserDetailsById = async (userId) => {
    try {
        const getConfig = {
            url: process.env.API_CHECKMENOWAPI_GRAPHQLAPIENDPOINTOUTPUT,
            method: 'post',
            headers: {
                'x-api-key': process.env.API_CHECKMENOWAPI_GRAPHQLAPIKEYOUTPUT
            },
            data: {
                query: print(getUserDetails),
                variables: {
                    id: userId
                }
            }
        };

        console.log("getConfig");
        console.log(getConfig);

        const graphqlGetData = await axios(getConfig);
        console.log("graphqlGetData");
        console.log(graphqlGetData.data.data);
        const userDetails = graphqlGetData.data.data.getUserDetails;
        return userDetails;
    } catch (error) {
        console.log('error getting user details: ', error);
    }
}

const updatePatient = async (userDetails, linkageKey, accountID, gpOdsCode, patientId, herAccessGranted) => {
    try {
        console.log("patientId");
        console.log(patientId);

        const updateConfig = {
            url: process.env.API_CHECKMENOWAPI_GRAPHQLAPIENDPOINTOUTPUT,
            method: 'post',
            headers: {
                'x-api-key': process.env.API_CHECKMENOWAPI_GRAPHQLAPIKEYOUTPUT
            },
            data: {
                query: print(updateUserDetails),
                variables: {
                    input: {
                        id: userDetails.id,
                        herAccessGranted: herAccessGranted,
                        patientId: patientId,
                        linkageKey: linkageKey,
                        accountID: accountID,
                        gpOdsCode: gpOdsCode,
                        expectedVersion: userDetails.version
                    }
                }
            }
        };

        console.log("updateConfig");
        console.log(updateConfig);

        const graphqlUpdateData = await axios(updateConfig);

        console.log("graphqlUpdateData")
        console.log(JSON.stringify(graphqlUpdateData.data))

    } catch (err) {
        console.log('error updating patient id: ', err);
    }
}

exports.handler = async (event) => {

    console.log(process);
    console.log(event)

    let linkingResult = null;
    let practiceSettings = null;
    let patientSettings = null;
    let herAccessGranted = null;
    let userDetailsResult = null;
    let userDetails = null;
    const patientData = event.arguments.linkUserToPatientInput;
    try {
        userDetails = await getUserDetailsById(patientData.userId);
        console.log("userDetails")
        console.log(userDetails)
        if (userDetails.isTester) {
            if(patientData.linkageKey===userDetails.linkageKey && 
                patientData.accountID===userDetails.accountID && 
                patientData.gpOdsCode===userDetails.gpOdsCode){
                linkingResult = { "PatientId": patientData.userId, "RequestId": patientData.userId };
                await updatePatient(userDetails, patientData.linkageKey, patientData.accountID, patientData.gpOdsCode, linkingResult.PatientId, true);
            } else {
                throw 'Invalid linkage key details';
            }
        } else {
            const secretString = await convenetApi.getConvenetAPISecrets(process.env.REGION, process.env.ENV);
            const secret = JSON.parse(secretString);
            const authorisation = await convenetApi.authorise(secret.client_id, secret.client_secret);
            linkingResult = await convenetApi.linkPatient(patientData.surname, patientData.dateOfBirth, patientData.linkageKey, patientData.accountID, patientData.gpOdsCode, authorisation.access_token);
            practiceSettings = await convenetApi.getPracticeSettings(patientData.gpOdsCode, authorisation.access_token);
            patientSettings = await convenetApi.getPatientSettings(linkingResult.PatientId, authorisation.access_token);
            herAccessGranted = practiceSettings && patientSettings &&
                practiceSettings.services.medicalRecordSupported &&
                patientSettings.medicalRecordEnabled;
            await updatePatient(userDetails, patientData.linkageKey, patientData.accountID, patientData.gpOdsCode, linkingResult.PatientId, herAccessGranted);
            if (herAccessGranted){
                userDetailsResult = await medicalRecordsProcessing.doProductionProcessing(userDetails, secret);
            }
        }
    } catch (err) {
        console.log(err)
        return {
            statusCode: 500,
            error: JSON.stringify(err)
        }
    }

    // TODO implement
    const response = {
        statusCode: 200,
        herAccessGranted: herAccessGranted,
        patientId: linkingResult.patientId,
        userStatus: userDetailsResult?userDetailsResult.userStatus:null,
        vaccineName: userDetailsResult?userDetailsResult.vaccineName:null,
    };
    return response;
};
