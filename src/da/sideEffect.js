import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import { API, graphqlOperation } from 'aws-amplify';

export default {
  add: async (sideEffects) => {
    try {
      const sideEffectsResult = await API.graphql(
        graphqlOperation(mutations.createSideEffects, {
          input: sideEffects,
        }),
      );
      console.log('Add sideEffectsDResult');
      console.log(sideEffectsResult);
    } catch (err) {
      console.log(err);
      return { err: err };
    }
  },
  update: async (sideEffects) => {
    try {
      //console.log('sideEffects');
      //console.log(sideEffects);
      const sideEffectsResult = await API.graphql(
        graphqlOperation(mutations.updateSideEffects, {
          input: sideEffects,
        }),
      );
      //console.log('UpdateSideEffectsUpdate');
      //console.log(sideEffectsResult);
    } catch (err) {
      console.log(err);
      return { err: err };
    }
  },
  delete: async (sideEffects) => {
    try {
      const sideEffectsResult = await API.graphql(
        graphqlOperation(mutations.deleteSideEffects, {
          input: sideEffects,
        }),
      );
      console.log(sideEffectsResult);
    } catch (err) {
      console.log(err);
      return { err: err };
    }
  },
  getSideEffectsByEmail: async (email) => {
    try {
      const sideEffectsResult = await API.graphql(
        graphqlOperation(queries.sideEffectsByEmail, {
          email: email,
        }),
      );
      const items = sideEffectsResult.data.sideEffectsByEmail.items;
      return items.length === 0 ? null : items[0];
      //return items;
    } catch (err) {
      console.log(err);
      return { err: err };
    }
  },
};
