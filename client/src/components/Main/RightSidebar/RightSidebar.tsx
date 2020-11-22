import React from "react";
import { IconButton, Divider } from "@material-ui/core";
import TodayIcon from '@material-ui/icons/Today';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import AddIcon from '@material-ui/icons/Add';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import "./RightSidebar.scss";

const RightSidebar = () => {
  return (
    <div className="right-sidebar">
      <div className="top-section">
        <div className="top-icons-wrapper">
          {[TodayIcon, EmojiObjectsIcon, FiberManualRecordIcon].map((Icon, index) => (
            <IconButton key={index}>
              <Icon />
            </IconButton>
          ))}
        </div>
        <div className="divider-wrapper">
          <Divider />
        </div>
        <IconButton>
          <AddIcon />
        </IconButton>
      </div>
      <div className="bottom-section">
        <IconButton>
          <KeyboardArrowRightIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default RightSidebar;