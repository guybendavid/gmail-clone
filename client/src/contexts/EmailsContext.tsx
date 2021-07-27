import { useEffect, createContext, ReactNode } from "react";
import { AppContext, AppContextType } from "./AppContext";
import { Store, useStore } from "store/store";
import { Email, Participant, User } from "interfaces/interfaces";
import { useLazyQuery, ApolloClient } from "@apollo/client";
import { GET_RECEIVED_EMAILS, GET_SENT_EMAILS } from "services/graphql";
import { useContext } from "react";

export type EmailsContextType = {
  apolloClient: ApolloClient<any> | undefined;
  emails: Email[];
};

interface Props {
  children: ReactNode;
}

const EmailsContext = createContext<EmailsContextType | undefined>(undefined);

const EmailsContextProvider = ({ children }: Props) => {
  const { handleErrors } = useContext(AppContext) as AppContextType;
  const loggedInUser = useStore((state: Store) => state.loggedInUser);
  const clearSnackBarMessage = useStore((state: Store) => state.clearSnackBarMessage);
  const activeTab = useStore((state: Store) => state.activeTab);
  const emailsToFullNames = useStore((state: Store) => state.emailsToFullNames);
  const setEmailToFullName = useStore((state: Store) => state.setEmailToFullName);
  const emailsToFetch = activeTab === 0 ? GET_RECEIVED_EMAILS : GET_SENT_EMAILS;

  const [getEmails, { data, client: apolloClient }] = useLazyQuery(emailsToFetch, {
    variables: { loggedInUserEmail: (loggedInUser as User)?.email },
    onError: (error) => handleErrors(error),
    onCompleted: () => clearSnackBarMessage()
  });

  const emails = data?.getReceivedEmails || data?.getSentEmails;

  useEffect(() => {
    if ((loggedInUser as User)?.id) {
      getEmails();
    }
    // eslint-disable-next-line
  }, [loggedInUser]);

  useEffect(() => {
    if (emails) {
      const isReceivedEmails = emailsToFetch === GET_RECEIVED_EMAILS;

      const isParticipantEmailInStore = (email: string) =>
        Boolean(emailsToFullNames.find(emailToFullName => emailToFullName.email === email));

      const setEmailToFullNameMapping = (participant: Participant) => {
        const { email, fullName } = participant;

        if (fullName && !isParticipantEmailInStore(email)) {
          setEmailToFullName({ email, fullName });
        }
      };

      emails.forEach((email: Email) => {
        const { sender, recipient } = email;

        isReceivedEmails ?
          setEmailToFullNameMapping(sender as Participant) :
          setEmailToFullNameMapping(recipient as Participant);
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

export { EmailsContext, EmailsContextProvider };