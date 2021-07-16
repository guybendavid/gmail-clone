import { gql } from "apollo-server";

const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    image: String!
    email: String
    password: String
    token: String!
  }
  type Participant {
    email: String!
    fullName: String
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
    login(email: String! password: String!): User!
    register(firstName: String! lastName: String! email: String! password: String!): User!
    sendEmail(senderEmail: String! recipientEmail: String! subject: String! content: String!
    isSenderNameInClient: Boolean! isRecipientNameInClient: Boolean!): Email!
    deleteEmails(ids: [ID]!): Boolean
  }
  type Subscription {
    newEmail: Email!
  }
`;

export default typeDefs;