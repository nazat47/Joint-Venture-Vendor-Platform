const express = require("express");
const { authenticateUser } = require("../middlewares/authentication");
const {
  createCoupon,
  getCoupon,
  deleteCoupon,
  getCouponValue,
} = require("../controllers/coupon");
const router = express.Router();

router.post("/create", createCoupon);
router.get("/getAll/:id", getCoupon);
router.delete("/delete/:id", deleteCoupon);
router.get("/get-coupon-value/:name", getCouponValue);

module.exports = router;
