import { Store, useStore } from "store/store";
import { Button, ListItem, ListItemText, Divider, Typography } from "@material-ui/core";
import { classNamesGenerator } from "@guybendavid/utils";
import InboxIcon from "@material-ui/icons/Inbox";
import SendIcon from "@material-ui/icons/Send";
import StarIcon from "@material-ui/icons/Star";
import WatchLaterIcon from "@material-ui/icons/WatchLater";
import LabelImportantIcon from "@material-ui/icons/LabelImportant";
import DraftsIcon from "@material-ui/icons/Drafts";
import MailIcon from '@material-ui/icons/Mail';
import DeleteIcon from '@material-ui/icons/Delete';
import LabelIcon from '@material-ui/icons/Label';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import VideocamIcon from '@material-ui/icons/Videocam';
import KeyboardIcon from '@material-ui/icons/Keyboard';
import composeImg from "images/compose-img.png";
import "./LeftSidebar.scss";

const firstListTexts = [
  "Inbox",
  "Sent",
  "Starred",
  "Snoozed",
  "Important",
  "Drafts",
  "All Mail",
  "Trash",
  "Categories",
  "More"
];

const secondListTexts = [
  "New meeting",
  "Join a meeting"
];

const LeftSidebar = () => {
  const setIsComposeOpened = useStore((state: Store) => state.setIsComposeOpened);
  const activeTab = useStore((state: Store) => state.activeTab);
  const setActiveTab = useStore((state: Store) => state.setActiveTab);

  return (
    <div className="left-sidebar">
      <div className="button-wrapper">
        <Button type="submit" fullWidth variant="contained" onClick={() => setIsComposeOpened(true)}>
          <img src={composeImg} alt="compose" />
          <Typography component="span">Compose</Typography>
        </Button>
      </div>
      <div className="list">
        <div className="list-items-wrapper first-list">
          {[InboxIcon, SendIcon, StarIcon, WatchLaterIcon, LabelImportantIcon, DraftsIcon, MailIcon, DeleteIcon, LabelIcon, ExpandMoreIcon].map((Icon, index) => (
            <ListItem key={index} button className={classNamesGenerator("list-item", activeTab === index && "active", index === 0 && "first")}
              onClick={() => index < 2 && setActiveTab(index)}>
              <Icon className="icon" />
              <ListItemText primary={firstListTexts[index]} />
            </ListItem>
          ))}
        </div>
        <Divider />
        <div className="list-items-wrapper second-list">
          <div className="meet-title">Meet</div>
          {[VideocamIcon, KeyboardIcon].map((Icon, index) => (
            <ListItem key={index} button className="list-item">
              <Icon className="icon" />
              <ListItemText primary={secondListTexts[index]} />
            </ListItem>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;