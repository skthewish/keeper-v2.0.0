const express = require("express");
const router = express.Router();
const User = require("../model/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/authenticate");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const transporter = nodemailer.createTransport({
  host: "in-v3.mailjet.com",
  port: 587,
  auth: {
    user: process.env.MAILUSER,
    pass: process.env.MAILPASS,
  },
});

//Home route
router.get("/home", auth, (req, res) => {
  res.send(req.user);
});

// Register route

router.post("/register", async (req, res) => {
  const { fname, lname, email, pwd, cpwd } = req.body;
  if (!fname || !lname || !email || !pwd || !cpwd) {
    return res.status(422).json({ error: "Please fill all the fields" });
  }

  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(400).json({ error: "User already exist" });
    } else if (pwd !== cpwd) {
      return res.status(400).json({ error: "Your passwords are not matched" });
    } else {
      const hashpwd = await bcrypt.hash(pwd, 12);
      if (hashpwd) {
        const user = new User({
          fname,
          lname,
          email,
          pwd: hashpwd,
        });
        await user.save();
        res.status(201).json({ msg: "User registred successfully" });
      }
    }
  } catch (err) {
    console.log(err);
  }
});

// Log in route

router.post("/login", async (req, res) => {
  try {
    const { email, pwd } = req.body;
    if (!email || !pwd) {
      return res.status(422).json({ error: "Please fill all the fields" });
    }

    const isRegistered = await User.findOne({ email: email });
    if (isRegistered) {
      const isPwdMatch = await bcrypt.compare(pwd, isRegistered.pwd);

      if (isPwdMatch) {
        const token = await jwt.sign(
          { _id: isRegistered._id },
          process.env.SECRET
        );
        isRegistered.token = token;
        const saved = await isRegistered.save();

        res.cookie("jwtoken", token, {
          expires: new Date(Date.now() + 3600000),
          httpOnly: true,
        });
        if (saved) {
          return res.status(201).json({ msg: "User signed in successfully " });
        }
      } else {
        return res.status(400).json({ error: "Invalid details" });
      }
    } else {
      return res.status(400).json({ error: "User not exist" });
    }
  } catch (error) {
    console.log(error);
  }
});

// Reset route for sending mail
router.post("/reset", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(422).json({ error: "Please fill all the fields" });
    }
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      const rsttoken = await jwt.sign(
        { _id: userExist._id },
        process.env.SECRET,
        {
          expiresIn: "10m",
        }
      );
      if (rsttoken) {
        userExist.resetToken = rsttoken;
        userExist.save();
      }

      const send = await transporter.sendMail(
        {
          from: process.env.MYMAIL,
          to: email,
          subject: "password reset",
          html: `
        <h3>You requested for password reset of your keeper account</h3>
        <p>click on this <a href=${process.env.BASE_URL}/reset/${rsttoken}>link</a></p> to reset password.`,
        },
        (error, info) => {
          console.log(error);
          if (!error) {
            return res.status(200).json({ msg: "okay" });
          }
        }
      );
      if (send) {
        return res.status(200).json({ msg: "Check your email" });
      }
    } else {
      return res.status(400).json({ error: "User not exist" });
    }
  } catch (error) {
    console.log(error);
  }
});

// Passwoed change route

router.get("/reset/:token", async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ resetToken: token });
    if (user) {
      res.status(200).redirect(`/chgpwd/${token}`);
    } else {
      res.status(400).redirect("/");
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/chgpwd/:token", async (req, res) => {
  try {
    const { pwd, token } = req.body;
    if (!pwd.newpwd || !pwd.newcpwd) {
      return res.status(422).json({ error: "Please fill all the fields" });
    } else if (pwd.newpwd !== pwd.newcpwd) {
      return res.status(400).json({ error: "Your passwords are not matched" });
    }
    const user = await User.findOne({ resetToken: token });
    if (user) {
      const hashpwd = await bcrypt.hash(pwd.newpwd, 12);

      if (hashpwd) {
        user.pwd = hashpwd;

        user.resetToken = undefined;
        await user.save();

        return res.status(201).json({ msg: "Password changed successfully" });
      } else {
        return res
          .status(422)
          .json({ error: "Try again, Session has expired" });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

//Input Note route
router.get("/inputnote", auth, (req, res) => {
  res.send(req.user);
});

const encrypt = (val) => {
  cipher = crypto.createCipheriv(
    "aes-256-cbc",
    process.env.KEY,
    process.env.IV
  );
  var encrypted = cipher.update(val, "utf8", "hex");
  encrypted += cipher.final("hex");
  return val.length + "," + encrypted;
};

router.post("/inputnote", auth, async (req, res) => {
  let note = req.body;
  if (!note.title || !note.content) {
    return res.status(422).json({ error: "Please fill all the fields" });
  }
  try {
    const exist = await User.findOne({ _id: req.user._id });
    if (!exist) {
      res.status(400).json({ msg: "Something went wrong" });
    } else {
      note.title = encrypt(note.title);
      note.content = encrypt(note.content);

      exist.notes.push(note);
      await exist.save();
      return res.status(201).json({ msg: "Note saved successfully" });
    }
  } catch (error) {
    console.log(error);
  }
});

//Notes route

const decrypt = (val) => {
  decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    process.env.KEY,
    process.env.IV
  );
  decipher.setAutoPadding(false);
  var decrypted = decipher.update(val, "hex", "utf8");
  return (decrypted += decipher.final("utf8"));
};

router.get("/notes", auth, (req, res) => {
  const notes = req.user.notes.map((notesItem) => {
    const encryptedTitle = notesItem.title.split(",");
    decrypted = decrypt(encryptedTitle[1].toString());
    notesItem.title = decrypted.slice(0, encryptedTitle[0]);

    const encryptedContent = notesItem.content.split(",");
    decrypted = decrypt(encryptedContent[1].toString());
    notesItem.content = decrypted.slice(0, encryptedContent[0]);

    return notesItem;
  });

  res.send(notes);
});

router.post("/notes", (req, response) => {
  const { id } = req.body;
  User.findOne({ "notes._id": id }, (err, result) => {
    result.notes.id(id).remove();
    result.save();
  })
    .then((res) => {
      response.redirect(201, "/notes");
    })
    .catch((error) => {
      console.log(error);
    });
});

// Logout route

router.get("/logout", function (req, res, next) {
  res.clearCookie("jwtoken");
  res.status(200).send("logged out");
});

router.get("/auth", auth, (req, res) => {
  res.send(req.user._id);
});
module.exports = router;
