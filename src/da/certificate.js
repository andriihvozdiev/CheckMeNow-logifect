import { issueCertificate, generateCertificatePassKitIos } from '../graphql/queries';
import { API, graphqlOperation } from 'aws-amplify';

export default {
  issueCertificate: async (issueCertificateInput) => {
    try {
      const queryResult = await API.graphql(
        graphqlOperation(issueCertificate, {
          issueCertificateInput: issueCertificateInput
        }),
      );
      console.log("issueCertificate queryResult");
      console.log(queryResult);
      return queryResult.data.issueCertificate;
    } catch (err) {
      console.log(err);
      return { statusCode: 500 };
    }
  },
  generateCertificatePassKit: async (os, input) => {
    switch (os) {
      case "ios":
        try {
          const queryResult = await API.graphql(
            graphqlOperation(generateCertificatePassKitIos, {
              passKitInput: input
            }),
          );
          console.log(JSON.stringify(queryResult));
          return queryResult.data.generateCertificatePassKitIOS;
        } catch (err) {
          console.log(err);
          return { statusCode: 500 };
        }
        break;
    }

    console.log("no strategy set");
    return { statusCode: 500 };
  }
};
