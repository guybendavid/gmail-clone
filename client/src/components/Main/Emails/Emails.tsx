import Actions from "./Sections/Actions/Actions";
import TabsRow from "./Sections/TabsRow/TabsRow";
import EmailsList from "./Sections/EmailsList/EmailsList";
import useIsSmallScreen from "hooks/use-is-small-screen";
import EmailsFooter from "./Sections/EmailsFooter/EmailsFooter";
import "./Emails.scss";

const Emails = () => {
  const { isSmallScreen } = useIsSmallScreen();

  return (
    <div className="emails-wrapper">
      <Actions />
      {!isSmallScreen && <TabsRow />}
      {!isSmallScreen ?
        <EmailsList />
        :
        <div className="emails-list-footer-wrapper">
          <EmailsList />
          <EmailsFooter />
        </div>
      }
    </div>
  );
};

export default Emails;