import React, { useContext, useState } from "react";
import { AppContext } from "../../../contexts/AppContext";
import Actions from "./Sections/Actions/Actions";
import TabsRow from "./Sections/TabsRow/TabsRow";
import EmailsList from "./Sections/EmailsList/EmailsList";
import EmailsFooter from "./Sections/EmailsFooter/EmailsFooter";
import "./Emails.scss";

const Emails = () => {
  const { isSmallScreen } = useContext(AppContext);
  const [displayedEmails, setDisplayedEmails] = useState<any>([]);

  return (
    <div className="emails-wrapper">
      <Actions displayedEmails={displayedEmails} />
      <div className="scroll-area">
        {!isSmallScreen && <TabsRow />}
        <EmailsList displayedEmails={displayedEmails} setDisplayedEmails={setDisplayedEmails} />
      </div>
      {isSmallScreen && <EmailsFooter />}
    </div>
  );
};

export default Emails;