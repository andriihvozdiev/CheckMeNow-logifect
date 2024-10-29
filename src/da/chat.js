import { chatNext } from '../graphql/queries';
import { API, graphqlOperation } from 'aws-amplify';

export default {
  executeTransitionLocal: async (dialogState) => {
    try {
      const queryResult = await API.graphql(
        graphqlOperation(chatNext, {
          chatNextInput: dialogState,
        }),
      );

      return queryResult.data.chatNext;
    } catch (err) {
      console.log(err);
      return { err: err };
    }
  },
};
