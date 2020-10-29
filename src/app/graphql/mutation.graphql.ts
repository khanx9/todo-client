import { Injectable } from '@angular/core';
import { Apollo, Mutation } from 'apollo-angular';
import gql from 'graphql-tag';
import { queryAll } from './queries.graphql';


export const deleteOne = gql`
    mutation deleteItem($id : String!) {
        deleteItem(id: $id) {
            id
            description
            name
            status
        }
}
`

export const completeTask = gql`
    mutation updateItem($status : Boolean!,$id : String!) {
    updateItem(input : {
        status : $status
    }, id :$id){
            id
            name
            description
            status
    }
    }
`

export const createTask = gql`
    mutation createItem($name : String!, $description : String){
  createItem(input : {
        name : $name,
		description : $description
  }){
    id
    name
   	description
    status
  }
}
`

export const createTaskx = async (name: string,apollo: Apollo, description? :string, ) => {
    return await apollo.client.mutate({
        mutation: createTask,
        variables: {
            name,description
        },
        awaitRefetchQueries: true,
        refetchQueries: [{
            query: queryAll
        }]
    })
}

export const deleteTask = async (id: string, apollo: Apollo) => {
    return await apollo.client.mutate({
        mutation: deleteOne,
        variables: {
            id
        },
        awaitRefetchQueries: true,
        refetchQueries: [{
            query: queryAll
        }]
    })
}

export const markComplete = async (id: string, status: boolean, apollo: Apollo) => {
    return apollo.client.mutate({
        mutation: completeTask,
        variables: {
            id, status
        },
        awaitRefetchQueries: true,
        refetchQueries: [{
            query: queryAll
        }]
    })
}




@Injectable({
    providedIn: 'root',
})
export class MutationOperation extends Mutation {
    document = deleteOne
}


@Injectable({
    providedIn: 'root',
})
export class MutationComplete extends Mutation {
    document = completeTask
}