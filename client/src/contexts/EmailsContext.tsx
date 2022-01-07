import { useEffect, createContext, ReactNode } from "react";
import { useAppStore, AppStore } from "stores/appStore";
import { useEmailsStore, EmailsStore } from "stores/emailsStore";
import { Email, Participant } from "interfaces/interfaces";
import { useQuery, ApolloClient } from "@apollo/client";
import { getAuthData } from "services/auth";
import { GET_RECEIVED_EMAILS, GET_SENT_EMAILS } from "services/graphql";

type EmailsContextType = {
  apolloClient: ApolloClient<any> | undefined;
  emails: Email[];
};

interface Props {
  children: ReactNode;
}

interface MapEmailToFullNameData {
  participant: Participant;
  emailsToFullNames: Participant[];
  setEmailToFullName: (emailFullNameMap: Participant) => void;
}

const EmailsContext = createContext<EmailsContextType | undefined>(undefined);

const EmailsContextProvider = ({ children }: Props) => {
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

  return (
    <EmailsContext.Provider value={{ apolloClient, emails }}>
      {children}
    </EmailsContext.Provider>
  );
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

export { EmailsContext, EmailsContextProvider };
export type { EmailsContextType };