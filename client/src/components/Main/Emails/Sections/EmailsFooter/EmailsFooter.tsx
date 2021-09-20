import { Store, useStore } from 'store/store';
import { Button } from '@material-ui/core';
import { classNamesGenerator } from '@guybendavid/utils';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import "./EmailsFooter.scss";

const texts = [
  "Inbox",
  "Sent"
];

const EmailsFooter = () => {
  const setIsComposeOpened = useStore((state: Store) => state.setIsComposeOpened);
  const activeTab = useStore((state: Store) => state.activeTab);
  const setActiveTab = useStore((state: Store) => state.setActiveTab);

  const handleClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div className="emails-footer">
      <Button className="compose-button" onClick={() => setIsComposeOpened(true)}>Compose</Button>
      <AppBar position="static" className="tabs" elevation={0}>
        <Tabs variant="fullWidth" value={activeTab} aria-label="simple tabs example">
          {texts.map((text, index) => (
            <Tab key={index} label={text} onClick={() => handleClick(index)} className={classNamesGenerator(activeTab === index && "active")} />
          ))}
        </Tabs>
      </AppBar>
    </div>
  );
};

export default EmailsFooter;