import { Actions } from "./Sections/Actions/Actions";
import { TabsRow } from "./Sections/TabsRow/TabsRow";
import { EmailsList } from "./Sections/EmailsList/EmailsList";
import { EmailsFooter } from "./Sections/EmailsFooter/EmailsFooter";
import { useIsSmallScreen } from "hooks/use-is-small-screen";
import { css } from "@emotion/css";

export const Emails = () => {
  const { isSmallScreen } = useIsSmallScreen();

  return (
    <div className={style}>
      <Actions />
      {!isSmallScreen ? (
        <>
          <TabsRow />
          <EmailsList />
        </>
      ) : (
        <div className="small-screen-emails-list-footer-wrapper">
          <EmailsList />
          <EmailsFooter />
        </div>
      )}
    </div>
  );
};

const style = css`
  flex: 0.82;

  @media only screen and (max-width: 765px) {
    flex: 1;
  }

  .small-screen-emails-list-footer-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 67%;
  }
`;
