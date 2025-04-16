import { useEffect, Fragment } from "react";
import { useEmailsStore } from "stores/emailsStore";
import { css, cx } from "@emotion/css";
import { scrollbarStyle, overflowHandler } from "styles/reusable-css-in-js-styles";
import { getAuthData } from "services/auth";
import { useSubscription } from "@apollo/client";
import { NEW_EMAIL } from "services/graphql";
import { SectionEmail } from "types/types";
import { List, ListItem, Typography, Divider } from "@material-ui/core";
import { addNewEmailToCache } from "services/emails-helper";
import { timeDisplayer } from "@guybendavid/utils";
import useEmails from "hooks/use-emails";
import useIsSmallScreen from "hooks/use-is-small-screen";
import EmailCheckbox from "./EmailCheckbox/EmailCheckBox";

const EmailsList = () => {
  const { loggedInUser } = getAuthData();
  const { emails, apolloClient } = useEmails();
  const { isSmallScreen } = useIsSmallScreen();
  const { searchValue, selectedEmails } = useEmailsStore((state) => state);
  const { data: newEmailData } = useSubscription(NEW_EMAIL);
  const newEmail = newEmailData?.newEmail;

  useEffect(() => {
    if (newEmail) {
      addNewEmailToCache(newEmail, loggedInUser.email, apolloClient);
    }
    // eslint-disable-next-line
  }, [newEmail]);

  return (
    <List className={cx(style, isSmallScreen && "is-small-screen")}>
      {emails
        .filter((email: SectionEmail) => `${email.subject}`.toUpperCase().includes(searchValue.toUpperCase()))
        .map((email: SectionEmail, index: number) => (
          <Fragment key={index}>
            <ListItem button className={cx("email", isEmailSelected(email, selectedEmails) && "is-selected")}>
              <div className="text-wrapper">
                <div className="participant-name">
                  <EmailCheckbox email={email} />
                  <Typography component="span">{displayParticipantName(email)}</Typography>
                </div>
                <Typography component="span" className="email-body">{`${email.subject} - ${email.content}`}</Typography>
                <Typography component="small" className="created-at">
                  {timeDisplayer(email.createdAt)}
                </Typography>
              </div>
            </ListItem>
            <Divider />
          </Fragment>
        ))}
    </List>
  );
};

function isEmailSelected(email: SectionEmail, selectedEmails: SectionEmail[]) {
  return Boolean(selectedEmails.find((selectedEmail: SectionEmail) => selectedEmail.id === email.id));
}

function displayParticipantName(email: SectionEmail) {
  const { loggedInUser } = getAuthData();
  const participantName = "sender" in email ? email.sender.fullName : email.recipient.fullName;
  return participantName === `${loggedInUser.firstName} ${loggedInUser.lastName}` ? "Me" : participantName;
}

export default EmailsList;

const style = css`
  ${scrollbarStyle};
  overflow-y: auto;
  padding: 0 !important;

  &:not(.is-small-screen) {
    height: 70%;
  }

  hr {
    background-color: rgba(0, 0, 0, 0.05);
  }

  .email {
    padding: 10px 16px 10px 5px;

    @media only screen and (max-width: 765px) {
      padding: 10px 16px;
    }

    &:hover {
      box-shadow:
        0 8px 10px 1px rgba(17, 15, 15, 0.05),
        0 3px 14px 2px rgba(0, 0, 0, 0.05),
        0 5px 5px -3px rgba(0, 0, 0, 0.05);
    }

    &.is-selected {
      background: #c2dbff;
    }

    .text-wrapper {
      display: flex;
      align-items: baseline;
      width: 100%;

      .participant-name {
        margin-right: 15px;

        .MuiCheckbox-colorSecondary.Mui-checked {
          color: black;
        }

        .MuiIconButton-colorSecondary:hover,
        .MuiCheckbox-colorSecondary.Mui-checked:hover {
          background: rgba(0, 0, 0, 0.3);
        }
      }

      .created-at {
        margin-left: auto;
      }

      .participant-name,
      .email-body {
        ${overflowHandler()};
        width: 145px;

        &.email-body {
          @media only screen and (min-width: 560px) {
            width: 215px;
          }

          @media only screen and (min-width: 900px) {
            width: 365px;
          }

          @media only screen and (min-width: 1200px) {
            width: 665px;
          }

          @media only screen and (min-width: 1400px) {
            width: 815px;
          }

          @media only screen and (min-width: 1800px) {
            width: 1065px;
          }

          @media only screen and (min-width: 1920px) {
            width: 1300px;
          }
        }
      }
    }
  }
`;
