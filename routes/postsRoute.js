const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const { getPost, getTimelinePosts, getUserPosts, updatePost, likeAndUnlikePost, addPost, deletePost } = require('../controllers/postsController')

router.post("/", protect, addPost);
router.get("/:id", protect, getPost);
router.get("/timeline/:userId", protect, getTimelinePosts);
router.get("/profile/:username", protect, getUserPosts);
router.put(":id/like", protect, likeAndUnlikePost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);

module.exports = router;