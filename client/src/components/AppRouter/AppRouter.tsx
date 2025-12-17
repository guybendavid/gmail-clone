import { Container } from "@material-ui/core";
import { Switch, withRouter } from "react-router-dom";
import { css, cx } from "@emotion/css";
import { getAuthData } from "services/auth";
import { Login } from "components/AuthForms/Login";
import { Register } from "components/AuthForms/Register";
import { AuthenticatedRoute } from "./Routes/AuthenticatedRoute";
import { UnauthenticatedRoute } from "./Routes/UnauthenticatedRoute";
import { DefaultRoute } from "./Routes/DefaultRoute";
import { Main } from "components/Main/Main";
import { IndicationMessage } from "components/IndicationMessage/IndicationMessage";

const AppRouterComponent = () => {
  const { isAuthenticated } = getAuthData();

  return (
    <Container className={cx(baseContainerStyle, isAuthenticated ? authenticatedStyle : authFormStyle)} maxWidth="sm">
      <Switch>
        <AuthenticatedRoute exact={true} path="/" Component={Main} />
        <UnauthenticatedRoute exact={true} path="/login" Component={Login} />
        <UnauthenticatedRoute exact={true} path="/register" Component={Register} />
        <DefaultRoute />
      </Switch>
      <IndicationMessage />
    </Container>
  );
};

export const AppRouter = withRouter(AppRouterComponent);

const baseContainerStyle = css`
  padding: 0 !important;
`;

const authenticatedStyle = css`
  max-width: unset !important;
`;

const authFormStyle = css`
  margin-top: 160px;

  &::before {
    content: "";
    background: var(--primary-gradient-color);
    position: absolute;
    top: 0;
    left: 0;
    height: 124px;
    width: 100vw;
    z-index: -1;
  }

  @media only screen and (max-width: 765px) {
    margin-top: 100px;
    max-width: 350px;

    &::before {
      height: 60px;
    }
  }
`;
