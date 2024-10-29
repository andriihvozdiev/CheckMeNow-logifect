const moment = require('moment');
const convenetApi = require('./convenetApi');


function lookForVaccine(medicalRecords, vaccineName) {
    if (medicalRecords.Schema1 &&
        medicalRecords.Schema1.MedicalRecord &&
        medicalRecords.Schema1.MedicalRecord.Medication) {
        const medications = medicalRecords.Schema1.MedicalRecord.Medication;
        console.log(`Looking for ${vaccineName} in Schema1:`);
        console.log(medications);
        const vaccines = medications.filter(drug => {
            return drug.DrugName.toLowerCase().includes(vaccineName.toLowerCase()) &&
                drug.DrugName.toLowerCase().includes("vaccine");
        });
        console.log(`Looking for ${vaccineName}. Found:`);
        console.log(vaccines);
        return vaccines;
    }
    if (medicalRecords.Schema2 &&
        medicalRecords.Schema2.MedicalRecord &&
        medicalRecords.Schema2.MedicalRecord.Medication) {
        const medications = medicalRecords.Schema2.MedicalRecord.Medication;
        console.log(`Looking for ${vaccineName} in Schema2:`);
        console.log(medications);
        const vaccines = medications.filter(drug => {
            return drug.DrugName.toLowerCase().includes(vaccineName.toLowerCase()) &&
                drug.DrugName.toLowerCase().includes("vaccine");
        });
        console.log(`Looking for ${vaccineName}. Found:`);
        console.log(vaccines);
        return vaccines;
    }

    if (medicalRecords.Schema3) {
        const medications = medicalRecords.Schema3;
        console.log(`Looking for ${vaccineName} in Schema3:`);
        console.log(medications);

        const vaccines = medications.filter(record => {
            return record.RecordItems && record.RecordItems.find(recordItem=>{
                return recordItem.Type==="Vaccination" &&
                recordItem.Details.toLowerCase().includes(vaccineName.toLowerCase())
            }) 
        });
        console.log(`Looking for ${vaccineName}. Found:`);
        console.log(vaccines);
        return vaccines;
    }
    return null;
}

async function doProductionProcessing(userDetails, secret, updateUserStatus, sendUserPushNotification) {
    console.log("authorising")
    const authorisation = await convenetApi.authorise(secret.client_id, secret.client_secret);
    const toDate = moment().format("YYYY-MM-DD");
    const sixMonthsAgo = moment().subtract(6, 'months').format("YYYY-MM-DD");
    console.log("getMedicalRecords")
    const medicalRecords = await convenetApi.getMedicalRecords(userDetails.patientId, sixMonthsAgo, toDate, authorisation.access_token);
    console.log("medicalRecords")
    console.log(JSON.stringify(medicalRecords))
    console.log("lookForVaccine")
    let vaccines = lookForVaccine(medicalRecords, "BNT162b2");
    let vaccineName = "BNT162b2";
    if (!vaccines || vaccines.length === 0) {
        vaccines = lookForVaccine(medicalRecords, "AstraZeneca");
        vaccineName = "AstraZeneca";
    }

    console.log("vaccines")
    console.log(vaccines)
    let userDetailsResult = null;
    
    if (vaccines && vaccines.length > 0) {
        userDetails.vaccineName = vaccineName;
        let vaccineMaxDate;
        if (medicalRecords.Schema1) {
            vaccineMaxDate = vaccines.reduce((maxDate, vaccine) => {
                const vaccineDateTime = moment(vaccine.EffectiveDate.Value);
                if (maxDate.isBefore(vaccineDateTime))
                    return vaccineDateTime;
                else
                    return maxDate;
            }, moment("1970-01-01", "YYYY-MM-DD"));
        } else if (medicalRecords.Schema3) {
            vaccineMaxDate = vaccines.reduce((maxDate, vaccine) => {
                const vaccineDateTime = moment(vaccine.Date);
                if (maxDate.isBefore(vaccineDateTime))
                    return vaccineDateTime;
                else
                    return maxDate;
            }, moment("1970-01-01", "YYYY-MM-DD"));
        } else {
            return;
        }


        const durationHours = moment().diff(vaccineMaxDate, 'hours');
        if (durationHours > 6 * 4 * 7 * 24){
            return;
        }
        if (vaccines.length === 1 && userDetails.userStatus !== "FIRST_DOSE_CONFIRMED") {
            userDetails.userStatus = "FIRST_DOSE_CONFIRMED";
            console.log("FIRST_DOSE_CONFIRMED")
        } else if (vaccines.length > 1) {
            if (durationHours >= 7 * 24 && userDetails.userStatus !== "IMMUNITY_CONFIRMED") {
                console.log("IMMUNITY_CONFIRMED")
                userDetails.userStatus = "IMMUNITY_CONFIRMED";
            } else if (userDetails.userStatus !== "VACCINATION_CONFIRMED"){
                userDetails.userStatus = "VACCINATION_CONFIRMED";
                console.log("VACCINATION_CONFIRMED")
            }
        }

        userDetailsResult = {id:userDetails.id, userStatus: userDetails.userStatus, vaccineName: userDetails.vaccineName};
        if (updateUserStatus){
            await updateUserStatus(userDetails.id, userDetails.version, userDetails.userStatus, userDetails.vaccineName);
        }
        if (sendUserPushNotification){
            await sendUserPushNotification(userDetails);
        }
    }

    return userDetailsResult;
}

module.exports = {
    doProductionProcessing: doProductionProcessing
}