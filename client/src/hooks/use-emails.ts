import { useAppStore, AppStore } from "stores/appStore";
import { useEmailsStore, EmailsStore } from "stores/emailsStore";
import { Email } from "interfaces/interfaces";
import { useQuery, ApolloClient } from "@apollo/client";
import { getAuthData } from "services/auth";
import { GET_RECEIVED_EMAILS, GET_SENT_EMAILS } from "services/graphql";

const useEmails = () => {
  const { loggedInUser } = getAuthData();
  const handleServerErrors = useAppStore((state: AppStore) => state.handleServerErrors);
  const clearSnackBarMessage = useAppStore((state: AppStore) => state.clearSnackBarMessage);
  const activeTab = useEmailsStore((state: EmailsStore) => state.activeTab);
  const emailsToFetch = activeTab === 0 ? GET_RECEIVED_EMAILS : GET_SENT_EMAILS;

  const { data, client: apolloClient } = useQuery(emailsToFetch, {
    variables: { loggedInUserEmail: loggedInUser.email },
    onError: (error) => handleServerErrors(error),
    onCompleted: () => clearSnackBarMessage()
  });

  const emails = data?.getReceivedEmails || data?.getSentEmails;

  return { emails, apolloClient } as { emails: Email[], apolloClient: ApolloClient<any>; };
};

export default useEmails;