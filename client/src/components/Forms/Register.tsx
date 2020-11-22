import React, { useState, SyntheticEvent, useContext } from "react";
import { AppContext } from "../../contexts/AppContext";
import { REGISTER_USER } from "../../services/graphql";
import { useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import { handleAuth } from "../../services/auth";
import { Avatar, Button, TextField, Typography } from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import "./Forms.scss";

interface Props {
  history: any;
}

const Register: React.FC<Props> = ({ history }) => {
  const { handleErrors } = useContext(AppContext);
  const [register] = useMutation(REGISTER_USER);
  const [formValues, setFormValues] = useState({ firstName: "", lastName: "", email: "", password: "" });

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const { firstName, lastName, email, password } = formValues;

    if (firstName && lastName && email && password) {
      try {
        const user = await register({ variables: { firstName, lastName, email, password } });

        if (user.data?.register) {
          user.data.register.email = email;
        }

        handleAuth(user.data?.register, history);
      } catch (err) {
        handleErrors(err);
      }
    }
  };

  return (
    <div className="register-container">
      <Avatar>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1">Register</Typography>
      <form onSubmit={handleSubmit}>
        <TextField required variant="outlined" margin="normal" fullWidth label="first name" autoComplete="First Name" value={formValues.firstName} onChange={(e) => setFormValues({ ...formValues, firstName: e.target.value })} />
        <TextField required variant="outlined" margin="normal" fullWidth label="last name" autoComplete="Last Name" value={formValues.lastName} onChange={(e) => setFormValues({ ...formValues, lastName: e.target.value })} />
        <TextField required variant="outlined" margin="normal" fullWidth label="email" autoComplete="Email" value={formValues.email} onChange={(e) => setFormValues({ ...formValues, email: e.target.value })} />
        <TextField required variant="outlined" margin="normal" fullWidth label="password" autoComplete="Password" value={formValues.password} type="password" onChange={(e) => setFormValues({ ...formValues, password: e.target.value })} />
        <Link to="/login">Already have an account?</Link>
        <Button type="submit" fullWidth variant="contained">Register</Button>
      </form>
    </div>
  );
};

export default Register;