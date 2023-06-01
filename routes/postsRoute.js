const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const { getPost, getPosts, getTimelinePosts, getUserPosts, updatePost, likeAndUnlikePost, addPost, deletePost, addSavedPost, getAllUserPosts, getSavedPost } = require('../controllers/postsController')
const { addComment, updateComment, deleteComment } = require('../controllers/commentsController');
const store = require('../middleware/multer');


router.post("/add-post", protect, store.single('file'), addPost);
router.post("/saved-posts", protect, addSavedPost);

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