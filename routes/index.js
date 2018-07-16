const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { jwtOptions } = require("../config/passport");

const router = express.Router();

router.use(express.json());

/* GET home page. */
router.get("/", (req, res, next) => {
  res.json({ message: "Welcome to my taxi app (backend)!" });
});

// TODO: copy and paste the code below to new files
// router.get("/users", async (req, res, next) => {
//   const users = await User.find();
//   res.json(users);
// });

module.exports = app => {
  app.use("/", router);
};
