const router = require('express').Router();
const { addConversation, getUserConversation, getTwoUsersConversation } = require('../controllers/conversationController.js')


router.post("/", addConversation);
router.get("/:userId", getUserConversation);
router.get("/find/:firstUserId/:secondUserId", getTwoUsersConversation);

module.exports = router;