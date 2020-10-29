import { Injectable } from "@angular/core";
import { ApolloQueryResult, DocumentNode, ObservableQuery, TypedDocumentNode } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import { queryAll, queryAllItems } from '../graphql/queries.graphql';
import { Observable } from 'rxjs';
import { FetchResult } from 'apollo-link';
import { createTaskx, deleteTask, markComplete, MutationComplete, MutationOperation } from '../graphql/mutation.graphql';


@Injectable()
export class TodoService {
    constructor(private apollo: Apollo,private mutationOperation : MutationOperation, private completeTasks : MutationComplete) {

    }

    queryAllItems = async (): Promise<any> => {
        return await queryAllItems(this.apollo);
    }

    deleteOne = async (id: string): Promise<any> => {
        return await deleteTask(id,this.apollo)
    }

    completeTask = async (id:string,status:boolean): Promise<any> => {
        return await markComplete(id,status,this.apollo);
    }

    createTask  = async (name : string,description:string) : Promise<any> => {
        return await createTaskx(name,this.apollo,description);
    }   
}