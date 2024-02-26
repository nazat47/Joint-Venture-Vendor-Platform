const path = require("path");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { BadRequest, Unauthenticated, NotFound } = require("../errors");
const fs = require("fs");
const {
  activateAccount,
  validateToken,
  attachCookies,
  createTokenUser,
} = require("../utils");
const sendMail = require("../utils/send-mail");

const createUser = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // const userExists = await User.findOne({ email });
    // if (!req.file) {
    //   throw new BadRequest("Please insert picture");
    // }
    // const filename = req.file.filename;
    // if (userExists) {
    //   const filePath = `uploads/${filename}`;
    //   fs.unlink(filePath, (err) => {
    //     if (err) {
    //       console.log(err);
    //       res.status(500).json({ msg: "error deleting file" });
    //     }
    //   });
    //   throw new BadRequest("Account already exists");
    // }
    // const fileUrl = path.join(filename);
    const create = {
      username: name,
      email: email,
      password: hashedPassword,
      avatar: avatar,
    };
    const tokenUser = createTokenUser(create);
    const activationToken = activateAccount(tokenUser);
    const activationUrl = `https://joint-venture-vendor-platform.vercel.app/activation/${activationToken}`;
    try {
      await sendMail({
        email: create.email,
        subject: "Activate your accuont",
        text: `Hello ${create.username}, please click the link to activate your account: ${activationUrl}`,
      });
      res.status(200).json({
        message: "Please check your email to activate your account",
      });
    } catch (error) {
      throw new BadRequest("Verification failed");
    }
    return res.status(201).json(create);
  } catch (error) {
    throw new BadRequest(error.message);
  }
};
const userActivation = async (req, res) => {
  const { token } = req.body;
  const tokenVerify = validateToken(token);
  if (!tokenVerify) {
    throw new BadRequest("Verification failed");
  }
  const { username, email, password, avatar } = tokenVerify;
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new BadRequest("Account already exists");
  }
  const newUser = await User.create({ username, email, password, avatar });
  const tokenUser = createTokenUser(newUser);
  return res.status(201).json(newUser);
};
const userLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequest("Please insert your email and password");
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new BadRequest("Email not found");
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Unauthenticated("Password is not correct");
  }
  const tokenUser = createTokenUser(user);
  attachCookies(res, tokenUser);
  const { password: pass, ...rest } = user._doc;
  req.user = rest;
  console.log(req.user);
  return res.status(200).json(rest);
};
const getUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    throw new BadRequest("User not found");
  }
  res.status(200).json(user);
};

const getAllUsers = async (req, res) => {
  const user = await User.find({});
  if (!user) {
    throw new BadRequest("User not found");
  }
  res.status(200).json(user);
};

const userUpdate = async (req, res) => {
  const { username, email, phone } = req.body;
  if (username === "" || email === "" || phone === "") {
    throw new BadRequest("please insert the required fields");
  }
  const userExists = await User.findOne({ email }).select("+password");
  if (!userExists) {
    throw new NotFound("Something went wrong");
  }
  const updateUser = await User.findOneAndUpdate(
    { email },
    { username, email, phone },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updateUser) {
    throw new BadRequest("Update failed");
  }
  return res.status(201).json(updateUser);
};

const updateUserAvatar = async (req, res) => {
  const { id, avatar } = req.body;
  const isExist = await User.findOne({ _id: id });
  if (!isExist) {
    throw new NotFound("User not found");
  }
  const updateAvatar = await User.findByIdAndUpdate(
    id,
    { avatar },
    { new: true, runValidators: true }
  );
  if (!updateAvatar) {
    throw new BadRequest("Unable to update picture");
  }
  return res.status(201).json(updateAvatar);
};

const updateUserAddress = async (req, res) => {
  const {
    userId,
    _id,
    country,
    city,
    address1,
    address2,
    zipCode,
    addressType,
  } = req.body;
  const user = await User.findById(userId);
  const sameTypeAddress = await user.addresses.find(
    (address) => address.addressType === addressType
  );
  if (sameTypeAddress) {
    throw new BadRequest("Address type already exists");
  }
  const existsAddress = user.addresses.find(
    (address) => address._id === req.body._id
  );

  if (existsAddress) {
    Object.assign(existsAddress, req.body);
  } else {
    user.addresses.push({
      country,
      city,
      address1,
      address2,
      zipCode,
      addressType,
    });

    await user.save();
    res.status(200).json(user);
  }
};

const deleteUserAddress = async (req, res) => {
  const { userId } = req.body;
  const { id } = req.params;
  if (userId === "" || id === "") {
    throw new BadRequest("please insert the fields");
  }
  await User.updateOne({ _id: userId }, { $pull: { addresses: { _id: id } } });
  const user = await User.findById(userId);
  res.status(200).json(user);
};

const updateUserPassword = async (req, res) => {
  const { id, newPassword, oldPassword, confirmPassword } = req.body;
  if (newPassword === "" || oldPassword === "" || confirmPassword === "") {
    throw new BadRequest("Please insert all the fields");
  }
  const user = await User.findOne({ _id: id }).select("+password");
  if (!user) {
    throw new NotFound("User not found");
  }
  const isMatched = await user.comparePassword(oldPassword);
  if (!isMatched) {
    throw new BadRequest("Old password not correct");
  }
  if (newPassword !== confirmPassword) {
    throw new BadRequest("Passwords did not match");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  const newUser = await User.findByIdAndUpdate(
    id,
    { password: hashedPassword },
    { new: true, runValidators: true }
  );
  if (!newUser) {
    throw new BadRequest("Unable to update password");
  }
  res.status(200).json(newUser);
};

const userLogout = (req, res) => {
  try {
    res.cookie("token", null, {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    return res.status(200).json({ message: "user logged out" });
  } catch (error) {
    throw new Unauthenticated(
      "Action can not be performed, authentication failed"
    );
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    throw new BadRequest("User not found");
  }
  if (user.role === "admin") {
    throw new BadRequest("Unable to delete requested user");
  }
  const delUser = await User.findByIdAndDelete(id);
  res.status(200).json({ message: "user deleted successfully" });
};

module.exports = {
  deleteUser,
  getAllUsers,
  updateUserPassword,
  deleteUserAddress,
  updateUserAddress,
  updateUserAvatar,
  userUpdate,
  userLogout,
  createUser,
  userActivation,
  userLogin,
  getUser,
};
