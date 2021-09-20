import { useState } from "react";
import { Store, useStore } from "store/store";
import { Typography } from "@material-ui/core";
import { classNamesGenerator } from "@guybendavid/utils";
import MinimizeIcon from '@material-ui/icons/Minimize';
import MaximizeIcon from '@material-ui/icons/Maximize';
import HeightIcon from '@material-ui/icons/Height';
import CloseIcon from '@material-ui/icons/Close';
import ComposeForm from "../ComposeForm/ComposeForm";
import "./ComposeModal.scss";

const ComposeModal = () => {
  const setIsComposeOpened = useStore((state: Store) => state.setIsComposeOpened);
  const [isMinimized, setIsMinimized] = useState(false);

  const headerIconsGenerator = () => {
    return [MinimizeIcon, HeightIcon, CloseIcon].map((_Icon, index) => {
      if (index === 0 && !isMinimized) {
        return <MinimizeIcon key={index} onClick={() => setIsMinimized(true)} />;
      } else if (index === 0 && isMinimized) {
        return <MaximizeIcon key={index} onClick={() => setIsMinimized(false)} />;
      } else if (index === 2) {
        return <CloseIcon key={index} onClick={() => setIsComposeOpened(false)} />;
      } else {
        return <HeightIcon key={index} onClick={(e) => e.stopPropagation()} />;
      }
    });
  };

  return (
    <div className={classNamesGenerator("compose-modal", isMinimized && "is-minimized")}>
      <div className="header" onClick={() => setIsMinimized(!isMinimized)}>
        <Typography component="span">New Message</Typography>
        <div className="icons-wrapper">{headerIconsGenerator()}</div>
      </div>
      <ComposeForm isMinimized={isMinimized} />
    </div>
  );
};

export default ComposeModal;