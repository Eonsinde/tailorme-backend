const router = require('express').Router();
const { registerUser, loginUser, getUser, updateUser, getUserFriends, followUser, unFollowUser } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.route("/me")
    .get(protect, getUser)
    .put(protect, updateUser);

router.get('/friends/:userId', protect, getUserFriends)
router.put('/:id/follow', protect, followUser)
router.put('/:id/unfollow', protect, unFollowUser)

module.exports = router;
