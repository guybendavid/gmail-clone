import { useEmailsStore, EmailsStore } from "stores/emailsStore";
import Emails from "./Emails/Emails";
import LeftSideBar from "./LeftSidebar/LeftSidebar";
import RightSidebar from "./RightSidebar/RightSidebar";
import Compose from "./Compose/Compose";
import useIsSmallScreen from "hooks/use-is-small-screen";
import "./Main.scss";

const Main = () => {
  const isComposeOpen = useEmailsStore((state: EmailsStore) => state.isComposeOpen);
  const { isSmallScreen } = useIsSmallScreen();

  return (
    <div className="main">
      {!isSmallScreen && <LeftSideBar />}
      <Emails />
      {isComposeOpen && <Compose />}
      {!isSmallScreen && <RightSidebar />}
    </div>
  );
};

export default Main;