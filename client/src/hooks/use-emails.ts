import { useQuery } from "@apollo/client";
import { getAuthData } from "#root/client/services/auth";
import { GET_RECEIVED_EMAILS, GET_SENT_EMAILS } from "#root/client/services/graphql";
import { useAppStore } from "#root/client/stores/app-store";
import { useEmailsStore } from "#root/client/stores/emails-store";
import type { ApolloClient } from "@apollo/client";
import type { SectionEmail } from "#root/client/types/types";

export const useEmails = () => {
  const { loggedInUser } = getAuthData();
  const { handleServerErrors, clearSnackBarMessage } = useAppStore((state) => state);
  const { activeTab } = useEmailsStore((state) => state);
  const emailsToFetch = activeTab === 0 ? GET_RECEIVED_EMAILS : GET_SENT_EMAILS;

  const { data, client: apolloClient } = useQuery(emailsToFetch, {
    variables: { loggedInUserEmail: loggedInUser.email },
    onError: handleServerErrors,
    onCompleted: clearSnackBarMessage
  });

  const emails = data?.getReceivedEmails || data?.getSentEmails || [];
  return { emails, apolloClient } as { emails: SectionEmail[]; apolloClient: ApolloClient<unknown> };
};
