const medicalRecordsProcessing = require('./medicalRecordsProcessing');
require('dotenv').config()

jest.setTimeout(30000);

test('test medicalRecordsProcessing', async (done) => {
    const userDetails = {
        userStatus: "VACCINATION_CONFIRMED",
        patientId: "bac076a6-0e92-4d73-bbc9-5ccbfba86011"
    };
    const secret = {
        client_id: process.env.CONVENET_CLIENT_ID,
        client_secret: process.env.CONVENET_SECRET_ID
    };
    await medicalRecordsProcessing.doProductionProcessing(userDetails, secret,
        async (userId, version, newUserStatus, vaccineName) => {
            console.log("newUserStatus");
            console.log(newUserStatus);
            console.log("vaccineName");
            console.log(vaccineName);
            return Promise.resolve()
        },
        async (userDetails) => {
            console.log("userDetails")
            console.log(userDetails)
            return Promise.resolve()
        })
    done();
});