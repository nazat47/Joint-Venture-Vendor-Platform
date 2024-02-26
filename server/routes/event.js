const express = require("express");
const uploadOptions = require("../multer");

const { authenticateUser } = require("../middlewares/authentication");
const {
  createEvent,
  getEvents,
  deleteEvent,
  getAllEvents,
} = require("../controllers/events");

const router = express.Router();

router.post("/create", uploadOptions.array("images"), createEvent);
router.get("/getAll/:shopId", getEvents);
router.get("/getAll", getAllEvents);
router.delete("/delete/:id", deleteEvent);
module.exports = router;
