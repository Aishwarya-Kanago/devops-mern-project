const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  profile: {
    profile_pic: {
      type: String,
    },
    bio: {
      type: String,
    },
    designation: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    account_name: {
      type: String,
    },
    account_open_date: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    transaction: {
      type: Number,
      required: true,
    },
    transaction_status: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
  },
});

module.exports = mongoose.model("User", userSchema);
