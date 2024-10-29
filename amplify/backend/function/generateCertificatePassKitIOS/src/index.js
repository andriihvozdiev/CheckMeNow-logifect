const { createPass, Pass } = require("passkit-generator");
const fs = require('fs');
const concat = require('concat-stream');
const { Base64Encode } = require('base64-stream');

function getPassKitTemplate() {
    return {
        formatVersion: 1,
        passTypeIdentifier: "pass.com.logifect.vaccinecertificate",
        serialNumber: "RandomString",
        webServiceURL: "https://checkmenow.logifect.com/passes/",
        authenticationToken: "vxwxd7J8AlNNFPS8k0a0FfUFtq0ewzFdc",
        teamIdentifier: "AT7Q9B6T32",
        barcode: {
          message: "123456789",
          format: "PKBarcodeFormatQR",
          messageEncoding: "iso-8859-1"
        },
        organizationName: "CheckMeNow",
        description: "Vaccine Certificate",
        logoText: "CheckMeNow",
        foregroundColor: "#000000",
        backgroundColor: "#ffffff",
        generic: {
          primaryFields: [
            {
              key: "fullaNameAndBirthDay",
              label: "Full name",
              value: "Elizabeth Adams 04/02/1947"
            }
          ],
          secondaryFields: [
            {
                  key: "certificateIdentifier",
                  value: "CMN.GB.100000000.TT.VV",
                  label: "Certificate identifier"
               },
            {
               key: "vaccineName",
               value: "BNT162b3 Pfizer",
               label: "Vaccine name"
            }
          ],
          auxiliaryFields: [
            {
               key: "diseaseAgent",
               value: "SARS-CoV-2",
               label: "Disease Agent"
            },
            {
               key: "validFrom",
               label: "Valid from",
               value: "16/03/2021"
            },
            {
               key: "expirationDate",
               value: "16/09/2021",
               label: "Expires on"
            }
          ],
          backFields: []
        }
      }      
}

const streamToBase64 = (stream) => {
  return new Promise((resolve, reject) => {
    const base64 = new Base64Encode()

    const cbConcat = (base64) => {
      resolve(base64);
    }

    stream
      .pipe(base64)
      .pipe(concat(cbConcat))
      .on('error', (error) => {
        reject(error)
      });
  });
}

exports.handler = async (event) => {

    try {
        console.log(event);

        var template = getPassKitTemplate();

        template.barcode.message = event.arguments.passKitInput.barcode;
        template.generic.primaryFields[0].value = event.arguments.passKitInput.fullName + " " + event.arguments.passKitInput.dateOfBirth;
        template.generic.secondaryFields[0].value = event.arguments.passKitInput.certificateIdentifier ? event.arguments.passKitInput.certificateIdentifier : "";
        template.generic.secondaryFields[1].value = event.arguments.passKitInput.vaccineName ? event.arguments.passKitInput.vaccineName : "";
        template.generic.auxiliaryFields[0].value = event.arguments.passKitInput.diseaseAgent ? event.arguments.passKitInput.diseaseAgent : "";
        template.generic.auxiliaryFields[1].value = event.arguments.passKitInput.validFrom ? event.arguments.passKitInput.validFrom : "";
        template.generic.auxiliaryFields[2].value = event.arguments.passKitInput.expirationDate ? event.arguments.passKitInput.expirationDate : "";

        var pass = JSON.stringify(template);

        console.log(pass);

        var fs = require('fs');
        var passModelTemp = '/tmp/passModels';

        if (!fs.existsSync(passModelTemp)){
            fs.mkdirSync(passModelTemp);
        }

        var certificatePass = '/tmp/passModels/certificate.pass';

        if (!fs.existsSync(certificatePass)){
            fs.mkdirSync(certificatePass);
        }

        fs.writeFile(certificatePass + '/pass.json', pass, function (err,data) {
            if (err) {
              throw err;
            }
        });

        fs.copyFile('./assets/passModels/certificate.pass/icon.png', '/tmp/passModels/certificate.pass/icon.png', (err) => {
            if (err) throw err;
            console.log('icon.png was copied');
        });

        fs.copyFile('./assets/passModels/certificate.pass/icon@2x.png', '/tmp/passModels/certificate.pass/icon@2x.png', (err) => {
            if (err) throw err;
            console.log('icon@2x.png was copied');
        });

        fs.copyFile('./assets/passModels/certificate.pass/logo.png', '/tmp/passModels/certificate.pass/logo.png', (err) => {
            if (err) throw err;
            console.log('logo.png was copied');
        });

        fs.copyFile('./assets/passModels/certificate.pass/logo@2x.png', '/tmp/passModels/certificate.pass/logo@2x.png', (err) => {
            if (err) throw err;
            console.log('logo@2x.png was copied');
        });

        const passBundle = await createPass({
            model: "/tmp/passModels/certificate",
            certificates: {
                wwdr: "./assets/certs/AppleWWDRCA.pem",
                signerCert: "./assets/certs/passSignerCert.pem",
                signerKey: {
                    keyFile: "./assets/certs/passSignerKey.pem",
                    passphrase: "saltPaper1945!"
                }
            }
        });

        // Generate the stream .pkpass file stream
        const stream = passBundle.generate();
        console.log(".pkpass file stream generated");

        // Create a writable stream
        var writerStream = fs.createWriteStream('/tmp/passModels/certificate.pkpass');
        stream.pipe(writerStream);
        
        return streamToBase64(stream);
    } catch (err) {

        console.log(err);

        const errResponse = {
            statusCode: 500,
            err: err
        };

        return errResponse;
    }
};
