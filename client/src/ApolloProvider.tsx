import React from "react";
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import App from "./App";

const isProduction = process.env.NODE_ENV === "production";

let httpLink: any = new HttpLink({
  uri: isProduction ?
    `https://${process.env.REACT_APP_BASE_URL_PRODUCTION}` :
    `http://${process.env.REACT_APP_BASE_URL}`
});

const authLink = setContext((_, { headers }: any) => {
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${localStorage.getItem("token")}`
    }
  };
});

httpLink = authLink.concat(httpLink);

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);