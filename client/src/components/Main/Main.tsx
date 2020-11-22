import React, { useContext } from "react";
import { AppContext } from "../../contexts/AppContext";
import Emails from "./Emails/Emails";
import LeftSideBar from "./LeftSidebar/LeftSidebar";
import RightSidebar from "./RightSidebar/RightSidebar";
import Compose from "./Compose/Compose";
import "./Main.scss";

const Main = () => {
  const { isSmallScreen, isComposeOpened } = useContext(AppContext);

  return (
    <div className="main">
      {!isSmallScreen && <LeftSideBar />}

      <Emails />
      {isComposeOpened && <Compose />}

      {!isSmallScreen && <RightSidebar />}
    </div>
  );
};

export default Main;