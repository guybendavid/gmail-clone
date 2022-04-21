import { useState, SyntheticEvent, ChangeEvent } from "react";
import { useAppStore, AppStore } from "stores/appStore";
import { useEmailsStore, EmailsStore } from "stores/emailsStore";
import { getAuthData } from "services/auth";
import { SEND_EMAIL } from "services/graphql";
import { useMutation } from "@apollo/client";
import { Button, TextField } from "@material-ui/core";
import { classNamesGenerator, getFormValidationErrors } from "@guybendavid/utils";
import "./ComposeForm.scss";

interface Props {
  isMinimized?: boolean;
}

const ComposeForm = ({ isMinimized }: Props) => {
  const { loggedInUser } = getAuthData();
  const handleServerErrors = useAppStore((state: AppStore) => state.handleServerErrors);
  const setSnackBarMessage = useAppStore((state: AppStore) => state.setSnackBarMessage);
  const setIsComposeOpen = useEmailsStore((state: EmailsStore) => state.setIsComposeOpen);

  const [sendEmail] = useMutation(SEND_EMAIL, {
    onError: (err) => handleServerErrors(err)
  });

  const [mailValues, setMailValues] = useState({
    senderEmail: loggedInUser.email,
    recipientEmail: "",
    subject: "",
    content: ""
  });

  const handleOnChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, field: keyof typeof mailValues) =>
    setMailValues({ ...mailValues, [field]: e.target.value });

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const { message: errorMessage } = getFormValidationErrors(mailValues);

    if (errorMessage) {
      setSnackBarMessage({ content: errorMessage, severity: "error" });
      return;
    }

    await sendEmail({ variables: mailValues });
    setSnackBarMessage({ content: "Email sent successfully", severity: "info" });
    setIsComposeOpen(false);
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