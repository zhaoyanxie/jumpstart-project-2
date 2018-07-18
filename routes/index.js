const express = require("express");
const jwt = require("jsonwebtoken");
const { jwtOptions } = require("../config/passport");
const User = require("../models/user");
const seedUserLocation = require("../utils/seedUserLocation");

const router = express.Router();

router.use(express.json());

/* GET home page which populates the users with their locations */
router.get("/", async (req, res, next) => {
  const users = await User.find();
  const displayUsernameAndLocation = [];
  users.forEach(user => {
    if (!user.isAdmin && user.isAvailable) {
      const usernameAndLocation = {
        username: user.username,
        location: user.geoLocation
      };
      displayUsernameAndLocation.push(usernameAndLocation);
    }
  });
  res.json(displayUsernameAndLocation);
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username: username });

  if (!user) {
    res.status(401).json({ message: "no such user found" });
  } else if (user.validPassword(password)) {
    const userId = { id: user.id };
    const token = jwt.sign(userId, jwtOptions.secretOrKey);

    // seed user location here:
    user.isAvailable = true;
    user.geoLocation = seedUserLocation();
    user.save();

    res.json({ message: "Logged in successfully", token: token });
  } else {
    res.status(401).json({ message: "password does not match" });
  }
});

module.exports = app => {
  app.use("/", router);
};
