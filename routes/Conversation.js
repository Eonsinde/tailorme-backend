const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const { addConversation, getUserConversation, getTwoUsersConversation } = require('../controllers/conversation.js')

router.post("/", addConversation);
router.get("/:userId", getUserConversation);
router.get("/find/:firstUserId/:secondUserId", getTwoUsersConversation);

module.exports = router;