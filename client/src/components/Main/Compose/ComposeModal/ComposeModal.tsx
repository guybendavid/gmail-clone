import React, { useContext, useState } from "react";
import { AppContext } from "../../../../contexts/AppContext";
import { Typography } from "@material-ui/core";
import MinimizeIcon from '@material-ui/icons/Minimize';
import MaximizeIcon from '@material-ui/icons/Maximize';
import HeightIcon from '@material-ui/icons/Height';
import CloseIcon from '@material-ui/icons/Close';
import ComposeForm from "../ComposeForm/ComposeForm";
import "./ComposeModal.scss";

const ComposeModal = () => {
  const { setIsComposeOpened } = useContext(AppContext);
  const [isMinimized, setIsMinimized] = useState(false);

  const headerIconsGenerator = () => {
    return [MinimizeIcon, HeightIcon, CloseIcon].map((Icon, index) => {
      if (index === 0 && !isMinimized) {
        return <MinimizeIcon key={index} onClick={() => setIsMinimized(true)} />;
      } else if (index === 0 && isMinimized) {
        return <MaximizeIcon key={index} onClick={() => setIsMinimized(false)} />;
      } else if (index === 2) {
        return <CloseIcon key={index} onClick={(e) => setIsComposeOpened(false)} />;
      } else {
        return <HeightIcon key={index} onClick={(e) => e.stopPropagation()} />;
      }
    });
  };

  return (
    <div className={"compose-modal" + (isMinimized ? " is-minimized" : "")}>
      <div className="header" onClick={() => setIsMinimized(!isMinimized)}>
        <Typography component="span">New Message</Typography>
        <div className="icons-wrapper">{headerIconsGenerator()}</div>
      </div>
      {!isMinimized && <ComposeForm />}
    </div>
  );
};

export default ComposeModal;