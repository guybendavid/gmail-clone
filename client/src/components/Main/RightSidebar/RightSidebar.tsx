import { IconButton, Divider } from "@material-ui/core";
import { css } from "@emotion/css";
import {
  Today as TodayIcon,
  EmojiObjects as EmojiObjectsIcon,
  FiberManualRecord as FiberManualRecordIcon,
  Add as AddIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon
} from "@material-ui/icons";

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
        <Divider />
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
        &:nth-child(2) {
          color: #fbbc04;
        }

        &:not(:nth-child(2)) {
          color: rgb(52, 143, 200);
        }
      }
    }

    hr {
      margin: 15px 0;
      width: 50%;
    }
  }
`;
