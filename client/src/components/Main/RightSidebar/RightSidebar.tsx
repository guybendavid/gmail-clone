import { IconButton, Divider } from "@material-ui/core";
import { css } from "@emotion/css";
import TodayIcon from "@material-ui/icons/Today";
import EmojiObjectsIcon from "@material-ui/icons/EmojiObjects";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import AddIcon from "@material-ui/icons/Add";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";

const RightSidebar = () => {
  return (
    <div className={style}>
      <div className="top-section">
        <div className="top-icons-wrapper">
          {[TodayIcon, EmojiObjectsIcon, FiberManualRecordIcon].map((Icon, index) => (
            <IconButton key={index}>
              <Icon />
            </IconButton>
          ))}
        </div>
        <Divider className="divider" />
        <IconButton>
          <AddIcon />
        </IconButton>
      </div>
      <IconButton>
        <KeyboardArrowRightIcon />
      </IconButton>
    </div>
  );
};

export default RightSidebar;

const style = css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 5px 0 80px;

  .top-section {
    display: flex;
    flex-direction: column;
    align-items: center;

    .top-icons-wrapper {
      display: flex;
      flex-direction: column;

      button {
        &:nth-child(odd) {
          color: rgb(52, 143, 200);
        }

        &:nth-child(2) {
          color: #fbbc04;
        }
      }
    }

    .divider {
      margin: 15px 0;
      width: 50%;
    }
  }
`;