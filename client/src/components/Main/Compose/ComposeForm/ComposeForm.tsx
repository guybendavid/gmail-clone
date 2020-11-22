import React, { useState, useContext, SyntheticEvent } from "react";
import { AppContext } from "../../../../contexts/AppContext";
import { SEND_EMAIL } from "../../../../services/graphql";
import { useMutation } from "@apollo/client";
import { Button, TextField } from "@material-ui/core";
import "./ComposeForm.scss";

const ComposeForm = () => {
  const { setIsComposeOpened, refetchEmails, handleErrors } = useContext(AppContext);
  const [sendEmail] = useMutation(SEND_EMAIL);

  const [mailValues, setMailValues] = useState({
    recipientId: "",
    subject: "",
    content: ""
  });

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const { recipientId, subject, content } = mailValues;
    const recipientIdIsNumber = !isNaN(Number(recipientId));

    if (recipientId && recipientIdIsNumber && subject && content) {
      try {
        await sendEmail({ variables: { recipientId, subject, content } });
        refetchEmails();
        setIsComposeOpened(false);
      } catch (err) {
        handleErrors(err);
      }
    } else if (!recipientIdIsNumber) {
      handleErrors({ message: "Please fill out a correct recipientId" });
    } else {
      handleErrors({ message: "Please fill out form correctly" });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="fields-wrapper">
        <TextField fullWidth label="To" value={mailValues.recipientId} onChange={(e) => setMailValues({ ...mailValues, recipientId: e.target.value })} />
        <TextField fullWidth label="Subject" value={mailValues.subject} onChange={(e) => setMailValues({ ...mailValues, subject: e.target.value })} />
      </div>
      <div className="content-wrapper">
        <textarea value={mailValues.content} onChange={(e) => setMailValues({ ...mailValues, content: e.target.value })} />
      </div>
      <Button type="submit" className="desktop-send-button">Send</Button>
    </form>
  );
};

export default ComposeForm;