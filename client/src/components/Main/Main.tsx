import { css } from "@emotion/css";
import { Compose } from "#root/client/components/Main/Compose/Compose";
import { Emails } from "#root/client/components/Main/Emails/Emails";
import { LeftSidebar } from "#root/client/components/Main/LeftSidebar/LeftSidebar";
import { RightSidebar } from "#root/client/components/Main/RightSidebar/RightSidebar";
import { useIsSmallScreen } from "#root/client/hooks/use-is-small-screen";
import { useEmailsStore } from "#root/client/stores/emails-store";

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
