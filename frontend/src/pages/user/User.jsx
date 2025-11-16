import "./user.css";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import React, { useEffect, useState } from "react";
import CreateIcon from "@mui/icons-material/Create";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { BASEAPIURL } from "../../constants";

const User = () => {
  const [data, setData] = useState({});
  const { userID } = useParams();
  const theme = useSelector((state) => state.theme.currentTheme);

  const getUserData = () => {
    axios
      .get(
        `${BASEAPIURL}/users/${userID}/`
      )
      .then((res) => {
        const response = res.data;
        setData(response);
      });
  };

  useEffect(() => {
    getUserData();
  }, []);

  const inputChangeHandler = (e) => {
    const profileKeys = [
      "account_open_date",
      "phone_number",
      "location",
      "designation",
      "bio",
      "profile_pic",
    ];
    const oldData = { ...data };
    let inputValue = e.target.value;

    if (e.target.type === "file") {
      const file = e.target.files[0];
      if (file) {
        const localImageUrl = URL.createObjectURL(file);
        oldData.profile[e.target.name] = localImageUrl;
        setData(oldData);
      }
      return;
    }

    if (profileKeys.includes(e.target.name)) {
      if (e.target.name === "account_open_date") {
        inputValue = new Date(inputValue).getTime();
      }
      oldData.profile[e.target.name] = inputValue;
    } else {
      oldData[e.target.name] = inputValue;
    }

    setData(oldData);
  };

  const updateHandler = () => {
    axios
      .put(
        `${BASEAPIURL}/users/${userID}/`,
        data
      )
      .then((res) => {
        if (res.status == 200) {
          alert("Data updated Sucessfully");
        }
      });
  };

  return (
    <>
      <div className="user-page-box">
        <div className="user-top-bar">
          <h3 className="page-title">Edit User</h3>
        </div>

        <div className="user">
          <div className="user-info-col-1">
            <div
              className={`user-main-info ${
                theme === "dark" && "user-main-info-dark"
              }`}
            >
              <div className="profile-pic-container">
                <img
                  className="profile-img"
                  src={data.profile?.profile_pic}
                  alt="user-img"
                />
                <div className="edit-profile-pic">
                  <label
                    htmlFor="file"
                    className={`edit-icon ${
                      theme === "dark" && "edit-icon-dark"
                    }`}
                  >
                    <CreateIcon />
                  </label>
                  <input
                    type="file"
                    id="file"
                    name="profile_pic"
                    style={{ display: "none" }}
                    onChange={inputChangeHandler}
                  />
                </div>
              </div>
              <div className="user-details">
                <p className="name">
                  {data.first_name} {data.last_name}
                </p>
                <p className="role">{data.profile?.designation}</p>
              </div>
            </div>
            <div
              className={`user-main-info user-main-info-section-2 ${
                theme === "dark" && "user-main-info-section-2-dark"
              }`}
            >
              <div className="account-details">
                <p className="details-sub-title">Account Details</p>
                <div className="account-name">
                  <PermIdentityIcon />
                  <span className="details-info-text">{data.username}</span>
                </div>
                <div className="account-date">
                  <CalendarTodayIcon />
                  <span className="details-info-text">
                    {data.profile?.account_open_date
                      ? new Date(
                          parseInt(data.profile?.account_open_date)
                        ).toLocaleDateString()
                      : ""}
                  </span>
                </div>
              </div>

              <div className="contact-details">
                <p className="details-sub-title">Contact Details</p>
                <div className="contact-number">
                  <PhoneIcon />
                  <span className="details-info-text">
                    {data.profile?.phone_number}
                  </span>
                </div>
                <div className="email-info">
                  <EmailOutlinedIcon />
                  <span className="details-info-text">{data.email}</span>
                </div>
                <div className="work-location">
                  <LocationOnOutlinedIcon />
                  <span className="details-info-text">
                    {data.profile?.location}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`edit-userinfo ${
              theme === "dark" && "edit-userinfo-dark"
            }`}
          >
            <div className="edit-box">
              <p className="edit">Edit</p>
              <div className="user-info-input">
                <div
                  className={`user-info-input-flex ${
                    theme === "dark" && "user-info-input-flex"
                  }`}
                >
                  <span>User Name</span>
                  <input
                    type="text"
                    className="input-data"
                    name="username"
                    value={data.username}
                    onChange={inputChangeHandler}
                  />
                </div>
                <div className="user-info-input-flex">
                  <span>Email</span>
                  <input
                    type="text"
                    className="input-data"
                    value={data.email}
                    name="email"
                    onChange={inputChangeHandler}
                  />
                </div>
                <div className="user-info-input-flex">
                  <span>First Name</span>
                  <input
                    type="text"
                    className="input-data"
                    name="first_name"
                    value={data.first_name}
                    onChange={inputChangeHandler}
                  />
                </div>
                <div className="user-info-input-flex">
                  <span>Last Name</span>
                  <input
                    type="text"
                    className="input-data"
                    name="last_name"
                    value={data.last_name}
                    onChange={inputChangeHandler}
                  />
                </div>

                <div className="user-info-input-flex">
                  <span>Account Created At</span>
                  <input
                    type="date"
                    className="input-data"
                    name="account_open_date"
                    value={
                      data.profile?.account_open_date
                        ? new Date(parseInt(data.profile?.account_open_date))
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={inputChangeHandler}
                  />
                </div>
                <div className="user-info-input-flex">
                  <span>Contact</span>
                  <input
                    type="text"
                    className="input-data"
                    name="phone_number"
                    value={data.profile?.phone_number}
                    onChange={inputChangeHandler}
                  />
                </div>
                <div className="user-info-input-flex">
                  <span>Address</span>
                  <input
                    type="text"
                    className="input-data"
                    name="location"
                    value={data.profile?.location}
                    onChange={inputChangeHandler}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="update-btn"
                onClick={updateHandler}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default User;
