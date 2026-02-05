import { css } from "@emotion/css";
import { Actions } from "#root/client/components/Main/Emails/Sections/Actions/Actions";
import { EmailsFooter } from "#root/client/components/Main/Emails/Sections/EmailsFooter/EmailsFooter";
import { EmailsList } from "#root/client/components/Main/Emails/Sections/EmailsList/EmailsList";
import { TabsRow } from "#root/client/components/Main/Emails/Sections/TabsRow/TabsRow";
import { useIsSmallScreen } from "#root/client/hooks/use-is-small-screen";

export const Emails = () => {
  const { isSmallScreen } = useIsSmallScreen();

  return (
    <div className={emailsStyle}>
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

const emailsStyle = css`
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
