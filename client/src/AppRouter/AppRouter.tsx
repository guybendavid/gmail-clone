import { Container } from "@material-ui/core";
import { Switch, useLocation, withRouter } from "react-router-dom";
import { classNamesGenerator } from "@guybendavid/utils";
import Login from "components/AuthForms/Login";
import Register from "components/AuthForms/Register";
import AuthenticatedRoute from "./Routes/AuthenticatedRoute";
import UnAuthenticatedRoute from "./Routes/UnAuthenticatedRoute";
import DefaultRoute from "./Routes/DefaultRoute";
import Main from "components/Main/Main";
import IndicationMessage from "components/IndicationMessage/IndicationMessage";

const AppRouter = () => {
  const location = useLocation();
  const isAuthForm = location.pathname === "/login" || location.pathname === "/register";

  return (
    <Container className={classNamesGenerator("container", isAuthForm && "is-auth-form")}>
      <Switch>
        <AuthenticatedRoute exact path="/" Component={Main} />
        <UnAuthenticatedRoute exact path="/login" Component={Login} />
        <UnAuthenticatedRoute exact path="/register" Component={Register} />
        <DefaultRoute />
      </Switch>
      <IndicationMessage />
    </Container>
  );
};

export default withRouter(AppRouter);