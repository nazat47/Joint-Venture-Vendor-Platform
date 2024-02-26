const Withdraw = require("../models/withdraw");
const Shop = require("../models/shop");
const { Unauthenticated, BadRequest, NotFound } = require("../errors");
const sendMail = require("../utils/send-mail");

const createWithdraw = async (req, res) => {
  const { id, amount } = req.body;
  const shop = await Shop.findById(id);
  if (!shop) {
    throw new BadRequest("shop not found");
  }
  const withdraw = await Withdraw.create({ shop, amount });
  if (!withdraw) {
    throw new BadRequest("Unable to create withdraw, try again later");
  }
  shop.availableBalance -= amount;
  await shop.save();
  try {
    await sendMail({
      email: shop.email,
      subject: "Withdraw request",
      text: `Hello ${shop.name}, your withdraw request of ${amount}$ is processing. It will take 4-7 days for processing`,
    });
    return res.status(200).json(withdraw);
  } catch (error) {
    throw new BadRequest("Something went wrong");
  }
};

const getAllWithdraw = async (req, res) => {
  const withdraws = await Withdraw.find({}).sort({ createdAt: 1 });
  if (!withdraws) {
    throw new NotFound("No withdraws found");
  }
  return res.status(200).json(withdraws);
};

const updateWithdraw = async (req, res) => {
  const { status, shopId } = req.body;
  const { id } = req.params;
  const updateWithdraw = await Withdraw.findByIdAndUpdate(
    id,
    { status, updatedAt: Date.now() },
    {
      new: true,
    }
  );
  if (!updateWithdraw) {
    throw new BadRequest("Can not update status");
  }
  const shop = await Shop.findById(shopId);
  if (!shop) {
    throw new BadRequest("shop not found");
  }
  transactions = {
    _id: updateWithdraw._id,
    amount: updateWithdraw.amount,
    status: updateWithdraw.status,
    updateAt: updateWithdraw.updatedAt,
  };
  shop.transactions = [...shop.transactions, transactions];
  await shop.save();
  try {
    await sendMail({
      email: shop.email,
      subject: "Payment confirmation",
      text: `Hello ${shop.name}, your withdraw request of ${updateWithdraw.amount}$ is succeeded`,
    });
  } catch (error) {
    throw new BadRequest("Something went wrong");
  }
  return res.status(200).json(updateWithdraw);
};

module.exports = { updateWithdraw, createWithdraw, getAllWithdraw };
