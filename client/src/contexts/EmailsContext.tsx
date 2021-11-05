import { useEffect, createContext, ReactNode } from "react";
import { AppContext, AppContextType } from "./AppContext";
import { Store, useStore } from "store/store";
import { User, Email, Participant } from "interfaces/interfaces";
import { useQuery, ApolloClient } from "@apollo/client";
import { getLoggedInUser } from "services/auth";
import { GET_RECEIVED_EMAILS, GET_SENT_EMAILS } from "services/graphql";
import { useContext } from "react";

export type EmailsContextType = {
  apolloClient: ApolloClient<any> | undefined;
  emails: Email[];
};

interface Props {
  children: ReactNode;
}

interface SetEmailToFullNameMappingData {
  participant: Participant;
  emailsToFullNames: Participant[];
  setEmailToFullName: (emailFullNameMap: Participant) => void;
}

const EmailsContext = createContext<EmailsContextType | undefined>(undefined);

const EmailsContextProvider = ({ children }: Props) => {
  const loggedInUser = getLoggedInUser();
  const { handleErrors } = useContext(AppContext) as AppContextType;
  const clearSnackBarMessage = useStore((state: Store) => state.clearSnackBarMessage);
  const activeTab = useStore((state: Store) => state.activeTab);
  const emailsToFullNames = useStore((state: Store) => state.emailsToFullNames);
  const setEmailToFullName = useStore((state: Store) => state.setEmailToFullName);
  const emailsToFetch = activeTab === 0 ? GET_RECEIVED_EMAILS : GET_SENT_EMAILS;

  const { data, client: apolloClient } = useQuery(emailsToFetch, {
    variables: { loggedInUserEmail: (loggedInUser as User)?.email },
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
          setEmailToFullNameMapping({ participant: sender as Participant, ...sharedProps }) :
          setEmailToFullNameMapping({ participant: recipient as Participant, ...sharedProps });
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

function setEmailToFullNameMapping({ participant, emailsToFullNames, setEmailToFullName }: SetEmailToFullNameMappingData) {
  const { email, fullName } = participant;

  if (fullName && !isParticipantEmailInStore(email, emailsToFullNames)) {
    setEmailToFullName({ email, fullName });
  }
};

export { EmailsContext, EmailsContextProvider };