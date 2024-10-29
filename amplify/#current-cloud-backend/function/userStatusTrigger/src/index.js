/* Amplify Params - DO NOT EDIT
  API_CHECKMENOWAPI_GRAPHQLAPIENDPOINTOUTPUT
  API_CHECKMENOWAPI_GRAPHQLAPIIDOUTPUT
  API_CHECKMENOWAPI_GRAPHQLAPIKEYOUTPUT
  ENV
  REGION
Amplify Params - DO NOT EDIT *//* Amplify Params - DO NOT EDIT
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

const sendLinkageKey = async (userDetails, linkageKey, accountId, gpOdsCode) => {
  const ses = new AWS.SES({ region: "eu-west-2" });
  
  var params = {
    Destination: {
      ToAddresses: [userDetails.email.S],
    },
    Message: {
      Body: {
        Text: { Charset: "UTF-8", Data: `Dear Friend, \nthanks for signing up for CheckMeNow application. This is a beta version and in order to see the entire functionality of the application you will need the Linkage key, Account ID and GP ODS Code which are the following:\nLinkage Key - ${linkageKey}\nAccount ID - ${accountId}\nGP ODS Code - ${gpOdsCode}\nKind regards,\nCheckMeNow Team.` },
      },

      Subject: { Data: "Linkage Key from CheckMeNow" },
    },
    Source: "no-reply@checkmenow.co.uk",
  };
  console.log("email sending params")
  console.log(params)

  return ses.sendEmail(params).promise()
}

const updatePatient = async (userId, isLinkageKeySent, version, linkageKey, accountId, gpOdsCode) => {
  try {
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
            id: userId,
            linkageKey: linkageKey, 
            accountID: accountId, 
            gpOdsCode: gpOdsCode,
            isLinkageKeySent: isLinkageKeySent,
            expectedVersion: version
          }
        }
      }
    };

    console.log("updateConfig");
    console.log(updateConfig);

    const graphqlUpdateData = await axios(updateConfig);

    console.log("graphqlUpdateData")
    console.log(JSON.stringify(graphqlUpdateData.data))
    return graphqlUpdateData.data;
  } catch (err) {
    console.log('error updating user details: ', err);
  }
}

exports.handler = async event => {
  //eslint-disable-line
  console.log(JSON.stringify(event, null, 2));
  console.log("Number of records - " + event.Records.length)
  const record = event.Records[0];
  console.log(record.eventID);
  console.log(record.eventName);
  console.log('DynamoDB Record: %j', record.dynamodb);

  try {
    if (record.dynamodb.NewImage &&
      record.dynamodb.NewImage.isTester &&
      record.dynamodb.NewImage.isTester.BOOL &&
      record.dynamodb.NewImage.userStatus.S === "NO_NHS_LINKAGE" &&
      (!record.dynamodb.NewImage.isLinkageKeySent || !record.dynamodb.NewImage.isLinkageKeySent.BOOL)) {
      const userDetails = record.dynamodb.NewImage;

      const idParts = userDetails.id.S.split("-");
      const linkageKey = idParts[idParts.length - 1];
      const accountId = record.dynamodb.ApproximateCreationDateTime;
      const gpOdsCode = `A${idParts[idParts.length - 2].toUpperCase()}0`;
      
      const emailSendingResult = await sendLinkageKey(record.dynamodb.NewImage, linkageKey, accountId, gpOdsCode)
      const updatePatientResult = await updatePatient(record.dynamodb.NewImage.id.S, true, record.dynamodb.NewImage.version.N, linkageKey, accountId, gpOdsCode)
      
      console.log("emailSendingResult");
      console.log(emailSendingResult);
    }
  }
  catch (err) {
    console.log(err);
  }

  return Promise.resolve('Successfully processed DynamoDB record');
};
