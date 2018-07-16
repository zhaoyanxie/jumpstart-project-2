const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { jwtOptions } = require("../config/passport");

const router = express.Router();

// router.use(express.json());

/* GET home page. */
router.get("/", (req, res, next) => {
  res.json({ message: "Welcome to my taxi app (backend)!" });
});

router.get("/users", async (req, res, next) => {
  const users = await User.find();
  res.json(users);
});

router.post("/signin", async (req, res) => {
  const { username, password } = req.body; // username and pw from user's json request

  const user = await User.findOne({ username: username }); // find that user based on username

  if (!user) {
    // if user not found
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

module.exports = app => {
  app.use(express.json());
  app.use("/", router);
};
