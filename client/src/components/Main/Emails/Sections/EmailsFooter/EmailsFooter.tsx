import { useEmailsStore, EmailsStore } from 'stores/emailsStore';
import { classNamesGenerator } from '@guybendavid/utils';
import { Button } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import "./EmailsFooter.scss";

const texts = [
  "Inbox",
  "Sent"
];

const EmailsFooter = () => {
  const setIsComposeOpen = useEmailsStore((state: EmailsStore) => state.setIsComposeOpen);
  const activeTab = useEmailsStore((state: EmailsStore) => state.activeTab);
  const setActiveTab = useEmailsStore((state: EmailsStore) => state.setActiveTab);

  return (
    <div className="emails-footer">
      <Button className="compose-button" onClick={() => setIsComposeOpen(true)}>Compose</Button>
      <AppBar position="static" className="tabs" elevation={0}>
        <Tabs variant="fullWidth" value={activeTab} aria-label="simple tabs example">
          {texts.map((text, index) => (
            <Tab key={index} label={text} onClick={() => setActiveTab(index)}
              className={classNamesGenerator(activeTab === index && "active")} />
          ))}
        </Tabs>
      </AppBar>
    </div>
  );
};

export default EmailsFooter;