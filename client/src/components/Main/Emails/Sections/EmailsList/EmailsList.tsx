import { useContext, useEffect, Fragment } from "react";
import { EmailsContext, EmailsContextType } from "contexts/EmailsContext";
import { useEmailsStore, EmailsStore } from "stores/emailsStore";
import { getAuthData } from "services/auth";
import { ApolloClient, useSubscription } from "@apollo/client";
import { NEW_EMAIL } from "services/graphql";
import { Email, Participant } from "interfaces/interfaces";
import { List, ListItem, Typography, Divider } from "@material-ui/core";
import { addNewEmailToCache } from "services/emails-helper";
import { classNamesGenerator, timeDisplayer } from "@guybendavid/utils";
import EmailCheckbox from "./EmailCheckbox/EmailCheckBox";
import "./EmailsList.scss";

const EmailsList = () => {
  const { loggedInUser } = getAuthData();
  const { apolloClient, emails } = useContext(EmailsContext) as EmailsContextType;
  const searchValue = useEmailsStore((state: EmailsStore) => state.searchValue);
  const selectedEmails = useEmailsStore((state: EmailsStore) => state.selectedEmails);
  const activeTab = useEmailsStore((state: EmailsStore) => state.activeTab);
  const emailsToFullNames = useEmailsStore((state: EmailsStore) => state.emailsToFullNames);
  const { data: newEmailData } = useSubscription(NEW_EMAIL);
  const newEmail = newEmailData?.newEmail;

  useEffect(() => {
    if (newEmail) {
      addNewEmailToCache(newEmail, loggedInUser?.email, (apolloClient as ApolloClient<any>));
    }
    // eslint-disable-next-line
  }, [newEmail]);

  return (
    <List className="emails-list">
      {emails?.filter((email: Email) =>
        `${email.subject}`.toUpperCase().includes(searchValue.toUpperCase())).map((email: Email, index: number) => (
          <Fragment key={index}>
            <ListItem button className={classNamesGenerator("email", isEmailSelected(email, selectedEmails) && "is-selected")}>
              <div className="text-wrapper">
                <div className="participant-name">
                  <EmailCheckbox email={email} />
                  <Typography component="span">{displayParticipantName(email, emailsToFullNames, activeTab)}</Typography>
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
  return selectedEmails.find((selectedEmail: Email) => selectedEmail.id === email.id);
};

function displayParticipantName({ sender, recipient }: Email, emailsToFullNames: Participant[], activeTab: number) {
  function getTextToDisplay(participantName: string) {
    const { loggedInUser } = getAuthData();
    return participantName === `${loggedInUser?.firstName} ${loggedInUser?.lastName}` ? "Me" : participantName;
  }

  function getFullNameByStoredEmail(email: string) {
    return emailsToFullNames.find(emailToFullName => emailToFullName.email === email)?.fullName;
  }

  return activeTab === 0 ?
    getTextToDisplay((sender as Participant).fullName || getFullNameByStoredEmail((sender as Participant).email) as string) :
    getTextToDisplay((recipient as Participant).fullName || getFullNameByStoredEmail((recipient as Participant).email) as string);
};

export default EmailsList;