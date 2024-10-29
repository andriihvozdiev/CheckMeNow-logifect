import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import { API, graphqlOperation } from 'aws-amplify';
import { version } from 'react';

export default {
  add: async (user) => {
    try {
      const userResult = await API.graphql(
        graphqlOperation(mutations.createUserDetails, {
          input: user,
        }),
      );
      console.log("userResult.data");
      return userResult.data.createUserDetails;
    } catch (err) {
      console.log(err);
    }
  },
  update: async (user) => {
    try {

      const userResult = await API.graphql(
        graphqlOperation(mutations.updateUserDetails, {
          input: user,
        }),
      );
    } catch (err) {
      console.log(err);
    }
  },
  delete: async (user) => {
    try {
      const userResult = await API.graphql(
        graphqlOperation(mutations.deleteUserDetails, {
          input: user
        }),
      );

    } catch (err) {
      console.log(err);
    }
  },
  getByEmail: async (email) => {
    try {
      const userResult = await API.graphql(
        graphqlOperation(queries.userDetailsByEmail, {
          email: email,
        }),
      );
      const items = userResult.data.userDetailsByEmail.items;
      return items.length === 0 ? null : items[0];
    } catch (err) {
      console.log(err);
    }
  },
};
