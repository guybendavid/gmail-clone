import React from "react";
import { AppBar, Tab, Tabs, ListItem } from "@material-ui/core";
import InboxIcon from '@material-ui/icons/Inbox';
import PeopleIcon from '@material-ui/icons/People';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import "./TabsRow.scss";

const texts = ["Primary", "Social", "Promotions"];

const TabsRow = () => {
  return (
    <AppBar className="tabs-row" position="static" elevation={0}>
      <Tabs value={0} onChange={() => null} aria-label="simple tabs example">
        {[InboxIcon, PeopleIcon, LocalOfferIcon].map((Icon, index) => (
          <Tab key={index} label={
            <ListItem button>
              <Icon fontSize="small" />
              {texts[index]}
            </ListItem>
          } />
        ))}
      </Tabs>
    </AppBar>
  );
};

export default TabsRow;