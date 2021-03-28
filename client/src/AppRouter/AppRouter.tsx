import { Container } from "@material-ui/core";
import { Switch, useLocation, withRouter } from "react-router-dom";
import Login from "components/Forms/Login";
import Register from "components/Forms/Register";
import AuthenticatedRoute from "./Routes/AuthenticatedRoute";
import UnauthenticatedRoute from "./Routes/UnauthenticatedRoute";
import DefaultRoute from "./Routes/DefaultRoute";
import Main from "components/Main/Main";
import IndicationMessage from "components/ErrorMessage/IndicationMessage";

const AppRouter = () => {
  const location = useLocation();
  const isAuthForm = location.pathname === "/login" || location.pathname === "/register";

  return (
    <Container className={"container" + (isAuthForm ? " is-auth-form" : "")}>
      <Switch>
        <AuthenticatedRoute exact path="/" Component={Main} />
        <UnauthenticatedRoute exact path="/login" Component={Login} />
        <UnauthenticatedRoute exact path="/register" Component={Register} />
        <DefaultRoute />
      </Switch>
      <IndicationMessage />
    </Container>
  );
};

export default withRouter(AppRouter);