import React, { useEffect, createContext, useState, Context } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_EMAILS } from "../services/graphql";
import { useMediaQuery } from "@material-ui/core";

interface Props {
  children: React.ReactNode;
}

const AppContext: Context<any> = createContext(undefined);

const AppContextProvider: React.FC<Props> = ({ children }) => {
  const [getEmails, { data, refetch: refetchEmails }] = useLazyQuery(GET_EMAILS, {
    onError: (error) => handleErrors(error),
    onCompleted: () => clearError()
  });

  const emails = data?.getEmails;
  const [loggedInUser, setLoggedInUser] = useState<any>({});
  const [searchValue, setSearchValue] = useState("");
  const [activeTab, setActive] = useState(0);
  const [selectedEmails, setSelectedEmails] = useState<any>([]);
  const [isComposeOpened, setIsComposeOpened] = useState(false);
  const [error, setError] = useState("");
  const isSmallScreen = useMediaQuery("(max-width:765px)");

  useEffect(() => {
    if (loggedInUser?.id) {
      getEmails();
    }
    // eslint-disable-next-line
  }, [loggedInUser]);

  const setActiveTab = (active: number) => {
    setActive(active);
    setSelectedEmails([]);

    if (active < 2 && refetchEmails) {
      refetchEmails();
    }
  };

  const handleErrors = (error: any, history?: any) => {
    const isGraphQLErrorsIncludesError = (errorMessage: string) => {
      return error.graphQLErrors && error.graphQLErrors[0]?.message?.includes(errorMessage);
    };

    if (error.message === "Unauthenticated") {
      localStorage.clear();
      history?.push("/login");
    } else if (isGraphQLErrorsIncludesError("UserInputError")) {
      setError(error.graphQLErrors[0].message.split(": ")[1]);
    } else if (isGraphQLErrorsIncludesError("SequelizeValidationError")) {
      setError(error.graphQLErrors[0].message.split(": ")[2]);
    } else {
      setError(error.message);
    }
  };

  const clearError = () => {
    setError("");
  };

  useEffect(() => {
    const user = localStorage.loggedInUser && JSON.parse(localStorage.loggedInUser);
    setLoggedInUser(user);
  }, []);

  return (
    <AppContext.Provider value={{
      loggedInUser, emails, isSmallScreen, error, searchValue, activeTab, isComposeOpened, selectedEmails,
      setSelectedEmails, refetchEmails, setIsComposeOpened, setActiveTab, setSearchValue, handleErrors, clearError
    }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppContextProvider };
