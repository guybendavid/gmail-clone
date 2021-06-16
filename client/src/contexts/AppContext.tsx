import { FC, useEffect, createContext, ReactNode } from "react";
import { Store, useStore } from "store/store";
import { Email, User } from "interfaces/interfaces";
import { History, LocationState } from "history";
import { ApolloClient, ApolloError, useLazyQuery } from "@apollo/client";
import { GET_RECEIVED_EMAILS, GET_SENT_EMAILS } from "services/graphql";
import { useMediaQuery } from "@material-ui/core";

export type AppContextType = {
  apolloClient: ApolloClient<any> | undefined;
  emails: Email[];
  isSmallScreen: boolean;
  logout: () => void;
  handleErrors: (error: ApolloError) => void;
};

type HistoryType = History<LocationState>;

interface Props {
  children: ReactNode;
  history: HistoryType | {};
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const AppContextProvider: FC<Props> = ({ children, history }) => {
  const loggedInUser = useStore((state: Store) => state.loggedInUser);
  const setLoggedInUser = useStore((state: Store) => state.setLoggedInUser);
  const setSnackBarMessage = useStore((state: Store) => state.setSnackBarMessage);
  const clearSnackBarMessage = useStore((state: Store) => state.clearSnackBarMessage);
  const activeTab = useStore((state: Store) => state.activeTab);
  const isSmallScreen = useMediaQuery("(max-width:765px)");
  const emailsToFetch = activeTab === 0 ? GET_RECEIVED_EMAILS : GET_SENT_EMAILS;

  const [getEmails, { data, client: apolloClient }] = useLazyQuery(emailsToFetch, {
    fetchPolicy: "cache-and-network",
    variables: { loggedInUserEmail: (loggedInUser as User)?.email },
    onError: (error) => handleErrors(error),
    onCompleted: () => clearSnackBarMessage()
  });

  const emails = data?.getReceivedEmails || data?.getSentEmails;

  useEffect(() => {
    const user = localStorage.loggedInUser && JSON.parse(localStorage.loggedInUser);
    setLoggedInUser(user);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if ((loggedInUser as User)?.id) {
      getEmails();
    }
    // eslint-disable-next-line
  }, [loggedInUser]);

  const logout = () => {
    localStorage.clear();
    (history as HistoryType).push("/login");
  };

  const handleErrors = (error: ApolloError) => {
    const { message: errorMessage } = error;
    const severity = "error";
    let content = null;

    const isGraphQLErrorsIncludesError = (errorMessage: string) => {
      return error.graphQLErrors && error.graphQLErrors[0]?.message?.includes(errorMessage);
    };

    const isUserInputError = isGraphQLErrorsIncludesError("UserInputError");
    const isSequelizeValidationError = isGraphQLErrorsIncludesError("SequelizeValidationError");

    if (errorMessage === "Unauthenticated") {
      logout();
    } else if (isUserInputError || isSequelizeValidationError) {
      content = error.graphQLErrors[0].message.split(": ")[isUserInputError ? 1 : 2];
    } else {
      content = errorMessage;
    };

    if (content) {
      setSnackBarMessage({ content, severity });
    }
  };

  return (
    <AppContext.Provider value={{ apolloClient, emails, isSmallScreen, logout, handleErrors }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppContextProvider };