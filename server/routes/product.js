const express = require("express");
const uploadOptions = require("../multer");

const { authenticateUser } = require("../middlewares/authentication");
const {
  createProduct,
  getProducts,
  deleteProduct,
  getAllProducts,
  reviewProduct,
} = require("../controllers/product");

const router = express.Router();

router.post("/create", uploadOptions.array("images"), createProduct);
router.get("/getAll/:shopId", getProducts);
router.get("/getAllProducts", getAllProducts);
router.delete("/delete/:id", deleteProduct);
router.post("/review", reviewProduct);
module.exports = router;
