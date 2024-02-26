const express = require("express");
const { authenticateUser } = require("../middlewares/authentication");
const { createMessage, getAllMessages } = require("../controllers/messages");
const router = express.Router();

router.post("/create", createMessage);
router.get("/getAll/:id", getAllMessages);
module.exports = router;
