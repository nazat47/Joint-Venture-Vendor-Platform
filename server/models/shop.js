const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your shop name"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Please enter your email"],
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minLength: [7, "Password should have atleast 7 characters"],
    },
    phone: {
      type: Number,
    },
    address: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    withdrawMethod: {
      type: Object,
    },
    availableBalance: {
      type: Number,
      default:0,
    },
    transactions: [
      {
        amount: {
          type: Number,
          required: true,
        },
        status: {
          type: String,
          default: "processing",
        },
        createdAt: {
          type: Date,
          default: Date.now(),
        },
        updatedAt: {
          type: Date,
        },
      },
    ],
    role: {
      type: String,
      default: "seller",
    },
    avatar: {
      type: String,
    },
    description: {
      type: String,
    },
    resetPasswordToken: String,
    resetPasswordTime: String,
  },
  { timestamps: true }
);
shopSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
shopSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};
module.exports = mongoose.model("Shop", shopSchema);
