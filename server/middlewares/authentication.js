const CustomError = require("../errors");
const { validateToken } = require("../utils");

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) {
    throw new CustomError.Unauthenticated("Authentication failed");
  }
  try {
    const payload = validateToken(token);
    req.user = {
      userId: payload.userId,
      role: payload.role,
      username: payload.username,
    };
    next();
  } catch (error) {
    throw new CustomError.Unauthenticated("Authentication failed");
  }
};
const authorizePermission = (...roles) => {
  return (req, res, next) => {
    console.log(req.user.role,roles)
    if (!roles.includes(req.user.role)) {
      throw new CustomError.Unauthorized("Unauthorized to access this route");
    }
    next();
  };
};
module.exports = { authenticateUser, authorizePermission };
