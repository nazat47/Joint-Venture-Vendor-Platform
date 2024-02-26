const express = require("express");
const uploadOptions = require("../multer");

const { authenticateUser } = require("../middlewares/authentication");
const {
  createShop,
  shopActivation,
  shopLogin,
  getShop,
  shopLogout,
  updateShopProfile,
  updateShopData,
  getAllShops,
  deleteShop,
  updateShopWithdraw,
  deleteWithdrawMethod,
} = require("../controllers/shop");
const router = express.Router();

router.post("/create", uploadOptions.single("file"), createShop);
router.post("/activation", shopActivation);
router.post("/login", shopLogin);
router.get("/getAll", getAllShops);
router.get("/get/:id", getShop);
router.get("/logout", shopLogout);
router.patch("/update-avatar", updateShopProfile);
router.patch("/update", updateShopData);
router.patch("/update-withdraw/:id", updateShopWithdraw);
router.patch("/delete-withdraw/:id", deleteWithdrawMethod);
router.delete("/delete/:id", deleteShop);

module.exports = router;
