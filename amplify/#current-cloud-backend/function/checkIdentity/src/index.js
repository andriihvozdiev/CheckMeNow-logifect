/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_CHECKMENOWBUCKETS_BUCKETNAME
Amplify Params - DO NOT EDIT */
const AWS = require('aws-sdk')
const https = require('https');
AWS.config.region = process.env.AWS_REGION
const rekognition = new AWS.Rekognition();
const s3 = new AWS.S3()
const moment = require('moment')

const postCodeRegEx = /^(([A-Z][0-9]{1,2})|(([A-Z][A-HJ-Y][0-9]{1,2})|(([A-Z][0-9][A-Z])|([A-Z][A-HJ-Y][0-9]?[A-Z])))) [0-9][A-Z]{2}$/gi
const dateOfBirthLicenceEx = /[0-3]?[0-9][\/\.\s][0-3]?[0-9][\/\.\s](?:[0-9]{2})?[0-9]{2}/
const dateOfBirthPassportEx = /^[0-3]?[0-9]\s*[A-Z]{3,3}\s*\/\s*[A-Z]{3,3}\s*([0-9]{4,4}|[0-9]{2,2})/

const joinTextArray = function (structure) {
    return structure.TextDetections.reduce(function (all, detection) {
        if (detection.Type === 'LINE') {
            all.push(detection.DetectedText)
            return all
        } else return all
    }, [])
}

exports.joinTextArray = joinTextArray

const joinText = function (structure) {
    return structure.TextDetections.reduce(function (all, detection) {
        if (detection.Type === 'LINE') {
            all += "\r\n" + detection.DetectedText
            return all
        } else return all
    }, "")
}

exports.joinText = joinText

const extractPostCode = function (structure) {
    try {
        const texts = joinTextArray(structure)
        const result = []
        texts.forEach(function (text) {
            if (text.match(postCodeRegEx))
                result.push(text)
        })
        return result[0]
    } catch (err) {
        console.log(err)
    }
}

exports.extractPostCode = extractPostCode

const extractDateOfBirthLicence = function (structure) {
    try {
        const dateOfBirthLine = structure.TextDetections.find(function (item) {
            return item.Id === 3
        })
        const result = dateOfBirthLine.DetectedText.match(dateOfBirthLicenceEx)[0]
        return [result.replace(/\./g, "/")]
    } catch (err) {
        console.log(err)
    }
}

exports.extractDateOfBirthLicence = extractDateOfBirthLicence

const months = {
    "JAN": "JAN",
    "FEB": "FEB",
    "MAR": "MAR",
    "APR": "APR",
    "MAY": "MAY",
    "JUNE": "JUNE",
    "JULY": "JULY",
    "AUG": "AUG",
    "SEP": "SEP",
    "OCT": "OCT",
    "NOV": "NOV",
    "DEC": "DEC"
}
const extractDateOfBirthPassport = function (structure) {
    try {
        const lines = joinTextArray(structure);
        const result = []
        lines.forEach(function (line) {
            const dateGroup = line.match(dateOfBirthPassportEx)
            if (dateGroup) {
                let dateStr = dateGroup[0].replace("/", " ")
                let parts = dateStr.split(" ")
                const lettersRegex = /^[A-Z]{3,3}$/gi
                parts = parts.map(function (part) {
                    part = part.trim()
                    if (part.match(lettersRegex) && months[part]) {
                        return part
                    }
                    if (part.match(lettersRegex) && !months[part]) {
                        return ""
                    }
                    return part
                })
                parts = parts.filter(function (part) {
                    return !!part
                })
                let index = 0
                const partsObj = parts.reduce(function (all, part) {
                    all[part] = { index: index++, part: part }
                    return all
                }, {})
                parts = Object.values(partsObj).sort(function (part1, part2) {
                    if (part1.index < part2.index) return -1
                    else return 1
                }).map(function (part) {
                    return part.part
                })
                dateStr = parts.join("/")
                if (parts[parts.length - 1].length === 2)
                    result.push(moment(dateStr, "DD/MMM/YY").format("DD/MM/YYYY"))
                else result.push(moment(dateStr, "DD/MMM/YYYY").format("DD/MM/YYYY"))
            }
        })
        return result
    } catch (err) {
        console.log(err)
    }
}

exports.extractDateOfBirthPassport = extractDateOfBirthPassport

const saveObject = function (bucket, key, content, callback) {
    var params = {
        Body: content,
        Bucket: bucket,
        Key: key
    };
    try {
        s3.putObject(params, function (err, data) {
            if (err) {
                err.code_origin = JSON.stringify(params)
                console.log(err, err.stack);
            } // an error occurred
            else console.log(data);           // successful response
            callback(err, data)
        });
    } catch (error) {
        error.code_origin = JSON.stringify(params)
        console.log(error)
    }
}

const loadObject = function (bucket, key) {
    return new Promise(function (resolve, reject) {
        var params = {
            Bucket: bucket,
            Key: key
        };
        try {

            s3.getObject(params, function (err, data) {
                if (err) {
                    err.code_origin = JSON.stringify(params)
                    console.log(err, err.stack); // an error occurred
                    callback(err)
                    return
                }

                try {        // successful response
                    const objectData = JSON.parse(data['Body'].toString('utf8'))
                    if (err) {
                        reject(err)
                    } else {
                        resolve(objectData)
                    }
                } catch (err) {
                    err.key = key;
                    console.log(err)
                }
            });
        } catch(error) {
            error.code_origin = JSON.stringify(params)
            console.log(error)
        }
    })
}

exports.loadObject = loadObject

const detectLabels = function (username, bucket, callback) {
    var params = {
        Image: { /* required */
            S3Object: {
                Bucket: bucket,
                Name: `${username}_identity.jpg`,
            }
        }
    };

    rekognition.detectLabels(params, function (err, data) {
        if (err) {
            console.log(err, err.stack); // an error occurred
            callback(err)
            return
        }
        else console.log(data);           // successful response
        saveObject(bucket, `${username}_identity_results.json`,
            JSON.stringify(data),
            function (err) {
                callback(err)
            })
    });
}

const detectText = function (username, bucket, typeOfDocument, callback) {
    var params = {
        Image: { /* required */
            S3Object: {
                Bucket: bucket,
                Name: `${username}_identity.jpg`
            }
        }
    };
    rekognition.detectText(params, function (err, data) {
        if (err) {
            console.log(err, err.stack); // an error occurred
            callback(err)
            return
        }
        else console.log(data);           // successful response

        if (typeOfDocument === "Driving Licence") {
            data.PostCode = extractPostCode(data)
        }

        saveObject(bucket, `${username}_text_results.json`,
            JSON.stringify(data),
            function (err) {
                callback(err, data)
            })
    });
}

const compareFaces = function (username, bucket, callback) {
    var params = {
        SourceImage: { /* required */
            S3Object: {
                Bucket: bucket,
                Name: `${username}_identity.jpg`
            }
        },
        TargetImage: { /* required */
            S3Object: {
                Bucket: bucket,
                Name: `${username}_photo.jpg`
            }
        },
        QualityFilter: "MEDIUM",
        SimilarityThreshold: 90
    };
    rekognition.compareFaces(params, function (err, data) {
        if (err) {
            console.log(err, err.stack); // an error occurred
            callback(err)
            return
        }
        else console.log(data);           // successful response

        saveObject(bucket, `${username}_faces_results.json`,
            JSON.stringify(data),
            function (err) {
                callback(err)
            })
    });
}

const searchPerson = function (fullName, postCode, bucket, username, callback) {
    var options = {
        'method': 'GET',
        'hostname': 'api.t2a.io',
        'path': `/rest/rest.aspx?api_key=LujnFDGHTrN6k-8X_ZA1zN85bL2jECsMQbfYvxUmD2dP&output=json&name=${escape(fullName)}&place=${escape(postCode)}&method=person_search`,
        'headers': {
        },
        'maxRedirects': 20
    };

    var req = https.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function (chunk) {
            var body = Buffer.concat(chunks);

            saveObject(bucket, `${username}_address_results.json`,
                body.toString(),
                function (err) {
                    callback(err)
                })

        });

        res.on("error", function (error) {
            console.error(error);
        });
    });

    req.end();
}

const getDrivingLicenceDetails = function (textResults) {
    try {

        let lastName = textResults.TextDetections.find(function (item) {
            return item.Id === 1
        })
        let firstName = textResults.TextDetections.find(function (item) {
            return item.Id === 2
        })
        firstName = firstName.DetectedText.split(" ").reduce(function (max, text) {
            if (max.length < text.length) {
                return text
            }
            return max
        }, "")
        lastName = lastName.DetectedText.split(" ").reduce(function (max, text) {
            if (max.length < text.length) {
                return text
            }
            return max
        }, "")
        const dateOfBirth = extractDateOfBirthLicence(textResults)
        const postCode = extractPostCode(textResults)

        return { firstName: firstName.toUpperCase(), lastName: lastName.toUpperCase(), dateOfBirth, postCode }
    } catch (err) {
        console.log(err)
    }
}

exports.getDrivingLicenceDetails = getDrivingLicenceDetails

function matchPerson(addressResults, details) {
    if (!addressResults.person_list) return null
    return addressResults.person_list.find(function (person) {
        return person.forename.toUpperCase() === details.firstName.toUpperCase() &&
            person.surname.toUpperCase() === details.lastName.toUpperCase() &&
            person.postcode.toUpperCase() === details.postCode.toUpperCase() &&
            person.years_list.reduce(function (max, year) {
                const intYear = parseInt(year)
                if (max < intYear)
                    return intYear
                else return max
            }, 0) >= moment().year() - 1 &&
            details.dateOfBirth.reduce(function (last, dob) {
                return last || moment(dob, "DD/MM/YYYY").isSame(moment(person.dob, "YYYY-MM-DD"));
            }, false)
    });
}

exports.matchPerson = matchPerson;

function checkVideo(videoResults) {
    if (!videoResults.Persons) return null
    let result = {
        maxRoll: 0,
        maxPitch: 0,
        maxYaw: 0
    }

    videoResults.Persons.reduce(function (result, person) {
        result[person.Person.Index] = person.Person.Index
        if (person.Person.Face && person.Person.Face.Pose &&
            person.Person.Face.Pose.Roll &&
            person.Person.Face.Pose.Yaw &&
            person.Person.Face.Pose.Pitch) {
            const roll = Math.abs(person.Person.Face.Pose.Roll);
            const yaw = Math.abs(person.Person.Face.Pose.Yaw);
            const pitch = Math.abs(person.Person.Face.Pose.Pitch);

            result.maxRoll = result.maxRoll < roll ? roll : result.maxRoll;
            result.maxYaw = result.maxYaw < yaw ? yaw : result.maxYaw;
            result.maxPitch = result.maxPitch < pitch ? pitch : result.maxPitch;
        }
        return result
    }, result)

    return result.maxRoll > 20 &&
        result.maxYaw > 20 &&
        result.maxPitch > 20 &&
        result["0"] === 0 &&
        result["1"] === undefined
}

exports.checkVideo = checkVideo;

function checkPassport(textResults, addressResults, firstName, lastName, postCode) {
    const passportText = joinText(textResults)
    if (!passportText.toUpperCase().includes(firstName.toUpperCase()) ||
        !passportText.toUpperCase().includes(lastName.toUpperCase())) {
        return "PASSPORT_NAME_MISMATCH";
    }

    const dateOfBirth = extractDateOfBirthPassport(textResults)

    if (!dateOfBirth || dateOfBirth.length === 0) {
        return "PASSPORT_DATEOFBIRTH_ERROR";
    }
    const person = matchPerson(addressResults, { firstName, lastName, dateOfBirth: dateOfBirth, postCode })

    if (!person) {
        return "POSTCODE_MISMATCH";
    }

    return "SUCCESS";
}

function checkIdentity(identityResults, facesResults,
    textResults, addressResults, videoResults, typeOfDocument,
    firstName, lastName, postCode
) {

    const documents = ["Document", "Driving License", "License", "Person", "Id Cards", "Passport"]

    const totalConfidence = identityResults.Labels.reduce(function (all, label) {
        if (documents.indexOf(label.Name) !== -1)
            return all + label.Confidence;
        else return all;
    }, 0)

    const averageConfidence = totalConfidence / documents.length;
    if (averageConfidence < 80) {
        return "LOW_DOCUMENT_CONFIDENCE";
    }

    if (facesResults.FaceMatches.length !== 1) {
        return "FACE_MISMATCH";
    }

    if (typeOfDocument === "Driving Licence") {
        const details = getDrivingLicenceDetails(textResults);
        if (!details) {
            return "LICENCE_DETAILS_ERROR";
        }

        if (details.firstName !== firstName.toUpperCase() || details.lastName !== lastName.toUpperCase()) {
            return "LICENCE_NAME_MISMATCH";
        }
        const person = matchPerson(addressResults, details)

        if (!person) {
            return "LICENCE_POSTCODE_MISMATCH";
        }
    }

    if (typeOfDocument === "Passport") {
        return checkPassport(textResults, addressResults, firstName, lastName, postCode);
    }

    const isFaceReal = checkVideo(videoResults)

    if (!isFaceReal) {
        return "FACE_NOT_REAL"
    }

    return "SUCCESS";
}

exports.checkIdentity = checkIdentity

const compileFinalResults = async function (username, bucket, typeOfDocument, firstName, lastName, postCode, videoResults) {
    console.log("load identityResults")
    const identityResults = await loadObject(bucket, `${username}_identity_results.json`)
    console.log("load facesResults")
    const facesResults = await loadObject(bucket, `${username}_faces_results.json`)
    console.log("load textResults")
    const textResults = await loadObject(bucket, `${username}_text_results.json`)
    console.log("load addressResults")
    const addressResults = await loadObject(bucket, `${username}_address_results.json`)

    return checkIdentity(identityResults, facesResults, textResults, addressResults, videoResults,
        typeOfDocument, firstName, lastName, postCode)
}

exports.compileFinalResults = compileFinalResults

exports.handler = function (event, context, callback) {
    // TODO implement

    const operation = event.arguments.identityCheckInput.operation;
    const firstName = event.arguments.identityCheckInput.firstName;
    const lastName = event.arguments.identityCheckInput.lastName;
    const typeOfDocument = event.arguments.identityCheckInput.typeOfDocument;
    const postCode = event.arguments.identityCheckInput.postCode;
    const jobId = event.arguments.identityCheckInput.jobId;
    const username = event.identity.username;
    const tempBucket = process.env.STORAGE_CHECKMENOWBUCKETS_BUCKETNAME + "-temp"
    console.log("process.env")
    console.log(process.env)
    if (operation === "START") {
        var params = {
            Video: { /* required */
                S3Object: {
                    Bucket: tempBucket,
                    Name: `${username}_video.mov`
                }
            },
            ClientRequestToken: username
        };
        console.log(params)
        rekognition.startPersonTracking(params, function (err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else console.log(data);           // successful response

            const response = {
                statusCode: 200,
                err: err,
                body: JSON.stringify({
                    personTrackingJobId: data ? data.JobId : undefined,
                    event: event
                }),
            };

            detectLabels(username, tempBucket, function (err) {
                if (err) {
                    response.err = err
                    callback(err, response)
                    return
                }

                detectText(username, tempBucket, typeOfDocument, function (err, data) {
                    if (err) {
                        response.err = err
                        callback(err, response)
                        return
                    }

                    searchPerson(`${firstName} ${lastName}`, postCode || data.postCode, tempBucket, username, function (err) {
                        if (err) {
                            response.err = err
                            callback(err, response)
                            return
                        }

                        compareFaces(username, tempBucket, function (err) {
                            if (err) {
                                response.err = err
                                callback(err, response)
                                return
                            }
                            callback(err, response)
                        })
                    })
                })
            })
        });
    }

    if (operation === "CHECK") {
        var params = {
            JobId: jobId
        };

        rekognition.getPersonTracking(params, function (err, videoResults) {
            if (err) console.log(err, err.stack); // an error occurred
            else console.log(videoResults);           // successful response

            saveObject(tempBucket, `${username}_video_results.json`, JSON.stringify(videoResults), function() {
                if (videoResults.JobStatus === "SUCCEEDED") {
                    console.log("Start compiling the results")
                    compileFinalResults(username, tempBucket, typeOfDocument, firstName, lastName, postCode, videoResults).then(function (finalResult) {
                        const response = {
                            statusCode: 200,
                            body: JSON.stringify({
                                personTrackingData: videoResults,
                                finalResult: finalResult,
                                event: event
                            }),
                        };

                        callback(null, response)
                    }).catch(function(err){
                        const response = {
                            statusCode: 500,
                            body: JSON.stringify({
                                personTrackingData: videoResults,
                                err: err,
                                event: event
                            }),
                        };

                        callback(err, response)
                    })
                } else {
                    const response = {
                        statusCode: 200,
                        body: JSON.stringify({
                            personTrackingData: videoResults,
                            event: event
                        }),
                    };
                    callback(null, response);
                }
            })
        });
    }
};

