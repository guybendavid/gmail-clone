import { useState, useContext, SyntheticEvent } from "react";
import { AppContext, AppContextType } from "contexts/AppContext";
import { Store, useStore } from "store/store";
import { getLoggedInUser } from "services/auth";
import { SEND_EMAIL } from "services/graphql";
import { useMutation, ApolloError } from "@apollo/client";
import { Button, TextField } from "@material-ui/core";
import { classNamesGenerator } from "@guybendavid/utils";
import "./ComposeForm.scss";

interface Props {
  isMinimized?: boolean;
}

const ComposeForm = ({ isMinimized }: Props) => {
  const loggedInUser = getLoggedInUser();
  const { handleErrors } = useContext(AppContext) as AppContextType;
  const setSnackBarMessage = useStore((state: Store) => state.setSnackBarMessage);
  const setIsComposeOpened = useStore((state: Store) => state.setIsComposeOpened);
  const [sendEmail] = useMutation(SEND_EMAIL);

  const [mailValues, setMailValues] = useState({
    senderEmail: loggedInUser.email,
    recipientEmail: "",
    subject: "",
    content: ""
  });

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      await sendEmail({ variables: { ...mailValues } });
      setSnackBarMessage({ content: "Message sent successfully", severity: "info" });
      setIsComposeOpened(false);
    } catch (err) {
      handleErrors(err as ApolloError);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={classNamesGenerator(isMinimized && "is-minimized")}>
      <div className="fields-wrapper">
        <TextField required fullWidth label="To" onChange={(e) => setMailValues({ ...mailValues, recipientEmail: e.target.value })} />
        <TextField required fullWidth label="Subject" onChange={(e) => setMailValues({ ...mailValues, subject: e.target.value })} />
      </div>
      <div className="content-wrapper">
        <textarea required onChange={(e) => setMailValues({ ...mailValues, content: e.target.value })} />
      </div>
      <Button type="submit" className="desktop-send-button">Send</Button>
    </form>
  );
};

export default ComposeForm;