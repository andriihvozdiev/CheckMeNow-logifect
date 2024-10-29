import { gpList } from '../graphql/queries'
import { API, graphqlOperation } from 'aws-amplify';

export default {
    getGPList: async (postCode) => {
        try {
            const queryResult = await API.graphql(graphqlOperation(gpList,
                {
                    postCode: postCode
                }
            ))
            return queryResult.data.gpList.Result
        }
        catch (err) {
            console.log(err)
            return { err: err }
        }
    }
}