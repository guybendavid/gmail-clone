import { AppBar, Tab, Tabs, ListItem } from "@material-ui/core";
import { css } from "@emotion/css";
import { Inbox as InboxIcon, People as PeopleIcon, LocalOffer as LocalOfferIcon } from "@material-ui/icons";

const texts = ["Primary", "Social", "Promotions"];

export const TabsRow = () => (
  <AppBar className={tabsRowStyle} position="static" elevation={0}>
    <Tabs value={0} aria-label="simple tabs example">
      {[InboxIcon, PeopleIcon, LocalOfferIcon].map((Icon, index) => (
        <Tab
          key={index}
          label={
            <ListItem button={true}>
              <Icon fontSize="small" />
              {texts[index]}
            </ListItem>
          }
        />
      ))}
    </Tabs>
  </AppBar>
);

const tabsRowStyle = css`
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
