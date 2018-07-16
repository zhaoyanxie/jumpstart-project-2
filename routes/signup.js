const express = require("express");
const User = require("../models/user");

const router = express.Router();

router.post("/", async (req, res, next) => {
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
  app.use(express.json());
  app.use("/signup", router);
};
