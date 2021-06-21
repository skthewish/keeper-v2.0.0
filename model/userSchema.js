const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  pwd: {
    type: String,
    required: true,
  },
  resetToken: {
    type: String,
  },
  token: {
    type: String,
  },
  notes: [
    {
      title: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
