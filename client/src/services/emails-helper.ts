import { ApolloClient, DocumentNode } from "@apollo/client";
import { Email, Participant } from "interfaces/interfaces";
import { GET_RECEIVED_EMAILS, GET_SENT_EMAILS } from "./graphql";

interface QueryOptions {
  query: DocumentNode;
  variables: {
    loggedInUserEmail: string;
  };
}

interface PrevDataOptions {
  query: DocumentNode;
  loggedInUserEmail: string;
  client: ApolloClient<any>;
}

const getQueryOptions = (query: DocumentNode, loggedInUserEmail: string) => {
  return { query, variables: { loggedInUserEmail } };
};

const getPrevData = ({ query, loggedInUserEmail, client }: PrevDataOptions): Email[] => {
  const queryOptions = getQueryOptions(query, loggedInUserEmail);
  const { getReceivedEmails, getSentEmails } = client.readQuery(queryOptions);
  return getReceivedEmails ? getReceivedEmails : getSentEmails;
};

const writeToCache = (client: ApolloClient<any>, queryOptions: QueryOptions, isReceivedEmails: boolean, newData: Email[]) => {
  const objectToCache = {
    ...queryOptions,
    data: isReceivedEmails ? { getReceivedEmails: newData } : { getSentEmails: newData }
  };

  client.writeQuery(objectToCache);
};

const addNewEmailToCache = (newEmail: Email, loggedInUserEmail: string, client: ApolloClient<any>) => {
  const { email: recipientEmail } = newEmail.recipient as Participant;
  const { email: senderEmail } = newEmail.sender as Participant;
  const isSentToYourself = recipientEmail === senderEmail && recipientEmail === loggedInUserEmail;

  const updateCachedQuery = ({ query, loggedInUserEmail, client }: PrevDataOptions) => {
    const queryOptions = getQueryOptions(query, loggedInUserEmail);

    if (client.readQuery(queryOptions)) {
      const prevData = getPrevData({ query, loggedInUserEmail, client });
      const newData = [newEmail, ...prevData];
      const isReceivedEmails = query === GET_RECEIVED_EMAILS;
      writeToCache(client, queryOptions, isReceivedEmails, newData);
    }
  };

  if (isSentToYourself) {
    [GET_RECEIVED_EMAILS, GET_SENT_EMAILS].forEach((query) => {
      updateCachedQuery({ query, loggedInUserEmail, client });
    });
  } else {
    const query = recipientEmail === loggedInUserEmail ? GET_RECEIVED_EMAILS : GET_SENT_EMAILS;
    updateCachedQuery({ query, loggedInUserEmail, client });
  }
};

const deleteEmailsFromCache = (idsToDelete: string[], activeTab: number, loggedInUserEmail: string, client: ApolloClient<any>) => {
  const isReceivedEmails = activeTab === 0;
  const query = isReceivedEmails ? GET_RECEIVED_EMAILS : GET_SENT_EMAILS;
  const prevData = getPrevData({ query, loggedInUserEmail, client });
  const newData = Object.values(prevData).filter(email => !idsToDelete.includes(email.id));
  const queryOptions = getQueryOptions(query, loggedInUserEmail);
  writeToCache(client, queryOptions, isReceivedEmails, newData);
};

export { addNewEmailToCache, deleteEmailsFromCache };