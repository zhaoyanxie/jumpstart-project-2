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
    if (req.user.isAdmin) {
      const users = await User.find();
      res.json(users);
    } else {
      const error = new Error("User is not an admin");
      error.status = 401;
      next(error);
    }
  }
);

router.delete(
  "/:idToDelete",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    if (req.user.isAdmin === true) {
      try {
        await User.findByIdAndRemove(req.params.idToDelete);
        res.json({ message: `user ${req.params.idToDelete} has been deleted` });
      } catch (error) {
        next(error);
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
