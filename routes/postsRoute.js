const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const { getPost, getPosts, getTimelinePosts, getUserPosts, updatePost, likeAndUnlikePost, addPost, deletePost, addSavedPost, getAllUserPosts, getSavedPost } = require('../controllers/postsController')
const { addComment, updateComment, deleteComment } = require('../controllers/commentsController');

router.post("/add-post", protect, addPost);
router.put("/save-post/:id", protect, addSavedPost);
router.get("/all-posts", getPosts);
router.get("/timeline/:userId", protect, getTimelinePosts);
router.get("/user/all-posts", protect, getUserPosts);
router.post("/comment", protect, addComment);
router.put("/comment", protect, updateComment);
router.delete("/comment", protect, deleteComment);

router.put("/:id/like", protect, likeAndUnlikePost);
router.get("/:userId", getAllUserPosts);
router.get("/:id", protect, getPost);
router.put("/:id/like", protect, likeAndUnlikePost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);

module.exports = router;