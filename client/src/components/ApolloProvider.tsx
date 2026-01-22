import type { ApolloLink } from "@apollo/client";
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getOperationAST } from "graphql";
import { createClient } from "graphql-ws";
import { App } from "App";

const isProduction = import.meta.env.MODE === "production";
const rawBaseUrl = import.meta.env.VITE_BASE_URL || "localhost:4000";
const normalizedBaseUrl = rawBaseUrl.replace(/\/+$/, "");
const isAbsoluteBaseUrl = /^https?:\/\//i.test(normalizedBaseUrl);
const httpBaseUrl = isAbsoluteBaseUrl ? normalizedBaseUrl : `http://${normalizedBaseUrl}`;
const parsedUrl = new URL(httpBaseUrl);
const wsProtocol = parsedUrl.protocol === "https:" ? "wss:" : "ws:";
const wsUrlForDev = `${wsProtocol}//${parsedUrl.host}`;

const baseHttpLink: ApolloLink = new HttpLink({
  uri: isProduction ? window.location.origin : httpBaseUrl
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
    url: isProduction ? `wss://${window.location.host}` : wsUrlForDev,
    lazy: false,
    connectionParams: () => ({
      ...(localStorage.getItem("token") ? { authorization: `Bearer ${localStorage.getItem("token")}` } : {})
    })
  })
);

const splitLink = split(({ query }) => getOperationAST(query)?.operation === "subscription", wsLink, httpLink);

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
