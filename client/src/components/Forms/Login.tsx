import React, { useState, SyntheticEvent, useContext } from "react";
import { AppContext } from "../../contexts/AppContext";
import { LOGIN_USER } from "../../services/graphql";
import { Link } from "react-router-dom";
import { handleAuth } from "../../services/auth";
import { Avatar, Button, TextField, Typography } from "@material-ui/core";
import { useMutation } from "@apollo/client";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import "./Forms.scss";

interface Props {
  history: any;
}

const Login: React.FC<Props> = ({ history }) => {
  const { handleErrors } = useContext(AppContext);
  const [login] = useMutation(LOGIN_USER);
  const [formValues, setFormValues] = useState({ email: "", password: "" });

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const { email, password } = formValues;

    if (email && password) {
      try {
        const user = await login({ variables: { email, password } });
        const userData = { ...user.data?.login, email };
        handleAuth(userData, history);
      } catch (err) {
        handleErrors(err);
      }
    }
  };

  return (
    <div className="login-container">
      <Avatar>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1">Login</Typography>
      <form onSubmit={handleSubmit}>
        <TextField required variant="outlined" margin="normal" fullWidth label="email" autoComplete="Email" value={formValues.email} onChange={(e) => setFormValues({ ...formValues, email: e.target.value })} />
        <TextField required variant="outlined" margin="normal" fullWidth label="password" autoComplete="Password" value={formValues.password} type="password" onChange={(e) => setFormValues({ ...formValues, password: e.target.value })} />
        <Link to="/register">Don't have an account yet?</Link>
        <Button type="submit" fullWidth variant="contained">Login</Button>
      </form>
    </div>
  );
};

export default Login;