const moment = require('moment');
const convenetApi = require('./convenetApi');
const medicalRecordsProcessing = require('./medicalRecordsProcessing');

module.exports = {
  testMethod: function () {
    return moment().toString();
  },
  getVaccineDetails: async function (userDetails) {
    console.log("process.env");
    console.log(process.env);

    console.log("userDetails");
    console.log(userDetails);

    let vaccineDetails = null;

    try {
      const secretString = await convenetApi.getConvenetAPISecrets(process.env.REGION, process.env.ENV);
      console.log("secretString");
      console.log(secretString);
      const secret = JSON.parse(secretString);
      vaccineDetails = await medicalRecordsProcessing.doProductionProcessing(userDetails, secret, false);
    } catch (err) {
      return {
        statusCode: 500,
        error: JSON.stringify(err)
      }
    }

    console.log("vaccineDetails");
    console.log(vaccineDetails);

    const response = {
      statusCode: 200,
      userStatus: vaccineDetails.userStatus,
      vaccineDetails: vaccineDetails.vaccineDetailsArray,
      vaccineName: vaccineDetails.vaccineName
    };
    console.log("response");
    console.log(response);

    return response;
  }
}

