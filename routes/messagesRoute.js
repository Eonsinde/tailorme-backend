const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const { addMessage, getMessages } = require('../controllers/messageController.js')

router.post("/", addMessage);
router.get("/:conversationId", getMessages);

module.exports = router;