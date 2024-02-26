const jwt = require("jsonwebtoken");

const createToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};
const validateToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

const activateAccount = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: "5m",
  });
};
const attachCookies = (res, user) => {
  const token = createToken(user);
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    sameSite:'strict',
    signed:true,
  });
};
const attachShopCookies = (res, user) => {
  const token = createToken(user);
  res.cookie("shopToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    signed: true,
  });
};
module.exports = {
  createToken,
  attachCookies,
  validateToken,
  activateAccount,
  attachShopCookies,
};
