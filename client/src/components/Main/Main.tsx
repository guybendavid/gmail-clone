import { Store, useStore } from "store/store";
import Emails from "./Emails/Emails";
import LeftSideBar from "./LeftSidebar/LeftSidebar";
import RightSidebar from "./RightSidebar/RightSidebar";
import Compose from "./Compose/Compose";
import useIsSmallScreen from "hooks/use-is-small-screen";
import "./Main.scss";

const Main = () => {
  const isComposeOpened = useStore((state: Store) => state.isComposeOpened);
  const { isSmallScreen } = useIsSmallScreen();

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