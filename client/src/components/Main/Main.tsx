import { useEmailsStore } from "stores/emails-store";
import { css } from "@emotion/css";
import { Emails } from "./Emails/Emails";
import { LeftSidebar } from "./LeftSidebar/LeftSidebar";
import { RightSidebar } from "./RightSidebar/RightSidebar";
import { Compose } from "./Compose/Compose";
import { useIsSmallScreen } from "hooks/use-is-small-screen";

export const Main = () => {
  const { isComposeOpen } = useEmailsStore((state) => state);
  const { isSmallScreen } = useIsSmallScreen();

  return (
    <div className={mainStyle}>
      {!isSmallScreen && <LeftSidebar />}
      <Emails />
      {isComposeOpen && <Compose />}
      {!isSmallScreen && <RightSidebar />}
    </div>
  );
};

const mainStyle = css`
  display: flex;
  height: 100vh;
`;
