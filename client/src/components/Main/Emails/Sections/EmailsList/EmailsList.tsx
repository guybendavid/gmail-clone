import { useEffect, Fragment } from "react";
import { useEmailsStore, EmailsStore } from "stores/emailsStore";
import { getAuthData } from "services/auth";
import { useSubscription } from "@apollo/client";
import { NEW_EMAIL } from "services/graphql";
import { Email } from "interfaces/interfaces";
import { List, ListItem, Typography, Divider } from "@material-ui/core";
import { addNewEmailToCache } from "services/emails-helper";
import { classNamesGenerator, timeDisplayer } from "@guybendavid/utils";
import useEmails from "hooks/use-emails";
import useIsSmallScreen from "hooks/use-is-small-screen";
import EmailCheckbox from "./EmailCheckbox/EmailCheckBox";
import "./EmailsList.scss";

const EmailsList = () => {
  const { loggedInUser } = getAuthData();
  const { emails, apolloClient } = useEmails();
  const { isSmallScreen } = useIsSmallScreen();
  const searchValue = useEmailsStore((state: EmailsStore) => state.searchValue);
  const selectedEmails = useEmailsStore((state: EmailsStore) => state.selectedEmails);
  const activeTab = useEmailsStore((state: EmailsStore) => state.activeTab);
  const { data: newEmailData } = useSubscription(NEW_EMAIL);
  const newEmail = newEmailData?.newEmail;

  useEffect(() => {
    if (newEmail) {
      addNewEmailToCache(newEmail, loggedInUser?.email, apolloClient);
    }
    // eslint-disable-next-line
  }, [newEmail]);

  return (
    <List className={classNamesGenerator("emails-list", isSmallScreen && "is-small-screen")}>
      {emails?.filter((email: Email) =>
        `${email.subject}`.toUpperCase().includes(searchValue.toUpperCase())).map((email: Email, index: number) => (
          <Fragment key={index}>
            <ListItem button className={classNamesGenerator("email", isEmailSelected(email, selectedEmails) && "is-selected")}>
              <div className="text-wrapper">
                <div className="participant-name">
                  <EmailCheckbox email={email} />
                  <Typography component="span">{displayParticipantName(email as Required<Email>, activeTab)}</Typography>
                </div>
                <Typography component="span" className="email-body">{`${email.subject} - ${email.content}`}</Typography>
                <Typography component="small" className="created-at">{timeDisplayer(email.createdAt)}</Typography>
              </div>
            </ListItem>
            <Divider />
          </Fragment>
        ))}
    </List>
  );
};

function isEmailSelected(email: Email, selectedEmails: Email[]) {
  return Boolean(selectedEmails.find((selectedEmail: Email) => selectedEmail.id === email.id));
};

function displayParticipantName({ sender, recipient }: Required<Email>, activeTab: number) {
  const { loggedInUser } = getAuthData();
  const participantName = activeTab === 0 ? sender.fullName : recipient.fullName;
  return participantName === `${loggedInUser?.firstName} ${loggedInUser?.lastName}` ? "Me" : participantName;
};

export default EmailsList;