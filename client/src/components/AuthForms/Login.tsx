import { useMutation } from "@apollo/client";
import { getFormValidationErrors } from "@guybendavid/utils";
import { Avatar, Button, TextField, Typography } from "@material-ui/core";
import { LockOutlined as LockOutlinedIcon } from "@material-ui/icons";
import { useState } from "react";
import { Link } from "react-router-dom";
import { authFormStyle } from "#root/client/components/AuthForms/shared-styles";
import { handleAuth } from "#root/client/services/auth";
import { LOGIN_USER } from "#root/client/services/graphql";
import { useAppStore } from "#root/client/stores/app-store";
import type { TextFieldProps } from "@material-ui/core/TextField";
import type { SyntheticEvent, ChangeEvent } from "react";

const textFieldProps = {
  required: true,
  variant: "outlined",
  margin: "normal",
  fullWidth: true
} as TextFieldProps;

export const Login = () => {
  const { handleServerErrors, setSnackBarMessage } = useAppStore((state) => state);
  const [formValues, setFormValues] = useState({ email: "", password: "" });
  const { email } = formValues;

  const [login] = useMutation(LOGIN_USER, {
    onCompleted: ({ login: data }) => handleAuth({ user: { ...data.user, email }, token: data.token }),
    onError: (error) => handleServerErrors(error)
  });

  const handleOnChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, field: keyof typeof formValues) =>
    setFormValues({ ...formValues, [field]: e.target.value });

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const { message: errorMessage } = getFormValidationErrors(formValues);

    if (errorMessage) {
      setSnackBarMessage({ content: errorMessage, severity: "error" });
      return;
    }

    await login({ variables: formValues });
  };

  return (
    <div className={authFormStyle}>
      <Avatar>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1">Login</Typography>
      <form onSubmit={handleSubmit}>
        <TextField {...textFieldProps} label="email" autoComplete="Email" onChange={(e) => handleOnChange(e, "email")} />
        <TextField
          {...textFieldProps}
          label="password"
          autoComplete="Password"
          type="password"
          onChange={(e) => handleOnChange(e, "password")}
        />
        <Link to="/register">Don't have an account yet?</Link>
        <Button type="submit" fullWidth={true} variant="contained">
          Login
        </Button>
      </form>
    </div>
  );
};
