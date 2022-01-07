import { createContext, ReactNode } from "react";
import { Store, useStore } from "store/store";
import { ApolloError } from "@apollo/client";
import { useMediaQuery } from "@material-ui/core";
import { getAuthData } from "services/auth";

export type AppContextType = {
  isSmallScreen: boolean;
  logout: () => void;
  handleErrors: (error: ApolloError) => void;
};

interface Props {
  children: ReactNode;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const AppContextProvider = ({ children }: Props) => {
  const { isAuthenticated } = getAuthData();
  const setIsComposeOpened = useStore((state: Store) => state.setIsComposeOpened);
  const setSnackBarMessage = useStore((state: Store) => state.setSnackBarMessage);
  const isSmallScreen = useMediaQuery("(max-width:765px)");

  const logout = () => {
    setIsComposeOpened(false);
    localStorage.clear();
    window.location.reload();
  };

  const handleErrors = (error: any) => {
    const { message: gqlErrorMessage } = error;
    let content = null;

    const isAuthForm = ["/login", "/register"].includes(window.location.pathname);
    const gqlContextErrorMessage = error.networkError?.result?.errors[0]?.message?.split("Context creation failed: ")[1];

    if (gqlContextErrorMessage === "Unauthenticated" || (!isAuthenticated && !isAuthForm)) {
      logout();
      content = gqlContextErrorMessage || "Unauthenticated";
    } else if (gqlContextErrorMessage) {
      content = gqlContextErrorMessage;
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