const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const noteSchema = require("./noteShema");

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
  cpwd: {
    type: String,
    required: true,
  },
  resetToken: {
    type: String,
  },

  tokens: [
    {
      token: {
        type: String,
      },
    },
  ],
  notes: [noteSchema],
});

userSchema.methods.userAuthGenerator = async function (req, res) {
  try {
    const token = await jwt.sign({ _id: this._id }, process.env.SECRET, {
      expiresIn: "1h",
    });
    this.tokens = this.tokens.concat({ token });
    await this.save();
    return token;
  } catch (error) {
    console.log(error);
  }
};
const Note = mongoose.model("Note", noteSchema);
const User = mongoose.model("User", userSchema);

module.exports = { User, Note };
