const CustomError = require("../errors");

const checkPermission = (requestUser, resourceUserId) => {
  if (requestUser.role === "admin") return;
  if (requestUser.userid === resourceUserId.toString()) return;
  throw new CustomError.Unauthorized("Not authorized to access");
};
module.exports = checkPermission;
