import type { ApolloLink } from "@apollo/client";
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import { App } from "App";

const isProduction = import.meta.env.MODE === "production";
const baseUrl = import.meta.env.VITE_BASE_URL || "localhost:4000";

const baseHttpLink: ApolloLink = new HttpLink({
  uri: isProduction ? `${window.location.origin}/graphql` : `http://${baseUrl}`
});

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    ...(localStorage.getItem("token") ? { authorization: `Bearer ${localStorage.getItem("token")}` } : {})
  }
}));

const httpLink = authLink.concat(baseHttpLink);

const wsLink = new GraphQLWsLink(
  createClient({
    url: isProduction ? `wss://${window.location.host}` : `ws://${baseUrl}`,
    connectionParams: () => ({
      ...(localStorage.getItem("token") ? { authorization: `Bearer ${localStorage.getItem("token")}` } : {})
    })
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === "OperationDefinition" && definition.operation === "subscription";
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getReceivedEmails: {
            merge: (_prevResult, incomingResult) => incomingResult
          },
          getSentEmails: {
            merge: (_prevResult, incomingResult) => incomingResult
          }
        }
      }
    }
  })
});

export const ApolloProviderWrapper = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
