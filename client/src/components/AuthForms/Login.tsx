import { useState, SyntheticEvent, useContext, ChangeEvent } from "react";
import { AppContext, AppContextType } from "contexts/AppContext";
import { LOGIN_USER } from "services/graphql";
import { Link } from "react-router-dom";
import { handleAuth } from "services/auth";
import { Avatar, Button, TextField, Typography, OutlinedTextFieldProps } from "@material-ui/core";
import { useMutation } from "@apollo/client";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import "./AuthForms.scss";

const textFieldProps = { required: true, variant: "outlined", margin: "normal", fullWidth: true } as OutlinedTextFieldProps;

const Login = () => {
  const { handleErrors } = useContext(AppContext) as AppContextType;
  const [formValues, setFormValues] = useState({ email: "", password: "" });
  const { email } = formValues;

  const [login] = useMutation(LOGIN_USER, {
    onCompleted: (data) => handleAuth({ ...data.login, email }),
    onError: (error) => handleErrors(error)
  });

  const handleOnChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, field: keyof typeof formValues) =>
    setFormValues({ ...formValues, [field]: e.target.value });

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    login({ variables: { ...formValues } });
  };

  return (
    <div className="login-container">
      <Avatar>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1">Login</Typography>
      <form onSubmit={handleSubmit}>
        <TextField {...textFieldProps} label="email" autoComplete="Email" onChange={(e) => handleOnChange(e, "email")} />
        <TextField {...textFieldProps} label="password" autoComplete="Password" type="password" onChange={(e) => handleOnChange(e, "password")} />
        <Link to="/register">Don't have an account yet?</Link>
        <Button type="submit" fullWidth variant="contained">Login</Button>
      </form>
    </div>
  );
};

export default Login;