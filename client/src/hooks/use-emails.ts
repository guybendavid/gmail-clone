import { useEmailsStore } from "stores/emails-store";
import { useApolloClient, useQuery, useSubscription } from "@apollo/client";
import { getAuthData } from "services/auth";
import { GET_RECEIVED_EMAILS, GET_SENT_EMAILS, NEW_EMAIL } from "services/graphql";
import type { Email } from "types/types";

export const useEmails = () => {
  const { loggedInUser } = getAuthData();
  const { activeTab } = useEmailsStore((state) => state);
  const emailsToFetch = activeTab === 0 ? GET_RECEIVED_EMAILS : GET_SENT_EMAILS;
  const apolloClient = useApolloClient();

  const { data, error, loading } = useQuery(emailsToFetch, {
    variables: { loggedInUserEmail: loggedInUser.email }
  });

  useSubscription(NEW_EMAIL, {
    onData: ({ data: subscriptionData }) => {
      const newEmail = subscriptionData.data?.newEmail;

      if (!newEmail) return;

      const isRecipient = newEmail.recipient.email === loggedInUser.email;
      const isSender = newEmail.sender.email === loggedInUser.email;

      if (isRecipient) {
        apolloClient.cache.updateQuery(
          { query: GET_RECEIVED_EMAILS, variables: { loggedInUserEmail: loggedInUser.email } },
          (existingData) => {
            const existingEmails: Email[] = existingData?.getReceivedEmails || [];

            if (existingEmails.some((email: Email) => email.id === newEmail.id)) {
              return existingData;
            }

            return { getReceivedEmails: [newEmail, ...existingEmails] };
          }
        );
      }

      if (isSender) {
        apolloClient.cache.updateQuery(
          { query: GET_SENT_EMAILS, variables: { loggedInUserEmail: loggedInUser.email } },
          (existingData) => {
            const existingEmails: Email[] = existingData?.getSentEmails || [];

            if (existingEmails.some((email: Email) => email.id === newEmail.id)) {
              return existingData;
            }

            return { getSentEmails: [newEmail, ...existingEmails] };
          }
        );
      }
    }
  });

  const emails = data?.getReceivedEmails || data?.getSentEmails || [];
  return { emails, error, loading, apolloClient };
};
