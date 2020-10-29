import {NgModule} from '@angular/core';
import {APOLLO_OPTIONS} from 'apollo-angular';
import {InMemoryCache} from '@apollo/client/core';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { HttpLinkModule, HttpLink } from "apollo-angular-link-http";



const uri = 'http://localhost:3000/graphql'; // <-- add the URL of the GraphQL server here
export function createApollo(httpLink: HttpLink) {

  const http = httpLink.create({uri})

  const linkError = onError(({ graphQLErrors, networkError }) => {
    // console.log(graphQLErrors)
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        ),
      );
  
    if (networkError) console.log(`[Network error]:`, networkError);
  });

  const linkOperation = onError(({ response, operation }) => {
    // console.log(response,operation)
    if (operation.operationName === 'IgnoreErrorsQuery') {
      response.errors = null;
    }
  })

  const httpLinkWithErrorHandling = ApolloLink.from([
    linkError.concat(linkOperation),
    http,
 ]);
 


  return {
    link:  httpLinkWithErrorHandling,
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        errorPolicy: 'all'
      }
    }
  };
}

@NgModule({
  imports : [HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
