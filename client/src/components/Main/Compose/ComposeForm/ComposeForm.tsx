import { useMutation } from "@apollo/client";
import { css, cx } from "@emotion/css";
import { getFormValidationErrors } from "@guybendavid/utils";
import { Button, TextField } from "@material-ui/core";
import { useState } from "react";
import { getAuthData } from "#root/client/services/auth";
import { SEND_EMAIL } from "#root/client/services/graphql";
import { useAppStore } from "#root/client/stores/app-store";
import { useEmailsStore } from "#root/client/stores/emails-store";
import { scrollbarStyle, blueButtonStyle, primaryBoxShadowStyle } from "#root/client/styles/reusable-css-in-js-styles";
import type { SyntheticEvent, ChangeEvent } from "react";

type Props = {
  isMinimized?: boolean;
};

export const ComposeForm = ({ isMinimized }: Props) => {
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
    <form onSubmit={handleSubmit} className={cx(composeFormStyle, isMinimized && "is-minimized")}>
      <div className="fields-wrapper">
        <TextField required={true} fullWidth={true} label="To" onChange={(e) => handleOnChange(e, "recipientEmail")} />
        <TextField required={true} fullWidth={true} label="Subject" onChange={(e) => handleOnChange(e, "subject")} />
      </div>
      <div className="content-wrapper">
        <textarea required={true} aria-label="Email content" onChange={(e) => handleOnChange(e, "content")} />
      </div>
      <Button type="submit" className="send-button">
        Send
      </Button>
    </form>
  );
};

const composeFormStyle = css`
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
