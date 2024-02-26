const express = require("express");
const { Unauthenticated, BadRequest, NotFound } = require("../errors");
const Product = require("../models/product");
const Order = require("../models/order");
const Shop = require("../models/shop");
const { checkPermission } = require("../utils");

const createOrder = async (req, res) => {
  const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;
  const shopItemsMap = new Map();
  for (const item of cart) {
    const shopId = item.shopId;
    if (!shopItemsMap.has(shopId)) {
      shopItemsMap.set(shopId, []);
    }
    shopItemsMap.get(shopId).push(item);
  }
  const orders = [];

  for (const [shopId, items] of shopItemsMap) {
    const order = await Order.create({
      cart: items,
      shippingAddress,
      user,
      totalPrice,
      paymentInfo,
    });
    orders.push(order);
  }
  return res.status(201).json(orders);
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find({}).sort({ deliveredAt: -1, createdAt: -1 });
  if (!orders) {
    throw new NotFound("No orders found");
  }
  res.status(200).json(orders);
};

const getUserAllOrders = async (req, res) => {
  const { userId } = req.params;
  const orders = await Order.find({ "user._id": userId }).sort({
    createdAt: -1,
  });
  if (!orders) {
    throw new NotFound("No orders found");
  }
  res.status(200).json(orders);
};

const getShopAllOrders = async (req, res) => {
  const { shopId } = req.params;
  const orders = await Order.find({ "cart.shopId": shopId }).sort({
    createdAt: -1,
  });
  if (orders.length === 0) {
    throw new NotFound("No orders found");
  }
  res.status(200).json(orders);
};

const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = await Order.findById(id);
  if (!order) {
    throw new BadRequest("Order not found");
  }
  if (order.status === "Delivered") {
    throw new BadRequest("Status unchanged");
  }
  if (status === "Transfered to delivery partner") {
    order.cart.forEach(async (item) => {
      const product = await Product.findByIdAndUpdate(
        item._id,
        {
          $inc: { stock: -item.qty, soldOut: item.qty },
        },
        { new: true }
      );
      if (!product) {
        throw new BadRequest("Order not found");
      }
    });
  }
  order.status = status;
  if (status === "Delivered") {
    order.deliveredAt = Date.now();
    order.paymentInfo.status = "succeeded";
    const shop = await Shop.findById(order.cart[0]?.shopId);
    shop.availableBalance += order.totalPrice;
    await shop.save();
  }
  await order.save({ validateBeforeSave: false });
  res.status(200).json(order);
};

const refundOrder = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = await Order.findById(id);
  if (!order) {
    throw new BadRequest("Order not found");
  }
  order.status = status;
  await order.save({ validateBeforeSave: false });
  res.status(200).json(order);
};

const acceptRefund = async (req, res) => {
  const { id } = req.params;
  const { status, role } = req.body;
  if (role !== "seller") {
    throw new BadRequest("Not authorized to perform the action");
  }
  const order = await Order.findById(id);
  if (!order) {
    throw new BadRequest("Order not found");
  }
  if (status === "Refund success") {
    order?.cart?.forEach(async (item) => {
      const product = await Product.findByIdAndUpdate(
        item._id,
        {
          $inc: { stock: item.qty, soldOut: -item.qty },
        },
        { new: true }
      );
      if (!product) {
        throw new BadRequest("Order not found");
      }
    });
  }
  order.status = status;
  await order.save({ validateBeforeSave: false });
  res.status(200).json(order);
};

module.exports = {
  getAllOrders,
  acceptRefund,
  refundOrder,
  createOrder,
  getUserAllOrders,
  getShopAllOrders,
  updateOrderStatus,
};
