import { useEmailsStore } from "stores/emailsStore";
import { css } from "@emotion/css";
import Emails from "./Emails/Emails";
import LeftSideBar from "./LeftSidebar/LeftSidebar";
import RightSidebar from "./RightSidebar/RightSidebar";
import Compose from "./Compose/Compose";
import useIsSmallScreen from "hooks/use-is-small-screen";

const Main = () => {
  const { isComposeOpen } = useEmailsStore(state => state);
  const { isSmallScreen } = useIsSmallScreen();

  return (
    <div className={style}>
      {!isSmallScreen && <LeftSideBar />}
      <Emails />
      {isComposeOpen && <Compose />}
      {!isSmallScreen && <RightSidebar />}
    </div>
  );
};

export default Main;

const style = css`
  display: flex;
  height: 100vh;
`;