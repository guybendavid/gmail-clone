import { useContext } from "react";
import { AppContext } from "contexts/AppContext";
import { Store, useStore } from "store/store";
import Emails from "./Emails/Emails";
import LeftSideBar from "./LeftSidebar/LeftSidebar";
import RightSidebar from "./RightSidebar/RightSidebar";
import Compose from "./Compose/Compose";
import "./Main.scss";

const Main = () => {
  const isComposeOpened = useStore((state: Store) => state.isComposeOpened);
  const { isSmallScreen } = useContext(AppContext);

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