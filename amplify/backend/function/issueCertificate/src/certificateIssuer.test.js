const certificateIssuer = require('./certificateIssuer');

jest.setTimeout(30000);

test('test certificateIssuer', async (done) => {
    vaccineData = {
        name: "Victor Crudu",
        dateOfBirth: "02-02-1975",
        vaccineName: "BNT162b3 Pfizer",
        diseaseAgent: "SARS-CoV-2",
        firstDoseDate: "05-02-2021",
        secondDoseDate: "05-03-2021",
        validFrom: "13-03-2021",
        expirationDate: "13-09-2021",
        country: "GB",
        identifier: "GB.CMN.111111111.C1.V1"
      }
    done();
});