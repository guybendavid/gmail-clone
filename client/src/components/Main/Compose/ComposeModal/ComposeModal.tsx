import { css, cx } from "@emotion/css";
import { Typography } from "@material-ui/core";
import { Close as CloseIcon, Height as HeightIcon, Maximize as MaximizeIcon, Minimize as MinimizeIcon } from "@material-ui/icons";
import { useCallback, useState } from "react";
import { ComposeForm } from "#root/client/components/Main/Compose/ComposeForm/ComposeForm";
import { useEmailsStore } from "#root/client/stores/emails-store";
import { primaryBoxShadowStyle } from "#root/client/styles/reusable-css-in-js-styles";

export const ComposeModal = () => {
  const { setIsComposeOpen } = useEmailsStore((state) => state);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      setIsMinimized(!isMinimized);
    }
  };

  const headerIconsGenerator = useCallback(
    () =>
      [MinimizeIcon, HeightIcon, CloseIcon].map((_Icon, index) => {
        if (index === 0 && !isMinimized) {
          return <MinimizeIcon key={index} onClick={() => setIsMinimized(true)} />;
        }

        if (index === 0 && isMinimized) {
          return <MaximizeIcon key={index} onClick={() => setIsMinimized(false)} />;
        }

        if (index === 2) {
          return <CloseIcon key={index} onClick={() => setIsComposeOpen(false)} />;
        }

        return <HeightIcon key={index} onClick={(e) => e.stopPropagation()} />;
      }),

    [isMinimized]
  );

  return (
    <div className={cx(composeModalStyle, isMinimized && "is-minimized")}>
      <div className="header" role="button" tabIndex={0} onClick={() => setIsMinimized(!isMinimized)} onKeyDown={handleKeyDown}>
        <Typography component="span">New Message</Typography>
        <div className="icons-wrapper">{headerIconsGenerator()}</div>
      </div>
      <ComposeForm isMinimized={isMinimized} />
    </div>
  );
};

const composeModalStyle = css`
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
