import { FC } from "react";
import { Route, Redirect } from "react-router";
import { EmailsContextProvider } from "contexts/EmailsContext";
import { getAuthData } from "services/auth";
import Navbar from "components/Navbar/Navbar";

interface Props {
  exact: boolean;
  path: string;
  isAdminRoute?: boolean;
  Component: FC;
}

const AuthenticatedRoute = ({ path, Component }: Props) => {
  const { isAuthenticated } = getAuthData();

  return (
    <Route path={path} render={() => isAuthenticated ?
      <EmailsContextProvider>
        <Navbar />
        <Component />
      </EmailsContextProvider>
      :
      <Redirect to="/login" />} />
  );
};

export default AuthenticatedRoute;