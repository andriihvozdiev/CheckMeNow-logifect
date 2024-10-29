import { cmnLinkUserToPatient } from '../graphql/queries';
import { API, graphqlOperation } from 'aws-amplify';

export default {
  registerPatient: async (patientDetails) => {
    try {
      const queryResult = await API.graphql(
        graphqlOperation(cmnLinkUserToPatient, {
          linkUserToPatientInput: patientDetails
        }),
      );
      console.log("queryResult");
      console.log(queryResult);
      return queryResult.data.cmnLinkUserToPatient;
    } catch (err) {
      console.log(err);
      return {statusCode: 400};
    }
  },
};
