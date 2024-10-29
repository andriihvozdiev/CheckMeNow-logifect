const lambda = require('./index')

const licenceTexts = require('./_text_results.json')
const passportTexts = require('./_passport_text_results.json')
const videoResults = require('./_video_results.json');
const identityResults = require('./_identity_results.json');
const facesResults = require('./_faces_results.json');
const addressResults = require('./_address_results.json');

const moment = require("moment")

test('extract postcode', () => {
  const licenceTexts = require('./_text_results.json')
  const postCode = lambda.extractPostCode(licenceTexts);
  expect(postCode).toBe("TN4 8JX");
});

test('extract dateOfBirth from Licence', () => {
  //const joinTextArray = lambda.joinTextArray(licenceTexts);
  //console.log(joinTextArray)
  const licenceTexts = require('./_text_results.json')
  const dateOfBirth = lambda.extractDateOfBirthLicence(licenceTexts);
  expect(dateOfBirth[0]).toBe("29/03/1975")
});

test('extract dateOfBirth from Passport', () => {
  //const joinTextArray = lambda.joinTextArray(pasportTexts);
  //console.log(joinTextArray)
  const pasportTexts = require('./_passport_text_results.json');
  const dateOfBirth = lambda.extractDateOfBirthPassport(pasportTexts);
  expect(moment(dateOfBirth[0], "DD/MM/YYYY").isSame(moment("1975-03-29"))).toBe(true)
});

test(' getDrivingLicenceDetails', () => {
  const licenceTexts = require('./_text_results.json')
  const details = lambda.getDrivingLicenceDetails(licenceTexts);
  expect(details.firstName).toBe("VICTOR")
  expect(details.lastName).toBe("CRUDU")
  expect(details.postCode).toBe("TN4 8JX")
});

test('matchPerson', async () => {
  const licenceTexts = require('./_text_results.json')
  const addressResults = require("./_address_results.json");
  const licenceDetails = lambda.getDrivingLicenceDetails(licenceTexts);
  const result = lambda.matchPerson(addressResults, licenceDetails);
  expect(!!result).toBe(true);
});

test('checkVideo', async () => {
  const videoResults = require('./_video_results.json');
  const result = lambda.checkVideo(videoResults);
  expect(result).toBe(true);
});

test('checkIdentity - Driving Licence: document confidence is low because of label missing', async () => {
  const textResults = licenceTexts;
  const typeOfDocument = "Driving License";
  const firstName = "Victor";
  const lastName = "Crudu";
  const postCode = "TN4 8JX";
  const identityResultsLocal = JSON.parse(JSON.stringify(identityResults))
  const labelIndex = identityResultsLocal.Labels.findIndex(function (label) {
    return label.Name === "Driving License"
  })
  identityResultsLocal.Labels.splice(labelIndex, 1)
  const result = lambda.checkIdentity(identityResultsLocal,
    facesResults,
    textResults,
    addressResults,
    videoResults,
    typeOfDocument,
    firstName,
    lastName,
    postCode
  );
  expect(result).toBe("LOW_DOCUMENT_CONFIDENCE");
});

test('checkIdentity - Driving Licence: document confidence is low ', async () => {
  const textResults = licenceTexts;
  const typeOfDocument = "Driving Licence";
  const firstName = "Victor";
  const lastName = "Crudu";
  const postCode = "TN4 8JX";
  const identityResultsLocal = JSON.parse(JSON.stringify(identityResults))
  const labelIndex = identityResultsLocal.Labels.findIndex(function (label) {
    return label.Name === "Driving License"
  })
  identityResultsLocal.Labels[labelIndex].Confidence = 20
  const result = lambda.checkIdentity(identityResultsLocal,
    facesResults,
    textResults,
    addressResults,
    videoResults,
    typeOfDocument,
    firstName,
    lastName,
    postCode
  );
  expect(result).toBe("LOW_DOCUMENT_CONFIDENCE");
});

test('checkIdentity - Driving Licence: faces do not match ', async () => {
  const textResults = licenceTexts;
  const typeOfDocument = "Driving Licence";
  const firstName = "Victor";
  const lastName = "Crudu";
  const postCode = "TN4 8JX";
  const facesResultsLocal = JSON.parse(JSON.stringify(facesResults))
  facesResultsLocal.FaceMatches = []
  const result = lambda.checkIdentity(identityResults,
    facesResultsLocal,
    textResults,
    addressResults,
    videoResults,
    typeOfDocument,
    firstName,
    lastName,
    postCode
  );
  expect(result).toBe("FACE_MISMATCH");
});

test('checkIdentity - Driving Licence: name mismatch', async () => {
  const textResults = licenceTexts;
  const typeOfDocument = "Driving Licence";
  const firstName = "Victor";
  const lastName = "Crudo";
  const postCode = "TN4 8JX";
  const result = lambda.checkIdentity(identityResults,
    facesResults,
    textResults,
    addressResults,
    videoResults,
    typeOfDocument,
    firstName,
    lastName,
    postCode
  );
  expect(result).toBe("LICENCE_NAME_MISMATCH");
});

test('checkIdentity - Driving Licence: last year not at address', async () => {
  const textResults = licenceTexts;
  const typeOfDocument = "Driving Licence";
  const firstName = "Victor";
  const lastName = "Crudu";
  const postCode = "TN4 8JX";
  const addressResultsLocal = JSON.parse(JSON.stringify(addressResults))
  addressResultsLocal.person_list[0].years_list.splice(3,1);
  const result = lambda.checkIdentity(identityResults,
    facesResults,
    textResults,
    addressResultsLocal,
    videoResults,
    typeOfDocument,
    firstName,
    lastName,
    postCode
  );
  expect(result).toBe("LICENCE_POSTCODE_MISMATCH");
});

test('checkIdentity - Driving Licence: no person found at address', async () => {
  const textResults = licenceTexts;
  const typeOfDocument = "Driving Licence";
  const firstName = "Victor";
  const lastName = "Crudu";
  const postCode = "TN4 8JX";
  const addressResultsLocal = JSON.parse(JSON.stringify(addressResults))
  delete addressResultsLocal.person_list;
  const result = lambda.checkIdentity(identityResults,
    facesResults,
    textResults,
    addressResultsLocal,
    videoResults,
    typeOfDocument,
    firstName,
    lastName,
    postCode
  );
  expect(result).toBe("LICENCE_POSTCODE_MISMATCH");
});

test('checkIdentity - Passport: name mismatch', async () => {
  const textResults = passportTexts;
  const typeOfDocument = "Passport";
  const firstName = "Victar";
  const lastName = "Crudo";
  const postCode = "TN4 8JX";
  const addressResultsLocal = JSON.parse(JSON.stringify(addressResults))
  delete addressResultsLocal.person_list;
  const result = lambda.checkIdentity(identityResults,
    facesResults,
    textResults,
    addressResultsLocal,
    videoResults,
    typeOfDocument,
    firstName,
    lastName,
    postCode
  );
  expect(result).toBe("PASSPORT_NAME_MISMATCH");
});

test('checkIdentity - Passport: post code mismatch', async () => {
  const textResults = passportTexts;
  const typeOfDocument = "Passport";
  const firstName = "Victor";
  const lastName = "Crudu";
  const postCode = "TN4 1JX";
  const addressResultsLocal = JSON.parse(JSON.stringify(addressResults))
  delete addressResultsLocal.person_list;
  const result = lambda.checkIdentity(identityResults,
    facesResults,
    textResults,
    addressResultsLocal,
    videoResults,
    typeOfDocument,
    firstName,
    lastName,
    postCode
  );
  expect(result).toBe("POSTCODE_MISMATCH");
});

test('checkIdentity - Passport: no person at address', async () => {
  const textResults = passportTexts;
  const typeOfDocument = "Passport";
  const firstName = "Victor";
  const lastName = "Crudu";
  const postCode = "TN4 8JX";
  const addressResultsLocal = JSON.parse(JSON.stringify(addressResults))
  delete addressResultsLocal.person_list;
  const result = lambda.checkIdentity(identityResults,
    facesResults,
    textResults,
    addressResultsLocal,
    videoResults,
    typeOfDocument,
    firstName,
    lastName,
    postCode
  );
  expect(result).toBe("POSTCODE_MISMATCH");
});

test('checkIdentity - Passport: no last year at address', async () => {
  const textResults = passportTexts;
  const typeOfDocument = "Passport";
  const firstName = "Victor";
  const lastName = "Crudu";
  const postCode = "TN4 8JX";
  const addressResultsLocal = JSON.parse(JSON.stringify(addressResults))
  addressResultsLocal.person_list[0].years_list.splice(3,1);
  const result = lambda.checkIdentity(identityResults,
    facesResults,
    textResults,
    addressResultsLocal,
    videoResults,
    typeOfDocument,
    firstName,
    lastName,
    postCode
  );
  expect(result).toBe("POSTCODE_MISMATCH");
});

test('checkIdentity - Passport: date of birth error', async () => {
  const typeOfDocument = "Passport";
  const firstName = "Victor";
  const lastName = "Crudu";
  const postCode = "TN4 8JX";
  const textResults = JSON.parse(JSON.stringify(passportTexts))
  const text = textResults.TextDetections.find(function(text){
    return text.Id === 12
  })
  text.DetectedText = text.DetectedText.replace("29 MAR/MAR 75", "29  / 75")
  const result = lambda.checkIdentity(identityResults,
    facesResults,
    textResults,
    addressResults,
    videoResults,
    typeOfDocument,
    firstName,
    lastName,
    postCode
  );
  expect(result).toBe("PASSPORT_DATEOFBIRTH_ERROR");
});

test('checkIdentity - Passport: multiple dates', async () => {
  const typeOfDocument = "Passport";
  const firstName = "Victor";
  const lastName = "Crudu";
  const postCode = "TN4 8JX";
  const textResults = JSON.parse(JSON.stringify(passportTexts))
  const text = textResults.TextDetections.find(function(text){
    return text.Id === 12
  })
  const anotherDateText = JSON.parse(JSON.stringify(text))
  anotherDateText.DetectedText = anotherDateText.DetectedText.replace("29 MAR/MAR 75", "29  OCT/OCT 75")
  textResults.TextDetections.push(anotherDateText)
  const result = lambda.checkIdentity(identityResults,
    facesResults,
    textResults,
    addressResults,
    videoResults,
    typeOfDocument,
    firstName,
    lastName,
    postCode
  );
  expect(result).toBe("SUCCESS");
});
