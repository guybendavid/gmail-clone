import { gql } from "@apollo/client";

const AUTH_FIELDS = gql`
  fragment AuthFields on User {
    id
    image
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

export const LOGIN_USER = gql`
  ${AUTH_FIELDS}
  mutation LoginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        ...AuthFields
        firstName
        lastName
        email
      }
      token
    }
  }
`;

export const REGISTER_USER = gql`
  ${AUTH_FIELDS}
  mutation RegisterUser($firstName: String!, $lastName: String!, $email: String!, $password: String!) {
    register(firstName: $firstName, lastName: $lastName, email: $email, password: $password) {
      user {
        ...AuthFields
      }
      token
    }
  }
`;

export const GET_RECEIVED_EMAILS = gql`
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

export const GET_SENT_EMAILS = gql`
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

export const SEND_EMAIL = gql`
  mutation SendEmail($senderEmail: String!, $recipientEmail: String!, $subject: String!, $content: String!) {
    sendEmail(senderEmail: $senderEmail, recipientEmail: $recipientEmail, subject: $subject, content: $content) {
      id
    }
  }
`;

export const DELETE_EMAILS = gql`
  mutation DeleteEmails($ids: [ID]!) {
    deleteEmails(ids: $ids)
  }
`;

export const NEW_EMAIL = gql`
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
