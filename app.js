const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const { passport } = require("./config/passport");
const { handle404, handle500 } = require("./middlewares/error_handlers");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const secretRouter = require("./routes/secret");
const seedUserLocation = require("./utils/seedUserLocation");

const app = express();

const mongodb_uri = process.env.MONGODB_URI || "mongodb://localhost/jumpstart";
mongoose.connect(mongodb_uri);
const db = mongoose.connection;
db.on("error", error => {
  console.error("An error occurred!", error);
});

app.use(logger("dev"));
app.use(express.json());
app.use(passport.initialize());

indexRouter(app);
usersRouter(app);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// console.log("-->", seedUserLocation(2));

app.use(
  "/secret",
  passport.authenticate("jwt", { session: false }),
  secretRouter
);

app.use(handle404);
app.use(handle500);

module.exports = app;
