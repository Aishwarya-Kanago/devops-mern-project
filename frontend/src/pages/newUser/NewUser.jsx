import axios from "axios";
import "./newUser.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { BASEAPIURL } from "../../constants";

const NewUser = () => {
  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme.currentTheme);
  const [newUser, setnewUser] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    profile: {
      profile_pic: "",
      bio: "",
      designation: "",
      status: "Active",
      phone_number: "",
      account_name: "",
      account_open_date: "",
      location: "",
      transaction: 0,
      transaction_status: "",
      gender: "",
    },
  });

  const onchangeUser = (e) => {
    const profileKeys = [
      "designation",
      "phone_number",
      "location",
      "gender",
      "status",
      "account_open_date",
      "transaction",
      "transaction_status",
    ];

    const currentData = { ...newUser };
    let inputValue = e.target.value;

    if (e.target.type === "file") {
      const file = e.target.files[0];
      if (file) {
        const localImageUrl = URL.createObjectURL(file);
        currentData.profile[e.target.name] = localImageUrl;
        setnewUser(currentData);
      }
      return;
    }

    if (profileKeys.includes(e.target.name)) {
      if (e.target.name === "account_open_date") {
        inputValue = new Date(inputValue).getTime();
      }
      currentData.profile[e.target.name] = inputValue;
    } else {
      currentData[e.target.name] = inputValue;
    }
    setnewUser(currentData);
  };

  const createUserHandler = () => {
    axios
      .post(`${BASEAPIURL}/users/`, newUser)
      .then((res) => {
        if (res.status === 201) {
          alert("User created Sucessfully");
          navigate(`/userList/`);
          window.location.reload();
        }
      })
      .catch((err) => {
        const res = err.response;
        const error_message = res.data[Object.keys(res.data)[0]];
        alert(error_message);
      });
  };

  return (
    <div className="newuser-info">
      <h1 className="newuser-title">New User</h1>
      <form className="newuser-form">
        <div
          className={`newuser-item ${theme === "dark" && "newuser-item-dark"}`}
        >
          <label>Username</label>
          <input
            type="text"
            placeholder="john_smith"
            name="username"
            onChange={onchangeUser}
          />
        </div>
        <div
          className={`newuser-item ${theme === "dark" && "newuser-item-dark"}`}
        >
          <label>First Name</label>
          <input
            type="text"
            placeholder="John"
            name="first_name"
            onChange={onchangeUser}
          />
        </div>
        <div
          className={`newuser-item ${theme === "dark" && "newuser-item-dark"}`}
        >
          <label>Last Name</label>
          <input
            type="text"
            placeholder="Smith"
            name="last_name"
            onChange={onchangeUser}
          />
        </div>
        <div
          className={`newuser-item ${theme === "dark" && "newuser-item-dark"}`}
        >
          <label>Email</label>
          <input
            type="text"
            placeholder="john@gmail.com"
            name="email"
            onChange={onchangeUser}
          />
        </div>
        <div
          className={`newuser-item ${theme === "dark" && "newuser-item-dark"}`}
        >
          <label>Designation</label>
          <input
            type="text"
            placeholder="Software Engineer"
            name="designation"
            onChange={onchangeUser}
          />
        </div>
        <div
          className={`newuser-item ${theme === "dark" && "newuser-item-dark"}`}
        >
          <label>Phone</label>
          <input
            type="text"
            placeholder="+1 234 456 78"
            name="phone_number"
            onChange={onchangeUser}
          />
        </div>
        <div
          className={`newuser-item ${theme === "dark" && "newuser-item-dark"}`}
        >
          <label>Address</label>
          <input
            type="text"
            placeholder="New York|USA"
            name="location"
            onChange={onchangeUser}
          />
        </div>
        <div
          className={`newuser-item ${theme === "dark" && "newuser-item-dark"}`}
        >
          <label>Gender</label>
          <div className="gender-options">
            <input
              type="radio"
              name="gender"
              id="male"
              value="male"
              onChange={onchangeUser}
            />
            <label for="male">Male</label>
            <input
              type="radio"
              name="gender"
              id="female"
              value="female"
              onChange={onchangeUser}
            />
            <label for="female">Female</label>
          </div>
        </div>
        <div className="newuser-item">
          <label>Status</label>
          <select
            className={`active-options ${
              theme === "dark" && "active-options-dark"
            }`}
            name="status"
            id="active"
            onChange={onchangeUser}
          >
            <option className="yes">Active</option>
            <option className="no">Inactive</option>
          </select>
        </div>
        <div
          className={`newuser-item ${theme === "dark" && "newuser-item-dark"}`}
        >
          <label>Account Created At</label>
          <input type="date" name="account_open_date" onChange={onchangeUser} />
        </div>
        <div
          className={`newuser-item ${theme === "dark" && "newuser-item-dark"}`}
        >
          <label>Transaction Amount</label>
          <input
            type="text"
            placeholder="120"
            name="transaction"
            onChange={onchangeUser}
          />
        </div>
        <div
          className={`newuser-item ${theme === "dark" && "newuser-item-dark"}`}
        >
          <label>Transaction Status</label>
          <input
            type="text"
            placeholder="Approved"
            name="transaction_status"
            onChange={onchangeUser}
          />
        </div>
        <div
          className={`newuser-item ${theme === "dark" && "newuser-item-dark"}`}
        >
          <label htmlFor="file">Upload Profile Photo</label>
          <input
            type="file"
            id="file"
            name="profile_pic"
            onChange={onchangeUser}
          />
        </div>
      </form>
      <button className="newuser-create-btn" onClick={createUserHandler}>
        Create
      </button>
    </div>
  );
};

export default NewUser;
