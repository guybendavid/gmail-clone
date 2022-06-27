import { useEmailsStore, EmailsStore } from "stores/emailsStore";
import { css, cx } from "@emotion/css";
import { blueButtonStyle } from "styles/reusable-css-in-js-styles";
import { Button } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

const texts = [
  "Inbox",
  "Sent"
];

const EmailsFooter = () => {
  const setIsComposeOpen = useEmailsStore((state: EmailsStore) => state.setIsComposeOpen);
  const activeTab = useEmailsStore((state: EmailsStore) => state.activeTab);
  const setActiveTab = useEmailsStore((state: EmailsStore) => state.setActiveTab);

  return (
    <div className={style}>
      <Button className="compose-button" onClick={() => setIsComposeOpen(true)}>Compose</Button>
      <AppBar position="static" className="tabs" elevation={0}>
        <Tabs variant="fullWidth" value={activeTab} aria-label="simple tabs example">
          {texts.map((text, index) => (
            <Tab key={index} label={text} onClick={() => setActiveTab(index)}
              className={cx(activeTab === index && "is-active")} />
          ))}
        </Tabs>
      </AppBar>
    </div>
  );
};

export default EmailsFooter;

const style = css`
  text-align: center;
  position: fixed;
  bottom: 0;
  width: 100%;

  .tabs {
    background: white;

    button {
      &.is-active {
        color: var(--red-color);
      }

      &:not(.is-active) {
        color: var(--text-color);
      }
    }
  }

  .compose-button {
    ${blueButtonStyle};
    width: 98%;
    margin: 0 auto;
  }
`;