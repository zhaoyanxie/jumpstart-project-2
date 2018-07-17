const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { jwtOptions } = require("../config/passport");
const { passport } = require("../config/passport");

const router = express.Router();
router.use(express.json());
router.use(passport.initialize());

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
    res.status(401).json({ message: "passwords did not match" });
  }
});

router.post("/signup", async (req, res, next) => {
  const { username, password, isAdmin } = req.body;
  const user = new User({
    username,
    isAdmin
  });
  user.setPassword(password);
  try {
    await user.save();
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

router.get(
  "/:username",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    const user = await User.findOne({ username: req.params.username });
    res.status(401).json(user);
  }
);

module.exports = app => {
  app.use("/users", router);
};
