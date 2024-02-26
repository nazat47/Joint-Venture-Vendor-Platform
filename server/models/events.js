const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your event name"],
    },
    description: {
      type: String,
      required: [true, "Please enter your event description"],
    },
    category: {
      type: String,
      required: [true, "Please enter your event product category"],
    },
    startDate: {
      type: Date,
      required: true,
    },
    finishDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      default: "running",
    },
    tags: {
      type: String,
    },
    originalPrice: {
      type: Number,
    },
    discountPrice: {
      type: Number,
      required: [true, "Please enter your event product price"],
    },
    stock: {
      type: Number,
      required: [true, "Please enter your event product stock"],
    },
    images: [
      {
        type: String,
      },
    ],
    shopId: {
      type: String,
      required: true,
    },
    shop: {
      type: Object,
      required: [true, "Enter shop details"],
    },
    soldOut: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Events", eventSchema);
