const Shop = require("../models/shop");
const Coupon = require("../models/coupon");
const { BadRequest, NotFound } = require("../errors");

const createCoupon = async (req, res) => {
  const { name } = req.body;

  const couponExists = await Coupon.findOne({ name });
  if (couponExists) {
    throw new BadRequest("Coupon already exists");
  }
  const coupon = await Coupon.create(req.body);
  if (!coupon) {
    throw new BadRequest("Unable to create coupon");
  }
  return res.status(201).json({ message: "Coupon created" });
};

const getCoupon = async (req, res) => {
  const { id } = req.params;
  const shop = await Shop.findById(id);
  if (!shop) {
    throw new BadRequest("Shop not found");
  }
  const coupon = await Coupon.find({ shopId: id });
  if (!coupon) {
    throw new NotFound("No coupon found");
  }
  return res.status(200).json(coupon);
};

const deleteCoupon = async (req, res) => {
  const { id } = req.params;

  const delCoupon = await Coupon.findOneAndDelete({ _id: id });
  if (!delCoupon) {
    throw new NotFound("Coupon not found");
  }

  return res.status(200).json({ message: "Coupon Deleted" });
};

const getCouponValue = async (req, res) => {
  const { name } = req.params;
  const coupon = await Coupon.findOne({ name: name });
  if (!coupon) {
    throw new NotFound("Coupon not found");
  }
  res.status(200).json(coupon);
};

module.exports = { createCoupon, getCoupon, deleteCoupon, getCouponValue };
