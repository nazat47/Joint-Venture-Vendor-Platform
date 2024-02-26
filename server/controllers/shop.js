const path = require("path");
const Shop = require("../models/shop");
const { BadRequest, Unauthenticated } = require("../errors");
const fs = require("fs");
const {
  activateAccount,
  validateToken,
  attachCookies,
  attachShopCookies,
} = require("../utils");
const sendMail = require("../utils/send-mail");
const { createTokenShop } = require("../utils/create-token-user");

const createShop = async (req, res) => {
  try {
    const { email, name, password, phone, address, zipCode,file } = req.body;
    const shopExists = await Shop.findOne({ email });
    const create = {
      name: name,
      email: email,
      password: password,
      avatar: file,
      address: address,
      zipCode: zipCode,
      phone: phone,
    };

    const tokenUser = createTokenShop(create);
    const activation = activateAccount(tokenUser);
    const activationUrl = `http://localhost:3000/seller/activation/${activation}`;
    try {
      await sendMail({
        email: create.email,
        subject: "Activate your shop accuont",
        text: `Hello ${create.name}, please click the link to activate your account: ${activationUrl}`,
      });
      res.status(200).json({
        message: "Please check your email to activate your shop account",
      });
    } catch (error) {
      throw new BadRequest("Verification failed");
    }
    return res.status(201).json(create);
  } catch (error) {
    throw new BadRequest(error.message);
  }
};
const shopActivation = async (req, res) => {
  const { token } = req.body;
  const tokenVerify = validateToken(token);
  console.log(tokenVerify);
  if (!tokenVerify) {
    throw new BadRequest("Verification failed");
  }
  const { name, email, password, avatar, address, zipCode, phone } =
    tokenVerify;
  let newPhone = Number(phone);
  const userExists = await Shop.findOne({ email });
  if (userExists) {
    throw new BadRequest("Account already exists");
  }
  const newUser = await Shop.create({
    name,
    email,
    password,
    avatar,
    address,
    zipCode,
    phone: newPhone,
  });
  const tokenUser = createTokenShop(newUser);
  attachCookies(res, tokenUser);
  return res.status(201).json(newUser);
};
const shopLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequest("Please insert your email and password");
  }
  const shop = await Shop.findOne({ email });
  if (!shop) {
    throw new BadRequest("shop account not found");
  }
  const isMatch = await shop.comparePassword(password);
  if (!isMatch) {
    throw new Unauthenticated("Password is not correct");
  }
  const tokenUser = createTokenShop(shop);
  attachShopCookies(res, tokenUser);
  const { password: pass, ...rest } = shop._doc;
  return res.status(200).json(rest);
};

const getAllShops = async (req, res) => {
  const shop = await Shop.find({}).sort({ createdAt: -1 });
  if (!shop) {
    throw new BadRequest("shop account not found");
  }
  res.status(200).json(shop);
};

const getShop = async (req, res) => {
  const { id } = req.params;
  const shop = await Shop.findById(id);
  if (!shop) {
    throw new BadRequest("shop account not found");
  }
  res.status(200).json(shop);
};
const shopLogout = (req, res) => {
  try {
    res.cookie("shopToken", null, {
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

const updateShopData = async (req, res) => {
  const { name, description, address, zipCode, phone, id } = req.body;
  if (name === "" || address === "" || zipCode === "" || phone === "") {
    throw new BadRequest("please insert the required fields");
  }
  const shopExists = await Shop.findOne({ _id: id });
  if (!shopExists) {
    throw new NotFound("Shop not found");
  }
  const updateShop = await Shop.findOneAndUpdate(
    { _id: id },
    { name, address, phone, zipCode, description },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updateShop) {
    throw new BadRequest("Update failed");
  }
  return res.status(201).json(updateShop);
};

const updateShopProfile = async (req, res) => {
  const { id, avatar } = req.body;
  const isExist = await Shop.findOne({ _id: id });
  if (!isExist) {
    throw new NotFound("Shop not found");
  }
  const updateAvatar = await Shop.findByIdAndUpdate(
    id,
    { avatar },
    { new: true, runValidators: true }
  );
  if (!updateAvatar) {
    throw new BadRequest("Unable to update picture");
  }
  return res.status(201).json(updateAvatar);
};

const deleteShop = async (req, res) => {
  const { id } = req.params;
  const shop = await Shop.findById(id);
  if (!shop) {
    throw new BadRequest("shop not found");
  }
  const delShop = await Shop.findByIdAndDelete(id);
  res.status(200).json({ message: "shop deleted successfully" });
};

const updateShopWithdraw = async (req, res) => {
  const { id } = req.params;
  const shop = await Shop.findById(id);
  if (!shop) {
    throw new BadRequest("shop not found");
  }
  // const withdrawExist = await shop.find({
  //   withdrawMethod: { bankName: req.body.bankName },
  // });
  // if (withdrawExist) {
  //   throw new BadRequest("Withdraw exists");
  // }
  const updateShop = await Shop.findByIdAndUpdate(
    id,
    { withdrawMethod: req.body },
    {
      new: true,
    }
  );
  if (!updateShop) {
    throw new BadRequest("Something went wrong");
  }
  return res.status(200).json(updateShop);
};

const deleteWithdrawMethod = async (req, res) => {
  const { id } = req.params;
  const shop = await Shop.findById(id);
  if (!shop) {
    throw new BadRequest("shop not found");
  }
  // const withdrawExist = await shop.find({
  //   withdrawMethod: { bankName: req.body.bankName },
  // });
  // if (withdrawExist) {
  //   throw new BadRequest("Withdraw exists");
  // }
  const updateShop = await Shop.findByIdAndUpdate(
    id,
    { withdrawMethod: null },
    {
      new: true,
    }
  );
  if (!updateShop) {
    throw new BadRequest("Something went wrong");
  }
  return res.status(200).json(updateShop);
};

module.exports = {
  deleteWithdrawMethod,
  updateShopWithdraw,
  deleteShop,
  getAllShops,
  updateShopData,
  updateShopProfile,
  shopLogout,
  getShop,
  createShop,
  shopActivation,
  shopLogin,
};
