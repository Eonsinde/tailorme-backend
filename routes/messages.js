const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const { addMessage, getMessage } = require('../controllers/message.js')

router.post("/", addMessage);
router.get("/:conversationId", getMessage);

module.exports = router;