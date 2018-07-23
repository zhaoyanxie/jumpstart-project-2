const { passport } = require("./config/passport");
const tokenFunction = () => {
  passport.authenticate("jwt", { session: false });
};

module.exports = tokenFunction;
