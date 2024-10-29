const convenetApi = require('./convenetApi');
require('dotenv').config()

test('practice settings', async (done) => {
    const authorisation_result = await convenetApi.authorise(process.env.CONVENET_CLIENT_ID, process.env.CONVENET_SECRET_ID)
    console.log(authorisation_result);
    const practiceSettings = await convenetApi.getPracticeSettings("A28579", authorisation_result.access_token)
    console.log(practiceSettings)
    const patientSettings = await convenetApi.getPatientSettings("bac076a6-0e92-4d73-bbc9-5ccbfba86011", authorisation_result.access_token)
    console.log(patientSettings)
    
    const medicalRecords = await convenetApi.getMedicalRecords("bac076a6-0e92-4d73-bbc9-5ccbfba86011", "2021-01-01", "2021-03-01", authorisation_result.access_token)
    console.log(medicalRecords)
    done();
});