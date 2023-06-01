const Post = require("../models/post");
const Comment = require("../models/comment");


// Add a comment
exports.addComment = async(req, res) => {
    try {
        const { postId, text } = req.body;
        const post = await Post.findById(postId)
        if(!post){
            return res.status(404).json("Post not Found!")
        }
        const newComment = new Comment({text, userId: req.user._id});
        const savedComment = await newComment.save();
        post.comments.push(savedComment._id);
        post.save();
        res.status(200).json(savedComment);
    } catch (err) {
        res.status(500).json(err);
    }
}

// Update a comment
exports.updateComment = async(req, res) => {
    try {
        const { commentId, text } = req.body
        const comment = await Comment.findByIdAndUpdate(commentId, text, {new: true});
        if(!comment){
            return res.status(404).json("you can update only your comment");
        }
        res.status(200).json("the post has been updated");
      } catch (err) {
        res.status(500).json(err);
    }
}

// Delete a comment
exports.deleteComment = async(req, res) => {
    try {
        const { commentId } = req.body;
        const comment = await Comment.findById(commentId);
        if(!comment){
            return res.status(403).json("you can delete only your comment");
        }
        await comment.deleteOne();
        res.status(200).json("the comment has been deleted");
      } catch (err) {
        res.status(500).json(err);
    }
}