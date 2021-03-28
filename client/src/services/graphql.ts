import { gql } from "@apollo/client";

const LOGIN_USER = gql`
  mutation LoginUser($email: String! $password: String!) {
    login(email: $email password: $password) {
      id
      firstName
      lastName
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

const EMAIL_FIELDS = gql`
  fragment EmailFields on Email {
    id
    subject
    content
    createdAt
  }
`;

const EMAIL_PARTICIPANT_FIELDS = gql`
  fragment ParticipantFields on Participant {
    email
    fullName
  }
`;

const GET_RECEIVED_EMAILS = gql`
  ${EMAIL_FIELDS}
  ${EMAIL_PARTICIPANT_FIELDS}
  query GetReceivedEmails($loggedInUserEmail: String!) {
    getReceivedEmails(loggedInUserEmail: $loggedInUserEmail) {
      ...EmailFields
      sender {
        ...ParticipantFields
      }
    }
  }
`;

const GET_SENT_EMAILS = gql`
  ${EMAIL_FIELDS}
  ${EMAIL_PARTICIPANT_FIELDS}
  query GetSentEmails($loggedInUserEmail: String!) {
    getSentEmails(loggedInUserEmail: $loggedInUserEmail) {
      ...EmailFields
      recipient {
        ...ParticipantFields
      }
    }
  }
`;

const SEND_EMAIL = gql`
  mutation SendEmail($senderEmail: String! $recipientEmail: String! $subject: String! $content: String!) {
    sendEmail(senderEmail: $senderEmail recipientEmail: $recipientEmail subject: $subject content: $content) {
      id
    }
  }
`;

const DELETE_EMAILS = gql`
  mutation DeleteEmails($ids: [ID]!) {
    deleteEmails(ids: $ids)
  }
`;

const NEW_EMAIL = gql`
  ${EMAIL_FIELDS}
  ${EMAIL_PARTICIPANT_FIELDS}
  subscription NewEmail {
    newEmail {
      ...EmailFields
      sender {
        ...ParticipantFields
      }
      recipient {
        ...ParticipantFields
      }
    }
  }
`;

export { GET_RECEIVED_EMAILS, GET_SENT_EMAILS, LOGIN_USER, REGISTER_USER, SEND_EMAIL, DELETE_EMAILS, NEW_EMAIL };