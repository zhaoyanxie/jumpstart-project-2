const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { jwtOptions } = require("../config/passport");
const { passport } = require("../config/passport");

const router = express.Router();
router.use(express.json());
router.use(passport.initialize());

router.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    const users = await User.find();
    res.json(users);
  }
);

router.delete(
  "/:idToDelete",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    if (req.user.isAdmin) {
      try {
        const users = await User.findByIdAndRemove(req.params.idToDelete);
        console.log("**********", users);
        res.json({ message: "sdkjfhasdfl" });
      } catch (error) {
        res.json({ message: "User not found" });
      }
    } else {
      const error = new Error("User is not an admin");
      error.status = 401;
      next(error);
    }
  }
);

module.exports = app => {
  app.use("/admin", router);
};
