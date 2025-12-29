import {
  Search as SearchIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Apps as AppsIcon,
  SettingsOutlined as SettingsOutlinedIcon,
  HelpOutline as HelpOutlineIcon,
  Menu as MenuIcon
} from "@material-ui/icons";
import { css, cx } from "@emotion/css";
import { getAuthData } from "services/auth";
import { IconButton, Avatar, ClickAwayListener, Menu, MenuItem, InputBase } from "@material-ui/core";
import { useAppStore } from "stores/app-store";
import { useEmailsStore } from "stores/emails-store";
import { useIsSmallScreen } from "hooks/use-is-small-screen";
import type { MouseEvent } from "react";
import { useState } from "react";
import gmailIcon from "images/app-icon.png";

export const Navbar = () => {
  const { isSmallScreen } = useIsSmallScreen();
  const { searchValue, setSearchValue } = useEmailsStore((state) => state);
  const [searchBarIsOpen, setSearchBarIsOpen] = useState(false);

  return (
    <div className={navbarStyle}>
      {!isSmallScreen && (
        <div className="left-section">
          <IconButton>
            <MenuIcon />
          </IconButton>
          <img src={gmailIcon} alt="navbar-img" height="45" />
        </div>
      )}
      <div className="right-section">
        <ClickAwayListener onClickAway={() => setSearchBarIsOpen(false)}>
          <div className={cx("search-wrapper", (isSmallScreen || searchBarIsOpen) && "white")}>
            <IconButton>{isSmallScreen ? <MenuIcon /> : <SearchIcon />}</IconButton>
            <InputBase
              className="input-base"
              placeholder="Search mail"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onClick={() => setSearchBarIsOpen(!searchBarIsOpen)}
              inputProps={{ "aria-label": "search" }}
            />
            {isSmallScreen ? (
              <AvatarMenu />
            ) : (
              <IconButton>
                <ArrowDropDownIcon />
              </IconButton>
            )}
          </div>
        </ClickAwayListener>
        {!isSmallScreen && (
          <div className="buttons-wrapper">
            {[HelpOutlineIcon, SettingsOutlinedIcon, AppsIcon].map((Icon, index) => (
              <IconButton key={index}>
                <Icon />
              </IconButton>
            ))}
            <AvatarMenu />
          </div>
        )}
      </div>
    </div>
  );
};

const AvatarMenu = () => {
  const { loggedInUser } = getAuthData();
  const { logout } = useAppStore((state) => state);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);

  return (
    <>
      <IconButton onClick={handleClick}>
        <Avatar className="avatar" alt="avatar" src={loggedInUser.image} />
      </IconButton>
      <Menu
        id="main-menu"
        keepMounted={true}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>
    </>
  );
};

const navbarStyle = css`
  display: flex;
  justify-content: space-between;
  background: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding: 5px 0 5px 18px;

  @media only screen and (max-width: 765px) {
    padding: 5px;
    margin-bottom: 5px;
  }

  .avatar {
    width: 30px;
    height: 30px;
  }

  .left-section,
  .right-section {
    display: flex;
    align-items: center;

    &.left-section {
      flex: 0.205;

      img {
        margin: 0 20px 0 7px;
        cursor: pointer;
      }
    }

    &.right-section {
      flex: 1;
      justify-content: space-between;

      .search-wrapper {
        @media only screen and (max-width: 765px) {
          flex: 1;
        }

        display: flex;
        flex: 0.65;
        align-items: center;
        background: #eff2f5;
        transition: 0.3s ease;
        padding-right: 5px;
        padding-left: 10px;
        border-radius: 8px;

        &.white {
          background: #fff;
          box-shadow:
            0 1px 1px 0 rgba(65, 69, 73, 0.3),
            0 1px 3px 1px rgba(65, 69, 73, 0.15);
        }

        .input-base {
          padding: 10px 10px 10px 5px;
          flex: 1;
        }
      }

      .buttons-wrapper {
        display: flex;
        align-items: center;
        gap: 5px;
      }
    }
  }
`;
