const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { jwtOptions } = require("../config/passport");
const { passport } = require("../config/passport");
const seedUserLocation = require("../utils/seedUserLocation");

const router = express.Router();
router.use(express.json());
router.use(passport.initialize());

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

router.get(
  "/:username",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    const userLoggedIn = req.user;

    if (userLoggedIn.username === req.params.username || userLoggedIn.isAdmin) {
      const user = await User.findOne({ username: req.params.username });
      res.status(401).json(user);
    } else {
      res.json({
        message:
          "You do not have the permission to view the details of other users"
      });
    }

    console.log("user logged in as", userLoggedIn.isAdmin);
  }
);

// router.get("/location", async (req, res, next) => {
//   res.json(seedUserLocation());
// });

module.exports = app => {
  app.use("/users", router);
};
