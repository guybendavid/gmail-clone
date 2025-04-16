import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, ApolloLink, split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import App from "App";

const { NODE_ENV, REACT_APP_BASE_URL } = process.env;
const isProduction = NODE_ENV === "production";
let httpLink: ApolloLink = new HttpLink({ uri: isProduction ? "" : `http://${REACT_APP_BASE_URL}` });

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${localStorage.getItem("token")}`
    }
  };
});

httpLink = authLink.concat(httpLink);

const wsLink = new WebSocketLink({
  uri: isProduction ? `wss://${window.location.host}` : `ws://${REACT_APP_BASE_URL}`,
  options: {
    reconnect: true,
    connectionParams: {
      authorization: `Bearer ${localStorage.getItem("token")}`
    }
  }
});

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

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
