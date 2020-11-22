import React, { useContext } from 'react';
import { AppContext } from '../../../../../contexts/AppContext';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import "./EmailsFooter.scss";
import { Button } from '@material-ui/core';

const texts = [
  "Inbox",
  "Sent"
];

const EmailsFooter = () => {
  const { activeTab, setActiveTab, setIsComposeOpened } = useContext(AppContext);

  const handleClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div className="emails-footer">
      <Button className="compose-button" onClick={() => setIsComposeOpened(true)}>Compose</Button>
      <AppBar position="static" className="tabs" elevation={0}>
        <Tabs variant="fullWidth" value={activeTab < 2 ? activeTab : 0} aria-label="simple tabs example">
          {texts.map((text, index) => (
            <Tab key={index} label={text} onClick={() => handleClick(index)} className={activeTab === index ? "active" : ""} />
          ))}
        </Tabs>
      </AppBar>
    </div>
  );
};

export default EmailsFooter;