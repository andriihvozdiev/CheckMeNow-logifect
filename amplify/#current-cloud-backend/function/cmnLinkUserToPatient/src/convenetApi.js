const axios = require('axios');
const qs = require('qs');
const AWS = require('aws-sdk');

const getConvenetAPISecrets = async (region, env) => {
    // Use this code snippet in your app.
    // If you need more information about configurations or implementing the sample code, visit the AWS docs:
    // https://aws.amazon.com/developers/getting-started/nodejs/

    // Load the AWS SDK

    return new Promise((resolve, reject) => {
        var secretName = `${env}/convenet`,
            secret,
            decodedBinarySecret;

        // Create a Secrets Manager client
        var client = new AWS.SecretsManager({
            region: region
        });
        // In this sample we only handle the specific exceptions for the 'GetSecretValue' API.
        // See https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
        // We rethrow the exception by default.

        client.getSecretValue({ SecretId: secretName }, function (err, data) {
            if (err) {
                console.log("err");
                console.log(err);
                reject(err);
                return;
            }
            else {
                // Decrypts secret using the associated KMS CMK.
                // Depending on whether the secret is a string or binary, one of these fields will be populated.
                if ('SecretString' in data) {
                    secret = data.SecretString;
                } else {
                    let buff = Buffer.from(data.SecretBinary, 'base64');
                    decodedBinarySecret = buff.toString('ascii');
                    secret = decodedBinarySecret.SecretString;
                }
                resolve(secret);
            }
        });
    });
}

const authorise = (client_id, client_secret) => {
    console.log("client_id")
    console.log(client_id)
    var data = qs.stringify({
        'grant_type': 'client_credentials',
        'client_id': client_id,
        'client_secret': client_secret
    });

    var config = {
        method: 'post',
        url: 'https://convenet-uat.auth.eu-west-2.amazoncognito.com/oauth2/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
    };

    console.log("config");
    console.log(config);

    return axios(config)
        .then(function (authResponse) {
            console.log("authResponse");
            console.log(authResponse);
            return authResponse.data
        }).catch(err => {throw err;});
}

const getPracticeSettings = (gpOdsCode, token) => {
    var data = '';

    var config = {
        method: 'get',
        url: `https://uat.convenet.io/practice/${gpOdsCode}/settings`,
        headers: {
            'Authorization': `Bearer ${token}`
        },
        data: data
    };

    return axios(config)
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            throw error;
        });
}

const getPatientSettings = (patientId, token) => {

    var config = {
        method: 'get',
        url: `https://uat.convenet.io/patient/${patientId}/settings`,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    return axios(config)
        .then(function (response) {
            return response.data
        })
        .catch(function (error) {
            throw error;
        });

}

const linkPatient = async (surname, dateOfBirth, linkageKey, accountID, gpOdsCode, access_token) => {
    var data = { surname, dateOfBirth, linkageKey, accountID, gpOdsCode };

    var config = {
        method: 'post',
        url: 'https://uat.convenet.io/patient',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        },
        data: data
    };

    console.log("config")
    console.log(config)

    return axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
            return response.data;
        })
}

const getMedicalRecords = (patientId, fromDate, toDate, token) => {

    var config = {
        method: 'get',
        url: `https://uat.convenet.io/patient/${patientId}/record?fromdate=${fromDate}&todate=${toDate}`,
        headers: {
            'Authorization': `Bearer ${token}`
        },
    };

    return axios(config)
        .then(function (response) {
            return response.data
        })
        .catch(function (error) {
            throw error;
        });
}

module.exports = {
    getConvenetAPISecrets: getConvenetAPISecrets,
    authorise: authorise,
    getPracticeSettings: getPracticeSettings,
    getPatientSettings: getPatientSettings,
    linkPatient: linkPatient,
    getMedicalRecords: getMedicalRecords
}