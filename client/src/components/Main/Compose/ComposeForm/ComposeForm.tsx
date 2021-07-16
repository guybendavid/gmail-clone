import { useState, useContext, SyntheticEvent } from "react";
import { AppContext, AppContextType } from "contexts/AppContext";
import { Store, useStore } from "store/store";
import { SEND_EMAIL } from "services/graphql";
import { useMutation } from "@apollo/client";
import { Button, TextField } from "@material-ui/core";
import { User } from "interfaces/interfaces";
import "./ComposeForm.scss";

const ComposeForm = () => {
  const { handleErrors, isParticipantEmailInStore } = useContext(AppContext) as AppContextType;
  const loggedInUser = useStore((state: Store) => state.loggedInUser as User);
  const setSnackBarMessage = useStore((state: Store) => state.setSnackBarMessage);
  const setIsComposeOpened = useStore((state: Store) => state.setIsComposeOpened);
  const [sendEmail] = useMutation(SEND_EMAIL);

  const [mailValues, setMailValues] = useState({
    senderEmail: loggedInUser.email,
    recipientEmail: "",
    subject: "",
    content: "",
    isSenderNameInClient: isParticipantEmailInStore(loggedInUser.email),
    isRecipientNameInClient: false
  });

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      await sendEmail({ variables: { ...mailValues } });
      setSnackBarMessage({ content: "Message sent successfully", severity: "info" });
      setIsComposeOpened(false);
    } catch (err) {
      handleErrors(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="fields-wrapper">
        <TextField required fullWidth label="To" onChange={(e) => setMailValues({ ...mailValues, recipientEmail: e.target.value, isRecipientNameInClient: isParticipantEmailInStore(e.target.value) })} />
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