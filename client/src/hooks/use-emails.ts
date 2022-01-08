import { useEffect } from "react";
import { useAppStore, AppStore } from "stores/appStore";
import { useEmailsStore, EmailsStore } from "stores/emailsStore";
import { Email, Participant } from "interfaces/interfaces";
import { useQuery, ApolloClient } from "@apollo/client";
import { getAuthData } from "services/auth";
import { GET_RECEIVED_EMAILS, GET_SENT_EMAILS } from "services/graphql";

interface MapEmailToFullNameData {
  participant: Participant;
  emailsToFullNames: Participant[];
  setEmailToFullName: (emailFullNameMap: Participant) => void;
}

const useEmails = () => {
  const { loggedInUser } = getAuthData();
  const handleErrors = useAppStore((state: AppStore) => state.handleErrors);
  const clearSnackBarMessage = useAppStore((state: AppStore) => state.clearSnackBarMessage);
  const activeTab = useEmailsStore((state: EmailsStore) => state.activeTab);
  const emailsToFullNames = useEmailsStore((state: EmailsStore) => state.emailsToFullNames);
  const setEmailToFullName = useEmailsStore((state: EmailsStore) => state.setEmailToFullName);
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
      const sharedProps = { emailsToFullNames, setEmailToFullName };

      emails.forEach((email: Email) => {
        const { sender, recipient } = email;

        isReceivedEmails ?
          mapEmailToFullName({ participant: sender as Participant, ...sharedProps }) :
          mapEmailToFullName({ participant: recipient as Participant, ...sharedProps });
      });
    }
    // eslint-disable-next-line
  }, [emails]);

  return { emails, apolloClient } as { emails: Email[], apolloClient: ApolloClient<any>; };
};

function isParticipantEmailInStore(email: string, emailsToFullNames: Participant[]) {
  return Boolean(emailsToFullNames.find(emailToFullName => emailToFullName.email === email));
}

function mapEmailToFullName({ participant, emailsToFullNames, setEmailToFullName }: MapEmailToFullNameData) {
  const { email, fullName } = participant;

  if (fullName && !isParticipantEmailInStore(email, emailsToFullNames)) {
    setEmailToFullName({ email, fullName });
  }
};

export default useEmails;