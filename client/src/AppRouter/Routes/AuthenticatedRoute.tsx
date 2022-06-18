import { FC } from "react";
import { Route, Redirect } from "react-router";
import { getAuthData } from "services/auth";
import Navbar from "components/Navbar/Navbar";

type Props = {
  exact: boolean;
  path: string;
  isAdminRoute?: boolean;
  Component: FC;
};

const AuthenticatedRoute = ({ path, Component }: Props) => {
  const { isAuthenticated } = getAuthData();

  return (
    <Route path={path} render={() => isAuthenticated ?
      <>
        <Navbar />
        <Component />
      </>
      :
      <Redirect to="/login" />} />
  );
};

export default AuthenticatedRoute;