"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
exports.default = (0, apollo_server_1.gql) `
  type Participant {
    email: String!
    fullName: String!
  }
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    image: String!
    email: String
    password: String
  }
  type AuthOperationResponse {
    user: User!
    token: String!
  }
  type Email {
    id: ID!
    sender: Participant!
    recipient: Participant!
    subject: String!
    content: String!
    createdAt: String!
  }
  type Query {
    getReceivedEmails(loggedInUserEmail: String!): [Email]!
    getSentEmails(loggedInUserEmail: String!): [Email]!
  }
  type Mutation {
    login(email: String! password: String!): AuthOperationResponse!
    register(firstName: String! lastName: String! email: String! password: String!): AuthOperationResponse!
    sendEmail(senderEmail: String! recipientEmail: String! subject: String! content: String!): Email!
    deleteEmails(ids: [ID]!): Boolean
  }
  type Subscription {
    newEmail: Email!
  }
`;
