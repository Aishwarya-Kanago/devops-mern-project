const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", getUser, (req, res) => {
  res.send(res.user);
});

router.post("/", async (req, res) => {
  const user = new User({
    username: req.body.username,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    profile: {
      profile_pic: req.body.profile.profile_pic,
      bio: req.body.profile.bio,
      designation: req.body.profile.designation,
      status: req.body.profile.status,
      phone_number: req.body.profile.phone_number,
      account_name: req.body.profile.account_name,
      account_open_date: req.body.profile.account_open_date,
      location: req.body.profile.location,
      transaction: req.body.profile.transaction,
      transaction_status: req.body.profile.transaction_status,
      gender: req.body.profile.gender,
    },
  });
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", getUser, async (req, res) => {
  const data = req.body;
  const user = res.user;
  if (data.username != null) {
    user.username = data.username;
  }
  if (data.first_name != null) {
    user.first_name = data.first_name;
  }
  if (data.last_name != null) {
    user.last_name = data.last_name;
  }
  if (data.email != null) {
    user.email = data.email;
  }
  if (data.profile.profile_pic != null) {
    user.profile.profile_pic = data.profile.profile_pic;
  }
  if (data.profile.bio != null) {
    user.profile.bio = data.profile.bio;
  }
  if (data.profile.designation != null) {
    user.profile.designation = data.profile.designation;
  }
  if (data.profile.status != null) {
    user.profile.status = data.profile.status;
  }
  if (data.profile.phone_number != null) {
    user.profile.phone_number = data.profile.phone_number;
  }
  if (data.profile.account_name != null) {
    user.profile.account_name = data.profile.account_name;
  }
  if (data.profile.account_open_date != null) {
    user.profile.account_open_date = data.profile.account_open_date;
  }
  if (data.profile.location != null) {
    user.profile.location = data.profile.location;
  }
  if (data.profile.transaction != null) {
    user.profile.transaction = data.profile.transaction;
  }
  if (data.profile.transaction_status != null) {
    user.profile.transaction_status = data.profile.transaction_status;
  }
  if (data.profile.gender != null) {
    user.profile.gender = data.profile.gender;
  }
  try {
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", getUser, async (req, res) => {
  try {
    await res.user.deleteOne();
    res.json({ message: "User Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getUser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "Cannot find user" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

  res.user = user;
  next();
}

module.exports = router;
