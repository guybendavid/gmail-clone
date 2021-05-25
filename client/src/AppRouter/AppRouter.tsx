import { FC, useEffect } from "react";
import { Container } from "@material-ui/core";
import { Switch, useHistory, useLocation, withRouter } from "react-router-dom";
import Login from "components/Forms/Login";
import Register from "components/Forms/Register";
import AuthenticatedRoute from "./Routes/AuthenticatedRoute";
import UnauthenticatedRoute from "./Routes/UnauthenticatedRoute";
import DefaultRoute from "./Routes/DefaultRoute";
import Main from "components/Main/Main";
import IndicationMessage from "components/IndicationMessage/IndicationMessage";

const AppRouter: FC<any> = ({ setHistory }) => {
  const history = useHistory();
  const location = useLocation();
  const isAuthForm = location.pathname === "/login" || location.pathname === "/register";

  useEffect(() => {
    setHistory(history);
    // eslint-disable-next-line
  }, []);

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