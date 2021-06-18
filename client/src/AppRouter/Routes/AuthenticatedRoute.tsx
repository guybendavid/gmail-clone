import { ComponentType } from "react";
import { Route, Redirect } from "react-router";
import Navbar from "components/Navbar/Navbar";

interface Props {
  exact: boolean;
  path: string;
  isAdminRoute?: boolean;
  Component: ComponentType<any>;
}

const AuthenticatedRoute = ({ path, Component }: Props) => {
  const loggedInUser = localStorage.loggedInUser && JSON.parse(localStorage.loggedInUser);

  return (
    <Route path={path} render={() => loggedInUser ?
      <>
        <Navbar />
        <Component />
      </>
      :
      <Redirect to="/login" />} />
  );
};

export default AuthenticatedRoute;