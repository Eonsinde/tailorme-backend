const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const { getPost, getPosts, getTimelinePosts, getUserPosts, updatePost, likeAndUnlikePost, addPost, deletePost, addSavedPost, getAllUserPosts, getSavedPost } = require('../controllers/postsController')
const { addComment, updateComment, deleteComment } = require('../controllers/commentsController');

router.post("/add-post", protect, addPost);
router.post("/saved-posts", protect, addSavedPost);
router.get("/saved-posts", protect, getSavedPost)
router.get("/all-posts", getPosts);
router.get("/timeline/:userId", protect, getTimelinePosts);
router.get("/user/all-posts", protect, getUserPosts);
router.post("/comment", protect, addComment);
router.get("/:userId", getAllUserPosts)
router.delete("/comment", protect, deleteComment);

router.get("/:id", protect, getPost);
router.put("/:id/like", protect, likeAndUnlikePost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);
router.put("/comment", protect, updateComment);

module.exports = router;