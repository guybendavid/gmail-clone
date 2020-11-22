import { gql } from "@apollo/client";

const LOGIN_USER = gql`
mutation LoginUser($email: String! $password: String!) {
  login(email: $email password: $password) {
    id
    email
    image
    token
  }
}
`;

const REGISTER_USER = gql`
mutation RegisterUser($firstName: String! $lastName: String! $email: String! $password: String!) {
  register(firstName: $firstName lastName: $lastName email: $email password: $password) {
    id
    image
    token
  }
}
`;

const GET_EMAILS = gql`
  query GetEmails {
    getEmails {
        id
        senderId
        recipientId
        subject
        content
        createdAt
    }
  }
`;

const SEND_EMAIL = gql`
mutation SendEmail($recipientId: ID! $subject: String! $content: String!) {
  sendEmail(recipientId: $recipientId subject: $subject content: $content) {
    id
  }
}
`;

const DELETE_EMAILS = gql`
mutation DeleteEmails($ids: [ID]!) {
  deleteEmails(ids: $ids)
}
`;

export { GET_EMAILS, LOGIN_USER, REGISTER_USER, SEND_EMAIL, DELETE_EMAILS };