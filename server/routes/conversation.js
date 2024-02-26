const express = require("express");
const { authenticateUser } = require("../middlewares/authentication");
const {
  createConversation,
  getConversations,
  updateLastMessage,
} = require("../controllers/conversation");
const router = express.Router();

router.post("/create", createConversation);
router.get("/getAll/:id", getConversations);
router.patch("/updateLastMessage/:id", updateLastMessage);

module.exports = router;
