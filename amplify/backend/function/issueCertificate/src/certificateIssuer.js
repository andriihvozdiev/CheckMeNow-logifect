const hash = require('hash.js');
const AWS = require('aws-sdk');
const crypto = require("crypto");

const type = "C1";
const version = "V1";
const id = "4e6a33a6-8fe5-4ca2-80d5-2c527853fb12";
const lastIssuerIdentifier = '100000000';

const keyId = process.env.KEY_ID; //'9c1a8b91-7a35-47ef-a7db-0474db6f6d3e';
const lambdaExecutionRole =  process.env.LAMBDA_EXECUTION_ROLE; //'arn:aws:iam::915218614881:role/checkmenowLambdaRolea127c407-dev';
const IssuerIdentifierTableName = `IssuerIdentifier-${process.env.API_CHECKMENOWAPI_GRAPHQLAPIIDOUTPUT}-${process.env.ENV}`;
AWS.config.apiVersions = {
    dynamodb: '2012-08-10',
};

function generateNumericIdentifier(issuerIdentifierTable, numericGeneratorId, callback) {

    var dynamodb = new AWS.DynamoDB();

    var params = {
        ExpressionAttributeValues: {
            ":inc": {
                N: "1"
            }
        },
        Key: {
            "id": {
                S: numericGeneratorId
            }
        },
        ReturnValues: "UPDATED_NEW",
        TableName: issuerIdentifierTable,
        UpdateExpression: "SET lastIssuerIdentifier = lastIssuerIdentifier + :inc"
    };

    dynamodb.updateItem(params, function (err, data) {
        if (err) {
            console.log("Error increment identifier");
            console.log(err, err.stack); // an error occurred
            callback(err)
        }
        else {
            console.log("increment identifier");
            console.log(data);           // successful response
            const invrementedNumber = parseInt(data.Attributes.lastIssuerIdentifier.N).toString(16).toUpperCase();
            callback(null, `00${invrementedNumber}`)
        }
    });
}

function generateNumericIdentifierWithPromise(issuerIdentifierTable, numericGeneratorId) {
    const promise = new Promise((resolve, reject) => {
        generateNumericIdentifier(issuerIdentifierTable, numericGeneratorId, (err, data) => {
            if (!err) {
                resolve(data);
            } else {
                reject(err);
            }
        });
    });
    return promise;
}

function getNumericGeneratorId(issuerIdentifierTable, callback) {
    var dynamodb = new AWS.DynamoDB();
    
    var params = {
        KeyConditionExpression: '#type=:type AND ' +
            '#version>=:version',

        ExpressionAttributeNames: {
            "#type": "type",
            "#version": "version"
        },
        ExpressionAttributeValues: {
            ":type": { "S": type },
            ":version": { "S": version }
        },
        IndexName: 'byTypeVersion',
        TableName: issuerIdentifierTable
    };

    var putItemParams = {
        TableName: IssuerIdentifierTableName,
        Item: {
          'id': {S: id},
          'lastIssuerIdentifier': {N: lastIssuerIdentifier},
          'type': {S: type},
          'version': {S: version}
        },
        ConditionExpression: "attribute_not_exists(id)"
    };

    dynamodb.query(params, function (err, data) {
        if (err) {
            console.log("Error getting the IssuerIdentifierTable ID");
            console.log(err, err.stack);
            callback(err);
        }
        else {
            console.log("IssuerIdentifierTable ID");
            console.log(JSON.stringify(data));
            
            if (!data.Items || data.Items.length == 0) {
                dynamodb.putItem(putItemParams, function(putError, putData) {
                    if (putError) {
                        console.log("Error putting into IssuerIdentifierTable");
                        console.log(putError, putError.stack);

                        if (putError.code === "ConditionalCheckFailedException") {
                            dynamodb.query(params, function (existingErr, existingData) {
                                if (err) {
                                    console.log("Error getting the IssuerIdentifierTable ID");
                                    console.log(existingErr, existingErr.stack);
                                    
                                    callback(existingErr);
                                }
                                else {
                                    if (!existingData.Items || existingData.Items.length == 0) {
                                        callback(new Error("No records were found in IssuerIdentifierTable"));
                                    }
                                    else {
                                        callback(null, existingData.Items[0].id.S);
                                    }
                                }
                            });
                        }
                        else {
                            callback(putError);
                        }
                    } else {
                        console.log("Put new item into IssuerIdentifierTable table sucess!");
                        
                        dynamodb.query(params, function (newErr, newData) {
                            if (err) {
                                console.log("Error getting the IssuerIdentifierTable ID");
                                console.log(newErr, newErr.stack);
                                
                                callback(newErr);
                            }
                            else {
                                if (!newData.Items || newData.Items.length == 0) {
                                    callback(new Error("No records were found in IssuerIdentifierTable"));
                                }
                                else {
                                    callback(null, newData.Items[0].id.S);
                                }
                            }
                        });
                    }
                });
            } else {
                callback(null, data.Items[0].id.S);
            }
        }
    });
}

function getNumericGeneratorIdWithPromise(issuerIdentifierTable) {
    const promise = new Promise((resolve, reject) => {
        getNumericGeneratorId(issuerIdentifierTable, (err, data) => {
            if (!err) {
                resolve(data);
            } else {
                reject(err);
            }
        });
    });
    return promise;
}

function createGrant(callback) {
    const params = {
        GranteePrincipal: lambdaExecutionRole, // The identity that is given permission to perform the operations specified in the grant.
        KeyId: keyId, // The identifier of the CMK to which the grant applies. You can use the key ID or the Amazon Resource Name (ARN) of the CMK.
        Operations: [
            "Sign",
            "Verify"
        ]
    };
    var kms = new AWS.KMS({ apiVersion: '2014-11-01' });
    kms.createGrant(params, function (err, data) {
        if (err) {
            console.log("First error");
            console.log(err); // an error occurred
            callback(err);
        }
        else {
            console.log(data);           // successful response
            callback(null, data);
            /*
            data = {
            GrantId: "0c237476b39f8bc44e45212e08498fbe3151305030726c0590dd8d3e9f3d6a60", // The unique identifier of the grant.
            GrantToken: "AQpAM2RhZTk1MGMyNTk2ZmZmMzEyYWVhOWViN2I1MWM4Mzc0MWFiYjc0ZDE1ODkyNGFlNTIzODZhMzgyZjBlNGY3NiKIAgEBAgB4Pa6VDCWW__MSrqnre1HIN0Grt00ViSSuUjhqOC8OT3YAAADfMIHcBgkqhkiG9w0BBwaggc4wgcsCAQAwgcUGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMmqLyBTAegIn9XlK5AgEQgIGXZQjkBcl1dykDdqZBUQ6L1OfUivQy7JVYO2-ZJP7m6f1g8GzV47HX5phdtONAP7K_HQIflcgpkoCqd_fUnE114mSmiagWkbQ5sqAVV3ov-VeqgrvMe5ZFEWLMSluvBAqdjHEdMIkHMlhlj4ENZbzBfo9Wxk8b8SnwP4kc4gGivedzFXo-dwN8fxjjq_ZZ9JFOj2ijIbj5FyogDCN0drOfi8RORSEuCEmPvjFRMFAwcmwFkN2NPp89amA"// The grant token.
            }
            */
        }
    });
}

function createGrantWithPromise() {
    const promise = new Promise((resolve, reject) => {
        createGrant((err, data) => {
            if (!err) {
                resolve(data);
            } else {
                reject(err);
            }
        });
    });
    return promise;
}

function sign(messageHash, grantToken, callback) {
    const params = {
        KeyId: keyId, /* required */
        Message: Buffer.from(messageHash, "base64"), /* Strings will be Base-64 encoded on your behalf */ /* required */
        SigningAlgorithm: 'ECDSA_SHA_256', /* required */
        GrantTokens: [
            grantToken
        ],
        MessageType: 'DIGEST'
    };
    console.log('params')
    console.log(params)
    var kms = new AWS.KMS({ apiVersion: '2014-11-01' });
    kms.sign(params, function (err, data) {
        if (err) {
            console.log(err, err.stack); // an error occurred
            callback(err);
        } else {
            console.log(data);           // successful response
            callback(null, data);
        }
    });
}

function signWithPromise(message, grantToken) {
    const promise = new Promise((resolve, reject) => {
        sign(message, grantToken, (err, data) => {
            if (!err) {
                resolve(data);
            } else {
                reject(err);
            }
        });
    });
    return promise;
}

function verify(messageHash, signature, grantToken, callback) {
    var params = {
        KeyId: keyId, /* required */
        Message: Buffer.from(messageHash, "base64"), /* Strings will be Base-64 encoded on your behalf */ /* required */
        Signature: Buffer.from(signature, "base64"), /* Strings will be Base-64 encoded on your behalf */ /* required */
        SigningAlgorithm: "ECDSA_SHA_256", /* required */
        GrantTokens: [
            grantToken
        ],
        MessageType: 'DIGEST'
    };
    var kms = new AWS.KMS({ apiVersion: '2014-11-01' });
    kms.verify(params, function (err, data) {
        if (err) {
            console.log(err, err.stack); // an error occurred
            callback(err);
        } else {
            console.log(data);           // successful response
            callback(null, data);
        }
    });
}

function verifyWithPromise(messageHash, signature, grantToken) {
    const promise = new Promise((resolve, reject) => {
        verify(messageHash, signature, grantToken, (err, data) => {
            if (!err) {
                resolve(data);
            } else {
                reject(err);
            }
        });
    });
    return promise;
}

async function issueCertificate(certificateDate, updateUserCertificate, addUserCertificateHash) {

    let numericGeneratorId = null;

    //const awsSecrets = await getAWSSecrets(process.env.REGION, process.env.ENV);
    //const secrets = JSON.parse(awsSecrets);

    try {
        numericGeneratorId = await getNumericGeneratorIdWithPromise(IssuerIdentifierTableName);
        console.log("numericGeneratorId");
        console.log(numericGeneratorId);
    } catch (err) {
        console.log("error numericGeneratorId");
        console.log(err);

        throw err;
    }

    let numericIdentifier = null;

    try {
        numericIdentifier = await generateNumericIdentifierWithPromise(IssuerIdentifierTableName, numericGeneratorId);
        console.log("numericIdentifier");
        console.log(numericIdentifier);
    } catch (err) {
        console.log("error numericIdentifier");
        console.log(err);

        throw err;
    }

    let grantData = null;
    try {
        grantData = await createGrantWithPromise();
        console.log("succesfully created the grant");
        console.log(grantData)
    } catch (err) {
        console.log("Error creating the grant");
        console.log(JSON.stringify(err));
        throw err;
    }

    const dataArray = [certificateDate.name,
    certificateDate.dateOfBirth,
    certificateDate.vaccineName,
    certificateDate.diseaseAgent,
    certificateDate.firstDoseDate,
    certificateDate.secondDoseDate,
    certificateDate.validFrom,
    certificateDate.expirationDate,
    certificateDate.country,
    certificateDate.issuer,
    ];



    console.log("dataArray")
    console.log(dataArray)

    const message = dataArray.join('');

    console.log("message")
    console.log(message)

    const messageHash = crypto.createHash("sha256").update(message).digest("base64");
    console.log("Hashed message");
    console.log(messageHash);

    let signature = null;
    try {
        signatureBuffer = await signWithPromise(messageHash, grantData.GrantToken);
        signature = signatureBuffer.Signature.toString("base64");
        console.log("Successfull signing");
        console.log(signature);
    } catch (err) {
        console.log("Error signing");
        console.log(err);
        throw err;
    }

    try {
        signatureVerification = await verifyWithPromise(messageHash, signature, grantData.GrantToken);
        console.log("Verification result");
        console.log(JSON.stringify(signatureVerification));
    } catch (err) {
        console.log("Error signing");
        console.log(err);
        throw err;
    }

    const certificate = {
        name: certificateDate.name,
        dateOfBirth: certificateDate.dateOfBirth,
        vaccineName: certificateDate.vaccineName,
        diseaseAgent: certificateDate.diseaseAgent,
        firstDoseDate: certificateDate.firstDoseDate,
        secondDoseDate: certificateDate.secondDoseDate,
        validFrom: certificateDate.validFrom,
        expirationDate: certificateDate.expirationDate,
        country: certificateDate.country,
        issuer: certificateDate.issuer,
        identifier: `CMN.GB.${numericIdentifier}.${type}.${version}`,
        state: 'ACTIVE',
        messageHash: messageHash,
        signature: signature
    }
    console.log("certificate")
    console.log(certificate)

    if (updateUserCertificate) {
        await updateUserCertificate(certificateDate.userId, certificateDate.version, certificate);
        await addUserCertificateHash(certificateDate.userId, messageHash);
    }

    return { messageHash: messageHash, signature: signature, identifier: numericIdentifier, type: type, version: version };
}

const getAWSSecrets = async (region, env) => {
    // Use this code snippet in your app.
    // If you need more information about configurations or implementing the sample code, visit the AWS docs:
    // https://aws.amazon.com/developers/getting-started/nodejs/

    // Load the AWS SDK

    return new Promise((resolve, reject) => {
        var secretName = `common/${env}`,
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

module.exports = {
    issueCertificate: issueCertificate
}