import { useState, SyntheticEvent, ChangeEvent } from "react";
import { REGISTER_USER } from "services/graphql";
import { useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import { handleAuth } from "services/auth";
import { Avatar, Button, TextField, Typography, OutlinedTextFieldProps } from "@material-ui/core";
import { useStore, Store } from "store/store";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import "./AuthForms.scss";

const textFieldProps = { required: true, variant: "outlined", margin: "normal", fullWidth: true } as OutlinedTextFieldProps;

const Register = () => {
  const handleErrors = useStore((state: Store) => state.handleErrors);
  const [formValues, setFormValues] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const { email } = formValues;

  const [register] = useMutation(REGISTER_USER, {
    onCompleted: (data) => handleAuth({ ...data.register, email }),
    onError: (error) => handleErrors(error)
  });

  const handleOnChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, field: keyof typeof formValues) =>
    setFormValues({ ...formValues, [field]: e.target.value });

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    register({ variables: { ...formValues } });
  };

  return (
    <div className="register-container">
      <Avatar>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1">Register</Typography>
      <form onSubmit={handleSubmit}>
        <TextField {...textFieldProps} label="first name" autoComplete="First Name" onChange={(e) => handleOnChange(e, "firstName")} />
        <TextField {...textFieldProps} label="last name" autoComplete="Last Name" onChange={(e) => handleOnChange(e, "lastName")} />
        <TextField {...textFieldProps} label="email" autoComplete="Email" onChange={(e) => handleOnChange(e, "email")} />
        <TextField {...textFieldProps} label="password" autoComplete="Password" type="password" onChange={(e) => handleOnChange(e, "password")} />
        <Link to="/login">Already have an account?</Link>
        <Button type="submit" fullWidth variant="contained">Register</Button>
      </form>
    </div>
  );
};

export default Register;