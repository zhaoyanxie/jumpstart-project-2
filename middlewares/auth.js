const authFunction = (req, res, next) => {
    
  if (req.user.isAdmin) {
    next();
  } else {
    const error = new Error("User is not an admin");
    error.status = 401;
    next(error);
  }
};
module.exports = authFunction;
