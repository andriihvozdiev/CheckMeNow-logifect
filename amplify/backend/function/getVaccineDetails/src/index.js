/* Amplify Params - DO NOT EDIT
    API_CHECKMENOWAPI_GRAPHQLAPIENDPOINTOUTPUT
    API_CHECKMENOWAPI_GRAPHQLAPIIDOUTPUT
    API_CHECKMENOWAPI_GRAPHQLAPIKEYOUTPUT
    ENV
    REGION
Amplify Params - DO NOT EDIT */
const axios = require('axios');
const graphql = require('graphql');
const { print } = graphql;
const moment = require('moment');
const consts = require('./consts')
const { updateUserDetails, getUserDetails } = consts;
const convenetApi = require('./convenetApi')
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



const updateUserStatus = async (userId, version, newUserStatus, vaccineName, vaccineDetailsArray) => {
    try {
        const updateUserStatusConfig = {
            url: process.env.API_CHECKMENOWAPI_GRAPHQLAPIENDPOINTOUTPUT,
            method: 'post',
            headers: {
                'x-api-key': process.env.API_CHECKMENOWAPI_GRAPHQLAPIKEYOUTPUT
            },
            data: {
                query: print(updateUserDetails),
                variables: {
                    input: {
                        id: userId,
                        userStatus: newUserStatus,
                        vaccineName: vaccineName,
                        vaccineDetails: vaccineDetailsArray,
                        statusChangedAt: moment().unix(),
                        expectedVersion: version
                    }
                }
            }
        };

        console.log("updateUserStatusConfig");
        console.log(updateUserStatusConfig);

        const graphqlUpdateStatusData = await axios(updateUserStatusConfig);

        console.log("graphqlUpdateStatusData")
        console.log(JSON.stringify(graphqlUpdateStatusData.data))

    } catch (err) {
        console.log('error updating status: ', err);
    }
}

/*async function doTestModeProcessing(userDetails) {
    const statusChangedAt = moment.unix(userDetails.statusChangedAt);
    const hourAgo = moment();
    hourAgo.add(-5, 'minutes');
    if ((userDetails.userStatus == "AWAITING_VACCINATION" ||
        userDetails.userStatus == "FIRST_DOSE_CONFIRMED" ||
        userDetails.userStatus == "VACCINATION_CONFIRMED") &&
        statusChangedAt.isBefore(hourAgo)) {
        let newUserStatus = null;
        if (userDetails.userStatus == "AWAITING_VACCINATION")
            newUserStatus = "FIRST_DOSE_CONFIRMED";
        if (userDetails.userStatus == "FIRST_DOSE_CONFIRMED")
            newUserStatus = "VACCINATION_CONFIRMED";
        if (userDetails.userStatus == "VACCINATION_CONFIRMED")
            newUserStatus = "IMMUNITY_CONFIRMED";
        userDetails.userStatus = newUserStatus;
        await updateUserStatus(userDetails.id, userDetails.version, userDetails.userStatus, "COVID-19 mRNA Vaccine BNT162b2");
    }
}*/

exports.handler = async (event) => {
    console.log("process.env");
    console.log(process.env);

    let userDetails = null;
    let vaccineDetailsArray = null;

    try {

        const userId = event.arguments.userId;
        console.log("userId in lambda")
        console.log(userId)
        userDetails = await getUserDetailsById(userId);
        console.log("userDetails");
        console.log(userDetails);

        const secretString = await convenetApi.getConvenetAPISecrets(process.env.REGION, process.env.ENV);
        const secret = JSON.parse(secretString);
        vaccineDetails = await medicalRecordsProcessing.doProductionProcessing(userDetails, secret, updateUserStatus);

    } catch (err) {
        return {
            status: 500,
            error: JSON.stringify(err)
        }
    }


    const response = {
        statusCode: 200,
        userStatus: vaccineDetails.userStatus,
        vaccineDetails: vaccineDetails.vaccineDetailsArray,
        vaccineName: vaccineDetails.vaccineName

    };
    console.log("response");
    console.log(response);
    return response;
};
