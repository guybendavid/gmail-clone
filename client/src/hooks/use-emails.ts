import { useAppStore } from "stores/app-store";
import { useEmailsStore } from "stores/emails-store";
import type { SectionEmail } from "types/types";
import type { ApolloClient } from "@apollo/client";
import { useQuery } from "@apollo/client";
import { getAuthData } from "services/auth";
import { GET_RECEIVED_EMAILS, GET_SENT_EMAILS } from "services/graphql";

export const useEmails = () => {
  const { loggedInUser } = getAuthData();
  const { handleServerErrors, clearSnackBarMessage } = useAppStore((state) => state);
  const { activeTab } = useEmailsStore((state) => state);
  const emailsToFetch = activeTab === 0 ? GET_RECEIVED_EMAILS : GET_SENT_EMAILS;

  const { data, client: apolloClient } = useQuery(emailsToFetch, {
    variables: { loggedInUserEmail: loggedInUser.email },
    onError: (error) => handleServerErrors(error),
    onCompleted: () => clearSnackBarMessage()
  });

  const emails = data?.getReceivedEmails || data?.getSentEmails || [];
  return { emails, apolloClient } as { emails: SectionEmail[]; apolloClient: ApolloClient<unknown> };
};
