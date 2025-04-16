import { useAppStore } from "stores/appStore";
import { useEmailsStore } from "stores/emailsStore";
import { SectionEmail } from "types/types";
import { useQuery, ApolloClient } from "@apollo/client";
import { getAuthData } from "services/auth";
import { GET_RECEIVED_EMAILS, GET_SENT_EMAILS } from "services/graphql";

const useEmails = () => {
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
  return { emails, apolloClient } as { emails: SectionEmail[]; apolloClient: ApolloClient<any> };
};

export default useEmails;
