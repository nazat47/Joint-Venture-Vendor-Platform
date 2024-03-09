const express = require("express");
const Product = require("../models/product");
const Shop = require("../models/shop");
const fs = require("fs");
const Order = require("../models/order");
const { BadRequest, NotFound } = require("../errors");

const createProduct = async (req, res) => {
  const { shopId } = req.body;
  const shop = await Shop.findById(shopId);
  if (!shop) {
    throw new BadRequest("Shop not found");
  }
  if (req.body.category === "Choose a category") {
    throw new BadRequest("Please select a category");
  }
  const productData = req.body;
  productData.images = req.body.images;
  productData.shop = shop;
  const prod = await Product.create(productData);
  if (!prod) {
    throw new BadRequest("Unable to create product");
  }
  return res.status(201).json(prod);
};

const getProducts = async (req, res) => {
  const { shopId } = req.params;
  const products = await Product.find({ shopId });
  if (!products) {
    throw new NotFound("No products found");
  }
  return res.status(200).json(products);
};
const getAllProducts = async (req, res) => {
  const products = await Product.find({}).sort({ createdAt: -1 });
  if (!products) {
    throw new NotFound("No products found");
  }
  return res.status(200).json(products);
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const products = await Product.findById(id);
  if (!products) {
    throw new NotFound("No products found");
  }
  const delProd = await Product.findOneAndDelete({ _id: id });
  if (!delProd) {
    throw new NotFound("Product not found");
  }
  return res.status(200).json({ message: "Product Deleted" });
};

const reviewProduct = async (req, res) => {
  try {
    const { user, rating, message, productId, userId, orderId } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      throw new NotFound("Product not found");
    }
    const isReviewed = product.review.find((rev) => rev.user._id === userId);
    if (isReviewed) {
      isReviewed.rating = rating;
      isReviewed.message = message;
    } else {
      product.review.push({ user, rating, message, productId });
    }
    let ratingSum = 0;
    product.review.forEach((rev) => {
      ratingSum += rev.rating;
    });
    product.ratings = ratingSum / product.review.length;
    await product.save({ validateBeforeSave: false });
    await Order.findByIdAndUpdate(
      orderId,
      { $set: { "cart.$[elem].isReviewed": true } },
      { arrayFilters: [{ "elem._id": productId }], new: true }
    );
    return res.status(200).json({ message: "Reviewed successfully" });
  } catch (error) {
    throw new BadRequest(error);
  }
};

module.exports = {
  reviewProduct,
  getAllProducts,
  createProduct,
  getProducts,
  deleteProduct,
};
