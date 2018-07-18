const express = require("express");
const jwt = require("jsonwebtoken");
const { jwtOptions } = require("../config/passport");
const User = require("../models/user");
const router = express.Router();

router.use(express.json());

/* GET home page. */
router.get("/", (req, res, next) => {
  res.json({ message: "Welcome to my taxi app (backend)!" });
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username: username });
  
  if (!user) {
    res.status(401).json({ message: "no such user found" });
  } else if (user.validPassword(password)) {
    const userId = { id: user.id };
    const token = jwt.sign(userId, jwtOptions.secretOrKey);
    res.json({ message: "ok", token: token });
  } else {
    res.status(401).json({ message: "password does not match" });
  }
});

module.exports = app => {
  app.use("/", router);
};
