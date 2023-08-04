const express = require("express");
const {
  allMessages,
  sendMessage,
} = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// fetching message
router.route("/:chatId").get(protect, allMessages);
// sending message
router.route("/").post(protect, sendMessage);

module.exports = router;