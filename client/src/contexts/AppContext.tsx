import { useEffect, createContext, ReactNode } from "react";
import { Store, useStore } from "store/store";
import { History, LocationState } from "history";
import { ApolloError } from "@apollo/client";
import { useMediaQuery } from "@material-ui/core";

export type AppContextType = {
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

const AppContextProvider = ({ children, history }: Props) => {
  const setIsComposeOpened = useStore((state: Store) => state.setIsComposeOpened);
  const setLoggedInUser = useStore((state: Store) => state.setLoggedInUser);
  const setSnackBarMessage = useStore((state: Store) => state.setSnackBarMessage);
  const isSmallScreen = useMediaQuery("(max-width:765px)");

  useEffect(() => {
    const user = localStorage.loggedInUser && JSON.parse(localStorage.loggedInUser);
    setLoggedInUser(user);
    // eslint-disable-next-line
  }, []);

  const logout = () => {
    setIsComposeOpened(false);
    localStorage.clear();
    (history as HistoryType).push("/login");
  };

  const handleErrors = (error: any) => {
    const { message: gqlErrorMessage } = error;
    let content = null;

    const isGraphQLErrorsIncludesError = (gqlErrorMessage: string) => error.graphQLErrors?.[0]?.message?.includes(gqlErrorMessage);
    const isUserInputError = isGraphQLErrorsIncludesError("UserInputError");
    const isSequelizeValidationError = isGraphQLErrorsIncludesError("SequelizeValidationError");
    const gqlContextErrorMessage = error.networkError?.result?.errors[0]?.message?.split("Context creation failed: ")[1];

    if (gqlContextErrorMessage) {
      if (gqlContextErrorMessage === "Unauthenticated") {
        logout();
      }

      content = gqlContextErrorMessage;
    } else if (isUserInputError || isSequelizeValidationError) {
      content = error.graphQLErrors[0].message.split(": ")[isUserInputError ? 1 : 2];
    } else {
      content = gqlErrorMessage;
    };

    if (content) {
      setSnackBarMessage({ content, severity: "error" });
    }
  };

  return (
    <AppContext.Provider value={{ isSmallScreen, logout, handleErrors }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppContextProvider };