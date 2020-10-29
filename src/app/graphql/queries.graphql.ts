import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

export const queryAll = gql`
    query {
        items {
            id
            name
            description
            status
            createdDate
            changedDate
        }   
}
`

export const queryOne = gql`
    query itemById($id : String!) {
        itemById(
            id : $id
        ){
            id
            name
            description
            status
            createdDate
            changedDate
        }
    }
`

export const queryAllItems = async (apollo:Apollo) => {
    return await apollo.client.query({query : queryAll});
}