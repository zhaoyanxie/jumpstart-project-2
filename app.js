const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const bodyParser = require("body-parser");

const { passport } = require("./config/passport");
const indexRouter = require("./routes/index");
const secretRouter = require("./routes/secret");

const app = express();

const mongodb_uri = process.env.MONGODB_URI || "mongodb://localhost/jumpstart";
mongoose.connect(mongodb_uri);
const db = mongoose.connection;
db.on("error", error => {
  console.error("An error occurred!", error);
});

app.use(logger("dev"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

indexRouter(app);

app.use(
  "/secret",
  passport.authenticate("jwt", { session: false }),
  secretRouter
);

module.exports = app;
