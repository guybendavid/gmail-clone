import Actions from "./Sections/Actions/Actions";
import TabsRow from "./Sections/TabsRow/TabsRow";
import EmailsList from "./Sections/EmailsList/EmailsList";
import EmailsFooter from "./Sections/EmailsFooter/EmailsFooter";
import useIsSmallScreen from "hooks/use-is-small-screen";
import "./Emails.scss";

const Emails = () => {
  const { isSmallScreen } = useIsSmallScreen();

  return (
    <div className="emails-wrapper">
      <Actions />
      <div className="scroll-area">
        {!isSmallScreen && <TabsRow />}
        <EmailsList />
      </div>
      {isSmallScreen && <EmailsFooter />}
    </div>
  );
};

export default Emails;