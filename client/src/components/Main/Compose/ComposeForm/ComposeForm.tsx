import { useState, SyntheticEvent, ChangeEvent } from "react";
import { useAppStore, AppStore } from "stores/appStore";
import { useEmailsStore, EmailsStore } from "stores/emailsStore";
import { getAuthData } from "services/auth";
import { SEND_EMAIL } from "services/graphql";
import { useMutation, ApolloError } from "@apollo/client";
import { Button, TextField } from "@material-ui/core";
import { classNamesGenerator } from "@guybendavid/utils";
import "./ComposeForm.scss";

interface Props {
  isMinimized?: boolean;
}

const ComposeForm = ({ isMinimized }: Props) => {
  const { loggedInUser } = getAuthData();
  const handleErrors = useAppStore((state: AppStore) => state.handleErrors);
  const setSnackBarMessage = useAppStore((state: AppStore) => state.setSnackBarMessage);
  const setIsComposeOpen = useEmailsStore((state: EmailsStore) => state.setIsComposeOpen);
  const [sendEmail] = useMutation(SEND_EMAIL);

  const [mailValues, setMailValues] = useState({
    senderEmail: loggedInUser?.email,
    recipientEmail: "",
    subject: "",
    content: ""
  });

  const handleOnChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, field: keyof typeof mailValues) =>
    setMailValues({ ...mailValues, [field]: e.target.value });

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      await sendEmail({ variables: { ...mailValues } });
      setSnackBarMessage({ content: "Message sent successfully", severity: "info" });
      setIsComposeOpen(false);
    } catch (err) {
      handleErrors(err as ApolloError);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={classNamesGenerator(isMinimized && "is-minimized")}>
      <div className="fields-wrapper">
        <TextField required fullWidth label="To" onChange={(e) => handleOnChange(e, "recipientEmail")} />
        <TextField required fullWidth label="Subject" onChange={(e) => handleOnChange(e, "subject")} />
      </div>
      <div className="content-wrapper">
        <textarea required onChange={(e) => handleOnChange(e, "content")} />
      </div>
      <Button type="submit" className="desktop-send-button">Send</Button>
    </form>
  );
};

export default ComposeForm;