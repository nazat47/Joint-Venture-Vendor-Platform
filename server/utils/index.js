const checkPermission = require("./check-permission");
const { createTokenUser } = require("./create-token-user");
const {
  createToken,
  attachCookies,
  validateToken,
  activateAccount,
  attachShopCookies,
} = require("./jwt");

module.exports = {
  createToken,
  attachCookies,
  validateToken,
  checkPermission,
  createTokenUser,
  activateAccount,
  attachShopCookies,
};
