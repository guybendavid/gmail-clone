import { ApolloClient } from "@apollo/client";
import type { DocumentNode } from "graphql";
import { Email } from "types/types";
import { GET_RECEIVED_EMAILS, GET_SENT_EMAILS } from "./graphql";

type QueryOptions = {
  query: DocumentNode;
  variables: {
    loggedInUserEmail: string;
  };
};

type PrevDataOptions = {
  query: DocumentNode;
  loggedInUserEmail: string;
  client: ApolloClient<unknown>;
};

interface UpdateCachedEmailsListOptions extends PrevDataOptions {
  newEmail: Email;
}

export const addNewEmailToCache = ({
  newEmail,
  loggedInUserEmail,
  client
}: {
  newEmail: Email;
  loggedInUserEmail: string;
  client: ApolloClient<unknown>;
}) => {
  const { email: recipientEmail } = newEmail.recipient;
  const { email: senderEmail } = newEmail.sender;
  const isSentToYourself = recipientEmail === senderEmail && recipientEmail === loggedInUserEmail;

  if (isSentToYourself) {
    [GET_RECEIVED_EMAILS, GET_SENT_EMAILS].forEach((query) => {
      updateCachedEmailsList({ query, loggedInUserEmail, client, newEmail });
    });

    return;
  }

  const query = recipientEmail === loggedInUserEmail ? GET_RECEIVED_EMAILS : GET_SENT_EMAILS;
  updateCachedEmailsList({ query, loggedInUserEmail, client, newEmail });
};

export const deleteEmailsFromCache = ({
  idsToDelete,
  activeTab,
  loggedInUserEmail,
  client
}: {
  idsToDelete: string[];
  activeTab: number;
  loggedInUserEmail: string;
  client: ApolloClient<unknown>;
}) => {
  const isReceivedEmails = activeTab === 0;
  const query = isReceivedEmails ? GET_RECEIVED_EMAILS : GET_SENT_EMAILS;
  const prevData = getPrevData({ query, loggedInUserEmail, client });
  const newData = Object.values(prevData).filter((email) => !idsToDelete.includes(email.id));
  const queryOptions = getQueryOptions(query, loggedInUserEmail);
  writeToCache(client, queryOptions, isReceivedEmails, newData);
};

const updateCachedEmailsList = ({ query, loggedInUserEmail, client, newEmail }: UpdateCachedEmailsListOptions) => {
  const queryOptions = getQueryOptions(query, loggedInUserEmail);

  if (client.readQuery(queryOptions)) {
    const prevData = getPrevData({ query, loggedInUserEmail, client });
    const newData = [newEmail, ...prevData];
    const isReceivedEmails = query === GET_RECEIVED_EMAILS;
    writeToCache(client, queryOptions, isReceivedEmails, newData);
  }
};

const getPrevData = ({ query, loggedInUserEmail, client }: PrevDataOptions): Email[] => {
  const queryOptions = getQueryOptions(query, loggedInUserEmail);
  const { getReceivedEmails, getSentEmails } = client.readQuery(queryOptions);
  return getReceivedEmails ? getReceivedEmails : getSentEmails;
};

const getQueryOptions = (query: DocumentNode, loggedInUserEmail: string) => ({
  query,
  variables: { loggedInUserEmail }
});

const writeToCache = (
  client: ApolloClient<unknown>,
  queryOptions: QueryOptions,
  isReceivedEmails: boolean,
  newData: Email[]
) => {
  const objectToCache = {
    ...queryOptions,
    data: isReceivedEmails ? { getReceivedEmails: newData } : { getSentEmails: newData }
  };

  client.writeQuery(objectToCache);
};
