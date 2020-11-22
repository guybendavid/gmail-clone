import React, { useContext, useEffect } from "react";
import { AppContext } from "../../../../../contexts/AppContext";
import { Email } from "../../../../../interfaces/interfaces";
import { List, ListItem, Typography, Divider } from "@material-ui/core";
import EmailCheckbox from "./EmailCheckbox/EmailCheckBox";
import timeDisplayer from "../../../../../services/timeDisplayer";
import "./EmailsList.scss";

interface Props {
  displayedEmails: Email[];
  setDisplayedEmails: (emails: Email[]) => void;
}

const EmailsList: React.FC<Props> = ({ displayedEmails, setDisplayedEmails }) => {
  const { loggedInUser, searchValue, emails, activeTab, selectedEmails } = useContext(AppContext);
  const isSentEmailsTab = activeTab === 1;
  const isEmailSelected = (email: Email) => selectedEmails.find((selectedEmail: Email) => selectedEmail.id === email.id);

  useEffect(() => {
    if (emails && loggedInUser && activeTab < 2) {
      if (isSentEmailsTab) {
        setDisplayedEmails(emails?.filter((email: Email) => email.senderId === loggedInUser.id));
      } else {
        setDisplayedEmails(emails?.filter((email: Email) => email.recipientId === loggedInUser.id));
      }
    }
    // eslint-disable-next-line
  }, [emails, loggedInUser, activeTab, isSentEmailsTab]);

  return (
    <List className="emails-list">
      {displayedEmails?.filter((email: Email) =>
        `${email.subject}`.toUpperCase().includes(searchValue.toUpperCase())).map((email: Email, index: number) => (
          <React.Fragment key={index}>
            <ListItem button className={"email" + (isEmailSelected(email) ? " is-selected" : "")}>
              <div className="text-wrapper">
                <div className="left-side">
                  <EmailCheckbox email={email} />
                  <Typography component="span" className="participants">
                    {email.senderId === loggedInUser.id ? `recipientId: ${email.recipientId}` : `senderId: ${email.senderId}`}
                  </Typography>
                </div>
                <Typography component="span" className="email-body">{`${email.subject} - ${email.content}`}</Typography>
                <Typography component="small" className="created-at">{timeDisplayer(email.createdAt)}</Typography>
              </div>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
    </List>
  );
};

export default EmailsList;