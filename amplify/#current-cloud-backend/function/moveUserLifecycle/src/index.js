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
const moment = require('moment');
const consts = require('./consts')
const { updateUserDetails, userDetailsByUserStatus } = consts;
const convenetApi = require('./convenetApi')
const medicalRecordsProcessing = require('./medicalRecordsProcessing');

const getUserDetailsByStatus = async (userStatus) => {
    try {
        const getUsersByUserStatusConfig = {
            url: process.env.API_CHECKMENOWAPI_GRAPHQLAPIENDPOINTOUTPUT,
            method: 'post',
            headers: {
                'x-api-key': process.env.API_CHECKMENOWAPI_GRAPHQLAPIKEYOUTPUT
            },
            data: {
                query: print(userDetailsByUserStatus),
                variables: {
                    userStatus: userStatus,
                    sortDirection: "ASC",
                    limit: 20
                }
            }
        };

        console.log("getUsersByUserStatusConfig");
        console.log(getUsersByUserStatusConfig);

        const graphqlUsersList = await axios(getUsersByUserStatusConfig);
        console.log("graphqlUsersList");
        console.log(graphqlUsersList.data.data);
        const usersList = graphqlUsersList.data.data.userDetailsByUserStatus;
        console.log("usersList");
        console.log(usersList.items);
        return usersList.items;
    } catch (error) {
        console.log('error getting users list: ', error);
    }
}

const CreateMessageRequest = (userDetails) => {
    let message = null;
    console.log("userDetails");
    console.log(userDetails);

    if (userDetails.userStatus == "FIRST_DOSE_CONFIRMED") {
        message = "Good news! We have received first dose vaccination details.";
    }

    if (userDetails.userStatus == "VACCINATION_CONFIRMED") {
        message = "Good news! We have received second dose vaccination details."
    }

    if (userDetails.userStatus == "IMMUNITY_CONFIRMED") {
        message = "Good news! We can confirm now that we can issue a vaccine certificate for you."
    }

    const action = 'OPEN_APP';
    const priority = 'normal';
    const ttl = 30;
    const silent = false;
    const token = userDetails.pushNotificationToken;
    const service = userDetails.pushNotificationService;
    const title = 'Information';
    let messageRequest = null;
    if (service == 'GCM') {
        messageRequest = {
            'Addresses': {
                [token]: {
                    'ChannelType': 'GCM'
                }
            },
            'MessageConfiguration': {
                'GCMMessage': {
                    'Action': action,
                    'Body': message,
                    'Priority': priority,
                    'SilentPush': silent,
                    'Title': title,
                    'TimeToLive': ttl
                }
            }
        };
    } else if (service == 'APNS') {
        messageRequest = {
            'Addresses': {
                [token]: {
                    'ChannelType': 'APNS'
                }
            },
            'MessageConfiguration': {
                'APNSMessage': {
                    'Action': action,
                    'Body': message,
                    'Priority': priority,
                    'SilentPush': silent,
                    'Title': title,
                    'TimeToLive': ttl,
                    'Sound': 'default'
                }
            }
        };
    } else if (service == 'APNS_SANDBOX') {
        messageRequest = {
            'Addresses': {
                [token]: {
                    'ChannelType': 'APNS_SANDBOX'
                }
            },
            'MessageConfiguration': {
                'APNSMessage': {
                    'Action': action,
                    'Body': message,
                    'Priority': priority,
                    'SilentPush': silent,
                    'TimeToLive': ttl,
                    'Title': title,
                    'Sound': 'default'
                }
            }
        }; 
    }

    console.log("messageRequest")
    console.log(messageRequest)
    return messageRequest
}

const ShowOutput = (data, token) => {
    let status = null;
    if (data["MessageResponse"]["Result"][token]["DeliveryStatus"]
        == "SUCCESSFUL") {
        status = "Message sent! Response information: ";
    } else {
        status = "The message wasn't sent. Response information: ";
    }
    console.log(JSON.stringify(data));
}

const sendUserPushNotification = async (userDetails) => {
    console.log("send to "+userDetails.email + "  " + userDetails.userStatus)
    var messageRequest = CreateMessageRequest(userDetails);

    if(!messageRequest){
        return Promise.resolve();
    }

    //Create a new Pinpoint object.
    var pinpoint = new AWS.Pinpoint({ apiVersion: '2016-12-01', region: 'eu-west-1' });
    const applicationId = "b132592ea31640cc8f0e7af87bf67c8c";
    var params = {
        "ApplicationId": applicationId,
        "MessageRequest": messageRequest
    };

    // Try to send the message.
    return pinpoint.sendMessages(params, function (err, data) {
        if (err) console.log(err);
        else ShowOutput(data, userDetails.pushNotificationToken);
    }).promise();

}

const updateUserStatus = async (userId, version, newUserStatus, vaccineName) => {
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

async function doTestModeProcessing(userDetails) {
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
        await sendUserPushNotification(userDetails);
    }
}

exports.handler = async (event) => {
    console.log("process.env");
    console.log(process.env);
    const usersList1 = await getUserDetailsByStatus("AWAITING_VACCINATION");
    const usersList2 = await getUserDetailsByStatus("FIRST_DOSE_CONFIRMED");
    const usersList3 = await getUserDetailsByStatus("VACCINATION_CONFIRMED");
    const usersList = [...usersList1, ...usersList2, ...usersList3];

    for (let i = 0; i < usersList.length; i++) {
        try {
            const userDetails = usersList[i];
            if (userDetails.isTester) {
                await doTestModeProcessing(userDetails);
            } else {
                const secretString = await convenetApi.getConvenetAPISecrets(process.env.REGION, process.env.ENV);
                const secret = JSON.parse(secretString);
                await medicalRecordsProcessing.doProductionProcessing(userDetails, secret, updateUserStatus, sendUserPushNotification);
            }
        } catch (err) {
            console.log("sendUserPushNotification error");
            console.log(err);
        }
    }

    const response = {
        statusCode: 200,
        //  Uncomment below to enable CORS requests
        //  headers: {
        //      "Access-Control-Allow-Origin": "*",
        //      "Access-Control-Allow-Headers": "*"
        //  }, 
        body: JSON.stringify(process.env),
    };
    console.log("response");
    console.log(response);
    return response;
};
