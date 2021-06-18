import { useState, SyntheticEvent, useContext } from "react";
import { History, LocationState } from "history";
import { AppContext, AppContextType } from "contexts/AppContext";
import { REGISTER_USER } from "services/graphql";
import { useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import { handleAuth } from "services/auth";
import { Avatar, Button, TextField, Typography } from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import "./Forms.scss";

interface Props {
  history: History<LocationState>;
}

const Register = ({ history }: Props) => {
  const { handleErrors } = useContext(AppContext) as AppContextType;
  const [formValues, setFormValues] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const { firstName, lastName, email, password } = formValues;

  const [register] = useMutation(REGISTER_USER, {
    onCompleted: (data) => handleAuth({ ...data.register, email }, history),
    onError: (error) => handleErrors(error)
  });

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
        <TextField required variant="outlined" margin="normal" fullWidth label="first name" autoComplete="First Name" value={firstName} onChange={(e) => setFormValues({ ...formValues, firstName: e.target.value })} />
        <TextField required variant="outlined" margin="normal" fullWidth label="last name" autoComplete="Last Name" value={lastName} onChange={(e) => setFormValues({ ...formValues, lastName: e.target.value })} />
        <TextField required variant="outlined" margin="normal" fullWidth label="email" autoComplete="Email" value={email} onChange={(e) => setFormValues({ ...formValues, email: e.target.value })} />
        <TextField required variant="outlined" margin="normal" fullWidth label="password" autoComplete="Password" value={password} type="password" onChange={(e) => setFormValues({ ...formValues, password: e.target.value })} />
        <Link to="/login">Already have an account?</Link>
        <Button type="submit" fullWidth variant="contained">Register</Button>
      </form>
    </div>
  );
};

export default Register;