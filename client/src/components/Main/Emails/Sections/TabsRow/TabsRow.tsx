import { AppBar, Tab, Tabs, ListItem } from "@material-ui/core";
import { css } from "@emotion/css";
import InboxIcon from "@material-ui/icons/Inbox";
import PeopleIcon from "@material-ui/icons/People";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";

const texts = ["Primary", "Social", "Promotions"];

const TabsRow = () => {
  return (
    <AppBar className={style} position="static" elevation={0}>
      <Tabs value={0} aria-label="simple tabs example">
        {[InboxIcon, PeopleIcon, LocalOfferIcon].map((Icon, index) => (
          <Tab key={index} label={
            <ListItem button>
              <Icon fontSize="small" />
              {texts[index]}
            </ListItem>
          } />
        ))}
      </Tabs>
    </AppBar>
  );
};

export default TabsRow;

const style = css`
  background: white !important;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);

  button {
    padding: 0;

    &:first-child {
      color: var(--red-color);
    }

    &:not(:first-child) {
      color: var(--text-color);
    }

    div {
      padding: 12px 14px;
      gap: 10px;
    }
  }
`;