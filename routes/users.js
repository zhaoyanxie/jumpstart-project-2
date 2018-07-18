const express = require("express");
const User = require("../models/user");
// const jwt = require("jsonwebtoken");
// const { jwtOptions } = require("../config/passport");
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

// TODO: test this route
router.put(
  "/:username",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const userLoggedIn = req.user;
      if (
        userLoggedIn.username === req.params.username ||
        userLoggedIn.isAdmin
      ) {
        const user = await User.findOne({ username: req.params.username });
        if (user) {
          const { username, password } = req.body;
          // update user usernames
          if (username) user.username = username;
          if (password) user.setPassword(password);
          await user.save();

          res.status(401).json(user);
        } else {
          const error = new Error(`User ${req.params.username} is not found`);
          next(error);
        }
      } else {
        res.json({
          message:
            "You do not have the permission to view the details of other users"
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

// router.get("/location", async (req, res, next) => {
//   res.json(seedUserLocation());
// });

module.exports = app => {
  app.use("/users", router);
};
