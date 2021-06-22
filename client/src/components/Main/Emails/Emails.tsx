import { useContext } from "react";
import { AppContext, AppContextType } from "contexts/AppContext";
import Actions from "./Sections/Actions/Actions";
import TabsRow from "./Sections/TabsRow/TabsRow";
import EmailsList from "./Sections/EmailsList/EmailsList";
import EmailsFooter from "./Sections/EmailsFooter/EmailsFooter";
import "./Emails.scss";

const Emails = () => {
  const { isSmallScreen } = useContext(AppContext) as AppContextType;

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