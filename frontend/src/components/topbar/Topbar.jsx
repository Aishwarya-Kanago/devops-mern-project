import React from "react";
import "./topbar.css";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import LanguageIcon from "@mui/icons-material/Language";
import SettingsIcon from "@mui/icons-material/Settings";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../stores/themeSlice";

const Topbar = () => {
  const theme = useSelector((state) => state.theme.currentTheme);
  const dispatch = useDispatch();

  const themeToggleHandler = () => {
    dispatch(toggleTheme());
  };

  return (
    <div
      className={`topbar-fields ${theme === "dark" && "topbar-fields-dark"}`}
    >
      {theme === "light" ? (
        <LightModeIcon onClick={themeToggleHandler} />
      ) : (
        <DarkModeIcon
          onClick={themeToggleHandler}
          className={`icon ${theme === "dark" && "icon-dark"}`}
        />
      )}
      <LanguageIcon className={`icon ${theme === "dark" && "icon-dark"}`} />
      <NotificationsNoneOutlinedIcon
        className={`icon ${theme === "dark" && "icon-dark"}`}
      />
      <SettingsIcon className={`icon ${theme === "dark" && "icon-dark"}`} />
      <img
        src="https://img.freepik.com/premium-photo/cute-girl-3d-character-design-cartoon-girl-avatar_432516-5512.jpg"
        alt="profile-picture"
      />
    </div>
  );
};

export default Topbar;
