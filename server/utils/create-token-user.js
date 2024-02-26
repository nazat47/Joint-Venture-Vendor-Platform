const createTokenUser = (user) => {
  return {
    userId: user._id,
    username: user.username,
    email: user.email,
    role: user.role || "",
    password: user.password,
    avatar: user.avatar || "",
  };
};
const createTokenShop = (user) => {
  return {
    userId: user._id,
    name: user.name,
    email: user.email,
    role: user.role || "",
    password: user.password,
    avatar: user.avatar || "",
    phone: user.phone,
    address: user.address,
    zipCode: user.zipCode,
  };
};
module.exports = { createTokenUser, createTokenShop };
