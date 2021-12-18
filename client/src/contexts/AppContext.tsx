import { createContext, ReactNode } from "react";
import { Store, useStore } from "store/store";
import { ApolloError } from "@apollo/client";
import { HistoryType } from "App";
import { useMediaQuery } from "@material-ui/core";
import { isAuthenticated } from "services/auth";

export type AppContextType = {
  isSmallScreen: boolean;
  logout: () => void;
  handleErrors: (error: ApolloError) => void;
};

interface Props {
  children: ReactNode;
  history?: HistoryType;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const AppContextProvider = ({ children, history }: Props) => {
  const setIsComposeOpened = useStore((state: Store) => state.setIsComposeOpened);
  const setSnackBarMessage = useStore((state: Store) => state.setSnackBarMessage);
  const isSmallScreen = useMediaQuery("(max-width:765px)");

  const logout = () => {
    setIsComposeOpened(false);
    localStorage.clear();
    history?.push("/login");
    window.location.reload();
  };

  const handleErrors = (error: any) => {
    const { message: gqlErrorMessage } = error;
    let content = null;

    const isAuthForm = ["/login", "register"].includes(window.location.pathname);
    const isGQLErrorExists = (gqlErrorMessage: string) => error.graphQLErrors?.[0]?.message?.includes(gqlErrorMessage);
    const isUserInputError = isGQLErrorExists("UserInputError");
    const isSequelizeValidationError = isGQLErrorExists("SequelizeValidationError");
    const gqlContextErrorMessage = error.networkError?.result?.errors[0]?.message?.split("Context creation failed: ")[1];

    if (gqlContextErrorMessage === "Unauthenticated" || (!isAuthenticated && !isAuthForm)) {
      logout();
      content = gqlContextErrorMessage || "Unauthenticated";
    } else if (gqlContextErrorMessage) {
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