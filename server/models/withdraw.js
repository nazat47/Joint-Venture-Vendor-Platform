const mongoose = require("mongoose");

const withdrawSchema = new mongoose.Schema(
  {
    shop: {
      type: Object,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "processing",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Withdraw", withdrawSchema);
