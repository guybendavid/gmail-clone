import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache, split, type ApolloLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import { App } from "#root/client/App";

const isProduction = import.meta.env.MODE === "production";
const baseUrl = import.meta.env.VITE_BASE_URL || "localhost:4000";
const httpUri = isProduction ? `${window.location.origin}/graphql` : `http://${baseUrl}`;

const getWsUri = (uri: string) => {
  const url = new URL(uri);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  return url.toString();
};

const wsUri = getWsUri(httpUri);

const baseHttpLink: ApolloLink = new HttpLink({
  uri: httpUri
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
    url: wsUri,
    lazy: false,
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
