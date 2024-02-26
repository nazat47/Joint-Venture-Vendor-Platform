const express = require("express");
const {
  createStripePayment,
  getStripeApiKey,
} = require("../controllers/payment");
const router = express.Router();

router.post("/create", createStripePayment);
router.get("/getstripeapikey", getStripeApiKey);
module.exports = router;
