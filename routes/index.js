const express = require("express");

const router = express.Router();

router.use(express.json());

/* GET home page. */
router.get("/", (req, res, next) => {
  res.json({ message: "Welcome to my taxi app (backend)!" });
});

module.exports = app => {
  app.use("/", router);
};
