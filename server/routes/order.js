const express = require("express");
const {
  authenticateUser,
  authorizePermission,
} = require("../middlewares/authentication");
const {
  createOrder,
  getAllOrders,
  getShopAllOrders,
  updateOrderStatus,
  refundOrder,
  acceptRefund,
  getUserAllOrders,
} = require("../controllers/order");
const router = express.Router();

router.post("/create", createOrder);
router.get("/getAdminAll", getAllOrders);
router.get("/getAll/:userId", getUserAllOrders);
router.get("/getShopAll/:shopId", getShopAllOrders);
router.patch("/update/:id", updateOrderStatus);
router.patch("/refund/:id", refundOrder);
router.patch("/refund/accept/:id", acceptRefund);

module.exports = router;
