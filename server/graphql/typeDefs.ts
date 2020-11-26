import { gql } from "apollo-server";

export = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    image: String!
    email: String
    token: String
  }
  type Email {
    id: ID!
    senderId: ID!
    recipientId: ID!
    subject: String!
    content: String!
    createdAt: String!
  }
  type Query {
    getEmails: [Email]!
  }
  type Mutation {
    login(email: String! password: String!): User!
    register(firstName: String! lastName: String! email: String! password: String!): User!
    sendEmail(recipientId: ID! subject: String! content: String!): Email!
    deleteEmails(ids: [ID]!): Boolean
  }
`;