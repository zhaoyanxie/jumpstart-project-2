const express = require("express");
const User = require("../models/user");
const { passport } = require("../config/passport");

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

router.put(
  "/:username",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    const userLoggedIn = req.user;
    if (userLoggedIn.username === req.params.username || userLoggedIn.isAdmin) {
      const user = await User.findOne({ username: req.params.username });
      if (user) {
        const { username, password } = req.body;
        let display = { message: "" };
        // update user usernames
        if (username) {
          display.message += `Username changed successfully from ${
            user.username
          } `;
          user.username = username;
          display.message += `to ${user.username}.
          `;
        }
        if (password) {
          user.setPassword(password);
          display.message += `Password changed successfully to ${password}.`;
        }
        await user.save();

        res.json(display);
      } else {
        const error = new Error(`${req.params.username} is not found`);
        next(error);
      }
    } else {
      res.status(401).json({
        message:
          "You do not have the permission to view the details of other users"
      });
    }
  }
);

router.put(
  "/:username/logout",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    const userLoggedIn = req.user;
    if (userLoggedIn.username === req.params.username || userLoggedIn.isAdmin) {
      const user = await User.findOne({ username: req.params.username });
      if (user) {
        console.log("====>", req.user.isAvailable);
        userLoggedIn.isAvailable = false;
        await userLoggedIn.save();
        let display = { message: "user logged out successfully" };
        res.json(display);
      } else {
        const error = new Error(`${req.params.username} is not found`);
        next(error);
      }
    } else {
      res.status(401).json({
        message:
          "You do not have the permission to view the details of other users"
      });
    }
  }
);

router.get("/:username/location", async (req, res, next) => {
  const user = await User.find({ username: req.params.username });
  const usernameAndLocation = {
    location: user[0].geoLocation
  };
  res.json(usernameAndLocation);
});

module.exports = app => {
  app.use("/users", router);
};
