const express = require("express");
const { authenticateUser } = require("../middlewares/authentication");
const { createWithdraw, getAllWithdraw, updateWithdraw } = require("../controllers/withdraw");
const router = express.Router();

router.post("/create", createWithdraw);
router.get("/getAll", getAllWithdraw);
router.patch("/update/:id", updateWithdraw);
module.exports = router;
