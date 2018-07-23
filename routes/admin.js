const express = require("express");
const User = require("../models/user");
const { passport } = require("../config/passport");
const router = express.Router();
router.use(express.json());
router.use(passport.initialize());
const auth = require("../middlewares/auth");
const tokenFunction = require("./../tokenFunction");
router.post(
  "/assign",

  async (req, res, next) => {
    const { username, password } = req.body;
    const user = new User({
      username,
      isAdmin: true
    });
    user.setPassword(password);
    try {
      await user.save();
      res.json({ user });
    } catch (err) {
      next(err);
    }
  }
);

router.get("/users", async (req, res, next) => {
  const users = await User.find();
  res.json(users);
});

router.delete("/:idToDelete", auth, async (req, res, next) => {
  try {
    await User.findByIdAndRemove(req.params.idToDelete);
    res.json({ message: `user ${req.params.idToDelete} has been deleted` });
  } catch (error) {
    next(error);
  }
});

module.exports = app => {
  app.use("/admin", tokenFunction, auth, router);
};
