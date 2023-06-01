const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const { getPost, getPosts, getTimelinePosts, getUserPosts, updatePost, likeAndUnlikePost, addPost, deletePost, addSavedPost, getAllUserPosts, getSavedPost } = require('../controllers/postsController')
const { addComment, updateComment, deleteComment } = require('../controllers/commentsController');

router.post("/add-post", protect, addPost);
router.post("/saved-posts", protect, addSavedPost);
router.get("/all-posts", getPosts);
router.get("/timeline/:userId", protect, getTimelinePosts);
router.get("/user/all-posts", protect, getUserPosts);
router.post("/comment", protect, addComment);
<<<<<<< HEAD
router.put("/comment", protect, updateComment);
=======
router.get("/:userId", getAllUserPosts)
>>>>>>> 0d3838b2dd27088e4a79ed5dc2d8f91b4c9ce8f4
router.delete("/comment", protect, deleteComment);

router.put("/:id/like", protect, likeAndUnlikePost);
router.get("/:userId", getAllUserPosts);
router.get("/:id", protect, getPost);
router.put("/:id/like", protect, likeAndUnlikePost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);
<<<<<<< HEAD
=======
router.put("/comment", protect, updateComment);
>>>>>>> 0d3838b2dd27088e4a79ed5dc2d8f91b4c9ce8f4

module.exports = router;