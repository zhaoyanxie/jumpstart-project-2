const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { jwtOptions } = require("../config/passport");

const router = express.Router();
router.use(express.json());

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username: username });

  if (!user) {
    res.status(401).json({ message: "no such user found" });
  }

  if (user.validPassword(password)) {
    const userId = { id: user.id };
    const token = jwt.sign(userId, jwtOptions.secretOrKey);
    res.json({ message: "ok", token: token });
  } else {
    console.log("$$$$$$$");
    res.status(401).json({ message: "passwords did not match" });
  }
});

router.post("/signup", async (req, res, next) => {
  const { username, password } = req.body;
  const user = new User({
    username
  });
  user.setPassword(password);
  try {
    await user.save();
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

module.exports = app => {
  app.use("/users", router);
};
