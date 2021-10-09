import { FC } from "react";
import { Route, Redirect } from "react-router";
import { EmailsContextProvider } from "contexts/EmailsContext";
import Navbar from "components/Navbar/Navbar";

interface Props {
  exact: boolean;
  path: string;
  isAdminRoute?: boolean;
  Component: FC;
}

const AuthenticatedRoute = ({ path, Component }: Props) => {
  return (
    <Route path={path} render={() => localStorage.token ?
      <EmailsContextProvider>
        <Navbar />
        <Component />
      </EmailsContextProvider>
      :
      <Redirect to="/login" />} />
  );
};

export default AuthenticatedRoute;