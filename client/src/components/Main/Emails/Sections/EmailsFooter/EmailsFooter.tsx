import { useEmailsStore } from "stores/emailsStore";
import { css, cx } from "@emotion/css";
import { blueButtonStyle } from "styles/reusable-css-in-js-styles";
import { Button, AppBar, Tabs, Tab } from "@material-ui/core";

const texts = ["Inbox", "Sent"];

const EmailsFooter = () => {
  const { setIsComposeOpen, activeTab, setActiveTab } = useEmailsStore((state) => state);

  return (
    <div className={style}>
      <Button className="compose-button" onClick={() => setIsComposeOpen(true)}>
        Compose
      </Button>
      <AppBar position="static" className="tabs" elevation={0}>
        <Tabs variant="fullWidth" value={activeTab} aria-label="simple tabs example">
          {texts.map((text, index) => (
            <Tab key={index} label={text} onClick={() => setActiveTab(index)} className={cx(activeTab === index && "is-active")} />
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
