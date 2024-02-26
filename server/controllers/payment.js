const express = require("express");
const { Unauthenticated, BadRequest, NotFound } = require("../errors");
const stripe = require("stripe")(process.env.STRIPE_KEY);

const createStripePayment = async (req, res) => {
  const { amount } = req.body;
  const myPayment = await stripe.paymentIntents.create({
    amount:2000,
    currency: "inr",
    metadata: {
      company: "Naz",
    },
  });
  res
    .status(200)
    .json({ success: true, client_secret: myPayment.client_secret });
};

const getStripeApiKey = async (req, res) => {
  res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
};

module.exports = { createStripePayment, getStripeApiKey };
