const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const { getPost, getPosts, getTimelinePosts, getUserPosts, updatePost, likeAndUnlikePost, addPost, deletePost, getAllUserPosts, savePost, getSavedPosts } = require('../controllers/postsController')
const { addComment, updateComment, deleteComment } = require('../controllers/commentsController');
const store = require('../middleware/multer');


router.post("/add-post", protect, store.single('file'), addPost);
router.route
    .get("/saved-posts", protect, getSavedPosts)
    .post("/saved-posts/:postId", protect, savePost);

router.get("/all-posts", getPosts);
router.get("/timeline/:userId", protect, getTimelinePosts);
router.get("/user/:userId/all-posts", getAllUserPosts);
router.post("/comment", protect, addComment);
router.put("/comment", protect, updateComment);
router.delete("/comment", protect, deleteComment);

router.put("/:id/like", protect, likeAndUnlikePost);
router.get("/:id", protect, getPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);

module.exports = router;