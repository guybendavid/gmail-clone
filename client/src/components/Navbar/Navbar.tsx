import { useState, useContext, MouseEvent } from "react";
import { AppContext, AppContextType } from "contexts/AppContext";
import { Store, useStore } from "store/store";
import { getAuthData } from "services/auth";
import { IconButton, Avatar, ClickAwayListener, Menu, MenuItem } from "@material-ui/core";
import { classNamesGenerator } from "@guybendavid/utils";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import AppsIcon from '@material-ui/icons/Apps';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import AppIcon from "images/app-icon.png";
import MenuIcon from '@material-ui/icons/Menu';
import "./Navbar.scss";

const Navbar = () => {
  const { isSmallScreen } = useContext(AppContext) as AppContextType;
  const searchValue = useStore((state: Store) => state.searchValue);
  const setSearchValue = useStore((state: Store) => state.setSearchValue);
  const [searchBarIsOpened, setSearchBarIsOpened] = useState(false);

  return (
    <div className="navbar">
      {!isSmallScreen &&
        <div className="left-section">
          <IconButton>
            <MenuIcon />
          </IconButton>
          <img src={AppIcon} alt="navbar-img" onClick={() => window.location.reload()} height="45" />
        </div>}
      <div className="right-section">
        <ClickAwayListener onClickAway={() => setSearchBarIsOpened(false)}>
          <div className={classNamesGenerator("search-wrapper", (isSmallScreen || searchBarIsOpened) && "white")}>
            <IconButton>
              {isSmallScreen ? <MenuIcon /> : <SearchIcon />}
            </IconButton>
            <InputBase
              className="input-base"
              placeholder="Search mail"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onClick={() => setSearchBarIsOpened(!searchBarIsOpened)}
              inputProps={{ "aria-label": "search" }}
            />
            {isSmallScreen ?
              <AvatarMenu />
              :
              <IconButton>
                <ArrowDropDownIcon />
              </IconButton>
            }
          </div>
        </ClickAwayListener>
        {!isSmallScreen &&
          <div className="buttons-wrapper">
            {[HelpOutlineIcon, SettingsOutlinedIcon, AppsIcon].map((Icon, index) => (
              <IconButton key={index}>
                <Icon />
              </IconButton>
            ))}
            <AvatarMenu />
          </div>}
      </div>
    </div>
  );
};

const AvatarMenu = () => {
  const { loggedInUser } = getAuthData();
  const { logout } = useContext(AppContext) as AppContextType;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <Avatar className="avatar" alt="avatar" src={loggedInUser?.image} />
      </IconButton>
      <Menu
        id="logout-menu"
        keepMounted
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default Navbar;