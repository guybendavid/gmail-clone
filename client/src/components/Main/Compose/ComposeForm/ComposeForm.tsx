import { useState, SyntheticEvent, ChangeEvent } from "react";
import { useAppStore } from "stores/appStore";
import { useEmailsStore } from "stores/emailsStore";
import { css, cx } from "@emotion/css";
import { getAuthData } from "services/auth";
import { SEND_EMAIL } from "services/graphql";
import { useMutation } from "@apollo/client";
import { Button, TextField } from "@material-ui/core";
import { getFormValidationErrors } from "@guybendavid/utils";
import { scrollbarStyle, blueButtonStyle, primaryBoxShadowStyle } from "styles/reusable-css-in-js-styles";

type Props = {
  isMinimized?: boolean;
};

const ComposeForm = ({ isMinimized }: Props) => {
  const { loggedInUser } = getAuthData();
  const { handleServerErrors, setSnackBarMessage } = useAppStore((state) => state);
  const { setIsComposeOpen } = useEmailsStore((state) => state);

  const [sendEmail] = useMutation(SEND_EMAIL, {
    onCompleted: () => {
      setSnackBarMessage({ content: "Email sent successfully", severity: "info" });
      setIsComposeOpen(false);
    },
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
  };

  return (
    <form onSubmit={handleSubmit} className={cx(style, isMinimized && "is-minimized")}>
      <div className="fields-wrapper">
        <TextField required fullWidth label="To" onChange={(e) => handleOnChange(e, "recipientEmail")} />
        <TextField required fullWidth label="Subject" onChange={(e) => handleOnChange(e, "subject")} />
      </div>
      <div className="content-wrapper">
        <textarea required onChange={(e) => handleOnChange(e, "content")} />
      </div>
      <Button type="submit" className="send-button">
        Send
      </Button>
    </form>
  );
};

export default ComposeForm;

const style = css`
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  flex: 1;

  &.is-minimized {
    display: none;
  }

  .fields-wrapper {
    .MuiInputLabel-shrink {
      display: none !important;
    }

    .MuiFormLabel-asterisk {
      display: none;
    }

    .MuiInput-underline:before,
    .MuiInput-underline:after {
      border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
    }
  }

  .content-wrapper {
    display: flex;
    flex-direction: column;
    flex: 1;

    textarea {
      ${scrollbarStyle};
      flex: 1;
      margin-top: 10px;
      width: 100%;
      height: 100%;
      outline: none;
      border: none;
      resize: none;
    }
  }

  .send-button {
    ${blueButtonStyle};
    margin-bottom: 10px;

    &:hover {
      ${primaryBoxShadowStyle};
      filter: brightness(1.03);
    }
  }
`;
