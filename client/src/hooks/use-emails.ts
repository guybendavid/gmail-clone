import { useEffect } from "react";
import { useAppStore, AppStore } from "stores/appStore";
import { useEmailsStore, EmailsStore } from "stores/emailsStore";
import { Email } from "interfaces/interfaces";
import { useQuery, ApolloClient } from "@apollo/client";
import { getAuthData } from "services/auth";
import { GET_RECEIVED_EMAILS, GET_SENT_EMAILS } from "services/graphql";

const useEmails = () => {
  const { loggedInUser } = getAuthData();
  const handleErrors = useAppStore((state: AppStore) => state.handleErrors);
  const clearSnackBarMessage = useAppStore((state: AppStore) => state.clearSnackBarMessage);
  const activeTab = useEmailsStore((state: EmailsStore) => state.activeTab);
  const mapEmailToFullName = useEmailsStore((state: EmailsStore) => state.mapEmailToFullName);
  const emailsToFetch = activeTab === 0 ? GET_RECEIVED_EMAILS : GET_SENT_EMAILS;

  const { data, client: apolloClient } = useQuery(emailsToFetch, {
    variables: { loggedInUserEmail: loggedInUser?.email },
    onError: (error) => handleErrors(error),
    onCompleted: () => clearSnackBarMessage()
  });

  const emails = data?.getReceivedEmails || data?.getSentEmails;

  useEffect(() => {
    if (emails) {
      const isReceivedEmails = emailsToFetch === GET_RECEIVED_EMAILS;

      emails.forEach((email: Email) => {
        const { sender, recipient } = email as Required<Email>;

        isReceivedEmails ?
          mapEmailToFullName({ email: sender.email, fullName: sender.fullName }) :
          mapEmailToFullName({ email: recipient.email, fullName: recipient.fullName });
      });
    }
    // eslint-disable-next-line
  }, [emails]);

  return { emails, apolloClient } as { emails: Email[], apolloClient: ApolloClient<any>; };
};

export default useEmails;