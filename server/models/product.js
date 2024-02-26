const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your product name"],
    },
    description: {
      type: String,
      required: [true, "Please enter your product description"],
    },
    category: {
      type: String,
      required: [true, "Please enter your product category"],
    },
    tags: {
      type: String,
    },
    originalPrice: {
      type: Number,
    },
    discountPrice: {
      type: Number,
      required: [true, "Please enter your product discount price"],
    },
    stock: {
      type: Number,
      required: [true, "Please enter your product stock"],
    },
    images: [
      {
        type: String,
      },
    ],
    review: [
      {
        user: {
          type: Object,
        },
        rating: {
          type: Number,
        },
        message: {
          type: String,
        },
        productId: {
          type: String,
        },
        createdAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    ratings: {
      type: Number,
    },
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

module.exports = mongoose.model("Product", productSchema);
