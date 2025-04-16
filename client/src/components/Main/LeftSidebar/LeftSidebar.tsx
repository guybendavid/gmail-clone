import { useEmailsStore } from "stores/emailsStore";
import { Button, ListItem, ListItemText, Divider, Typography } from "@material-ui/core";
import { css, cx } from "@emotion/css";
import { overflowHandler, scrollbarStyle } from "styles/reusable-css-in-js-styles";
import {
  Inbox as InboxIcon,
  Send as SendIcon,
  Star as StarIcon,
  WatchLater as WatchLaterIcon,
  LabelImportant as LabelImportantIcon,
  Drafts as DraftsIcon,
  Mail as MailIcon,
  Delete as DeleteIcon,
  Label as LabelIcon,
  ExpandMore as ExpandMoreIcon,
  Videocam as VideocamIcon,
  Keyboard as KeyboardIcon
} from "@material-ui/icons";
import composeImg from "images/compose-img.png";

const firstListTexts = ["Inbox", "Sent", "Starred", "Snoozed", "Important", "Drafts", "All Mail", "Trash", "Categories", "More"];

const secondListTexts = ["New meeting", "Join a meeting"];

const LeftSidebar = () => {
  const { setIsComposeOpen, activeTab, setActiveTab } = useEmailsStore((state) => state);

  return (
    <div className={style}>
      <div className="button-wrapper">
        <Button type="submit" fullWidth variant="contained" onClick={() => setIsComposeOpen(true)}>
          <img src={composeImg} alt="compose" />
          <Typography component="span">Compose</Typography>
        </Button>
      </div>
      <div className="list">
        <div className="list-items-wrapper first-list">
          {[
            InboxIcon,
            SendIcon,
            StarIcon,
            WatchLaterIcon,
            LabelImportantIcon,
            DraftsIcon,
            MailIcon,
            DeleteIcon,
            LabelIcon,
            ExpandMoreIcon
          ].map((Icon, index) => (
            <ListItem
              key={index}
              button
              className={cx("list-item", activeTab === index && "is-active", index === 0 && "is-first-item")}
              onClick={() => index < 2 && setActiveTab(index)}>
              <Icon className="icon" />
              <ListItemText primary={firstListTexts[index]} />
            </ListItem>
          ))}
        </div>
        <Divider />
        <div className="list-items-wrapper second-list">
          <div className="header">Meet</div>
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

const style = css`
  flex: 0.18;

  .button-wrapper {
    padding: 16px 10px;
    background: white;

    button {
      background: white;
      width: fit-content;
      border-radius: 24px;
      padding-right: 30px;
      height: 48px;

      img {
        margin-right: 15px;
      }

      span {
        color: var(--text-color);
        font-weight: bold;
        font-size: 0.8rem;
      }
    }
  }

  .list {
    display: flex;
    flex-direction: column;
    padding-top: 0;
    background: white;
    height: 100%;

    .list-items-wrapper {
      padding: 0 8px;

      &.first-list {
        ${scrollbarStyle};
        flex: 0.4;
        max-height: 385px;
        overflow-y: auto;

        @media only screen and (min-width: 765px) {
          padding: 0 16px 0 8px;
          flex: 0.32;
        }

        &::-webkit-scrollbar {
          width: 10px;
        }
      }

      &.second-list {
        flex: 0.58;

        .header {
          margin: 10px 19px;
          font-weight: 500;
        }
      }

      .list-item {
        color: var(--text-color);
        border-radius: 0 16px 16px 0;
        padding: 0 19px;

        &.is-active {
          span {
            font-weight: bold;
          }

          &.is-first-item {
            background: #fce8e6;
            color: var(--red-color);
          }

          &:not(.is-first-item) {
            background: #e8eaed;
          }
        }

        .icon {
          margin-right: 18px;
        }

        span {
          ${overflowHandler("180px")};
        }
      }
    }

    hr {
      margin: 5px 0;
    }
  }
`;
