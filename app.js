const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const { passport } = require("./config/passport");
const { handle404, handle500 } = require("./middlewares/error_handlers");
const adminRouter = require("./routes/admin");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();


app.use(logger("dev"));
app.use(express.json());
app.use(passport.initialize());

adminRouter(app);
indexRouter(app);
usersRouter(app);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(handle404);
app.use(handle500);

module.exports = app;
