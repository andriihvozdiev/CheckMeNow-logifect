/* Amplify Params - DO NOT EDIT
    API_CHECKMENOWAPI_GRAPHQLAPIENDPOINTOUTPUT
    API_CHECKMENOWAPI_GRAPHQLAPIIDOUTPUT
    API_CHECKMENOWAPI_GRAPHQLAPIKEYOUTPUT
    ENV
    REGION
    LAMBDA_EXECUTION_ROLE
    KEY_ID
Amplify Params - DO NOT EDIT */

const axios = require('axios');
const graphql = require('graphql');
const { print } = graphql;
const consts = require('./consts')
const { updateUserDetails, getUserDetails, createCertificateHash } = consts;
const certificateIssuer = require('./certificateIssuer');
const health_records = require('health_records');

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

const updateCertificate = async (userId, version, Certificate) => {
    try {
        const updateUserCertificateConfig = {
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
                        certificate: Certificate,
                        expectedVersion: version
                    }
                }
            }
        };

        console.log("updateUserStatusConfig");
        console.log(updateUserCertificateConfig);

        const graphqlUpdateStatusData = await axios(updateUserCertificateConfig);

        console.log("graphqlUpdateStatusData");
        console.log(JSON.stringify(graphqlUpdateStatusData.data));
        return graphqlUpdateStatusData.data;
    } catch (err) {
        console.log('error updating status: ', err);
    }
}

const updateUserCertificate = async (userId, version, Certificate) => {

    const graphqlUpdateStatusDataFirst = await updateCertificate(userId, version, Certificate);
    console.log("graphqlUpdateStatusDataFirst");
    console.log(graphqlUpdateStatusDataFirst);

    if (graphqlUpdateStatusDataFirst.errors && graphqlUpdateStatusDataFirst.errors.length > 0) {
        const userDetails = await getUserDetailsById(userId);
        console.log("userDetails");
        console.log(userDetails);
        const graphqlUpdateStatusDataSecond = await updateCertificate(userId, userDetails.version, Certificate);
        console.log("graphqlUpdateStatusDataSecond");
        console.log(graphqlUpdateStatusDataSecond);
    }


}

const addUserCertificateHash = async (userId, massageHash) => {
    try {
        const addUserCertificateHashConfig = {
            url: process.env.API_CHECKMENOWAPI_GRAPHQLAPIENDPOINTOUTPUT,
            method: 'post',
            headers: {
                'x-api-key': process.env.API_CHECKMENOWAPI_GRAPHQLAPIKEYOUTPUT
            },
            data: {
                query: print(createCertificateHash),
                variables: {
                    input: {
                        certificateHash: massageHash,
                        userId: userId,
                    }
                }
            }
        };

        console.log("addUserCertificateHashConfig");
        console.log(addUserCertificateHashConfig);

        const graphqlAddUserCertificateHash = await axios(addUserCertificateHashConfig);

        console.log("graphqlAddUserCertificateHash")
        console.log(JSON.stringify(graphqlAddUserCertificateHash.data))

    } catch (err) {
        console.log('error add hash: ', err);
    }
}

exports.handler = async (event) => {

    let signatureResult = null;
    const certificateData = event.arguments.issueCertificateInput;
    console.log("certificateData")
    console.log(certificateData)

    try {
        const userDetails = await getUserDetailsById(certificateData.userId);
        console.log("userDetails");
        console.log(userDetails);

        if (userDetails.userStatus !== "IMMUNITY_CONFIRMED")
            return {
                statusCode: 403,
                error: 'Access forbidden'
            };
        else {
            console.log("Enter when immunity confirmed status");

            const vaccineDetails = await health_records.getVaccineDetails(userDetails);
            console.log("getVaccineDetailsInsideIssuerCertificate");
            console.log(vaccineDetails);

            if (vaccineDetails.userStatus === 'IMMUNITY_CONFIRMED') {
                console.log('vaccineDetails.userStatus === IMMUNITY_CONFIRMED')
                certificateData.version = userDetails.version;
                signatureResult = await certificateIssuer.issueCertificate(certificateData, updateUserCertificate, addUserCertificateHash);
                return {
                    statusCode: 200,
                    messageHash: signatureResult.messageHash,
                    signature: signatureResult.signature,
                    identifier: signatureResult.identifier,
                    type: signatureResult.type,
                    version: signatureResult.version
                };

            } else {
                console.log('vaccineDetails.userStatus !== IMMUNITY_CONFIRMED')
                return {
                    statusCode: 403,
                    error: 'Access forbidden'
                };
            }
        }
    } catch (err) {
        return {
            statusCode: 500,
            error: err
        };
    }


};
