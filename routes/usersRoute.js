const router = require('express').Router();
const { 
    registerUser, 
    loginUser,
    getUserProfile, 
    getUserById, 
    updateUser, 
    getUserFriends, 
    followUser, 
    unFollowUser, 
    searchUsers 
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.route("/profile")
    .get(protect, getUserProfile)
    .put(protect, updateUser);
router.get("/search", protect, searchUsers);
router.route("/:id").get(getUserById);

router.get('/friends/:userId', protect, getUserFriends);
router.put('/:id/follow', protect, followUser);
router.put('/:id/unfollow', protect, unFollowUser);

module.exports = router;
