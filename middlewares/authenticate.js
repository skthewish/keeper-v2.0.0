const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");

const Authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.jwtoken;

    const verifyToken = jwt.verify(token, process.env.SECRET);

    const verifiedUser = await User.findOne({
      _id: verifyToken._id,
      token: token,
    });

    if (!verifiedUser) {
      throw new Error("User not verified");
    }

    req.user = verifiedUser;
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthenticated user" });
  }
};

module.exports = Authenticate;
