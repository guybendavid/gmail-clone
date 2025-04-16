import { useState, useCallback } from "react";
import { useEmailsStore } from "stores/emailsStore";
import { Typography } from "@material-ui/core";
import { css, cx } from "@emotion/css";
import { primaryBoxShadowStyle } from "styles/reusable-css-in-js-styles";
import { Minimize as MinimizeIcon, Maximize as MaximizeIcon, Height as HeightIcon, Close as CloseIcon } from "@material-ui/icons";
import ComposeForm from "../ComposeForm/ComposeForm";

const ComposeModal = () => {
  const { setIsComposeOpen } = useEmailsStore((state) => state);
  const [isMinimized, setIsMinimized] = useState(false);

  const headerIconsGenerator = useCallback(() => {
    return [MinimizeIcon, HeightIcon, CloseIcon].map((_Icon, index) => {
      if (index === 0 && !isMinimized) {
        return <MinimizeIcon key={index} onClick={() => setIsMinimized(true)} />;
      } else if (index === 0 && isMinimized) {
        return <MaximizeIcon key={index} onClick={() => setIsMinimized(false)} />;
      } else if (index === 2) {
        return <CloseIcon key={index} onClick={() => setIsComposeOpen(false)} />;
      } else {
        return <HeightIcon key={index} onClick={(e) => e.stopPropagation()} />;
      }
    });
    // eslint-disable-next-line
  }, [isMinimized]);

  return (
    <div className={cx(style, isMinimized && "is-minimized")}>
      <div className="header" onClick={() => setIsMinimized(!isMinimized)}>
        <Typography component="span">New Message</Typography>
        <div className="icons-wrapper">{headerIconsGenerator()}</div>
      </div>
      <ComposeForm isMinimized={isMinimized} />
    </div>
  );
};

export default ComposeModal;

const style = css`
  ${primaryBoxShadowStyle};
  z-index: 9999;
  position: absolute;
  bottom: 0;
  right: 63px;
  width: 40vw;
  max-width: 550px;
  max-height: 600px;
  background: white;
  display: flex;
  flex-direction: column;

  &.is-minimized {
    width: 20vw;
    min-width: 210px;
  }

  &:not(.is-minimized) {
    width: 40vw;
    height: 70vh;
  }

  .header {
    background: #404040;
    border-radius: 8px 8px 0 0;
    padding: 7px 10px 7px 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;

    span {
      color: white;
    }

    .icons-wrapper {
      display: flex;
      gap: 5px;

      svg {
        font-size: 1.1rem;
        color: lightgray;
        padding: 2px 1px;

        &:nth-child(2) {
          transform: rotate(20deg);
        }

        &:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      }
    }
  }
`;
