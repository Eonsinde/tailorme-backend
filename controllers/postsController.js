const Post = require("../models/Post");
const { User } = require("../models/User");

// Add a post
exports.addPost = async(req, res) => {
  try {
      const userId = req.user._id;
      const newPost = new Post({...req.body, userId});
      const savedPost = await newPost.save();
      res.status(200).json(savedPost);
    } catch (err) {
      res.status(500).json(err);
    }
}

// Update a post
exports.updatePost = async(req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (post.userId === req.body.userId) {
        await post.updateOne({ $set: req.body });
        res.status(200).json("the post has been updated");
      } else {
        res.status(403).json("you can update only your post");
      }
    } catch (err) {
      res.status(500).json(err);
    }
}

// Delete a post
exports.deletePost = async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
          await post.deleteOne();
          res.status(200).json("the post has been deleted");
        } else {
          res.status(403).json("you can delete only your post");
        }
      } catch (err) {
        res.status(500).json(err);
    }
}

// Like and dislike a post
exports.likeAndUnlikePost = async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
          await post.updateOne({ $push: { likes: req.body.userId } });
          res.status(200).json("The post has been liked");
        } else {
          await post.updateOne({ $pull: { likes: req.body.userId } });
          res.status(200).json("The post has been disliked");
        }
      } catch (err) {
        res.status(500).json(err);
    }
}

// Get a post
exports.getPost = async(req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('comments');
        res.status(200).json(post);
      } catch (err) {
        res.status(500).json(err);
    }
}

// Get all User's post
exports.getAllUserPosts = async(req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId)
    if(!user){
      return res.status(404).json("No User Found!")
    }
      const posts = await Post.find({userId: user._id}).populate('comments');  
      res.status(200).json(posts);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
  }
}

// Get timeline posts
exports.getTimelinePosts = async(req, res) => {
    try {
      const currentUser = await User.findById(req.params.userId);
      const userPosts = await Post.find({ userId: currentUser._id }).populate('comments');
      const friendPosts = await Promise.all(
        currentUser.followings.map((friendId) => {
          return Post.find({ userId: friendId }).populate([{
            path: "comments",
            model: "Comment"
          }, {
            path: "userId",
            model: "User",
            select: {"username": 1, "displayName": 1, "profilePicture": 1, "_id": 1}
          }])
        })
      );
      res.status(200).json(userPosts.concat(...friendPosts));
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
}

// Get User's all posts
exports.getUserPosts = async(req, res) => {
    try {
        const user = await User.findOne({ username: req.params.id });
        const posts = await Post.find({ userId: user._id }).populate('comments');
        res.status(200).json(posts);
      } catch (err) {
        res.status(500).json(err);
    }
}

// Get all posts
exports.getPosts = async(req, res) => {
  Post.find({}).populate([{
    path: "comments",
    model: "Comment"
  }, {
    path: "userId",
    model: "User",
    select: {"username": 1, "displayName": 1, "profilePicture": 1, "_id": 1}
  }])
    .then(posts => {
      res.status(200).json({ posts })
    })
    .catch(err => {
      console.log(err)
  })
}

// Add saved post
exports.addSavedPost = async(req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.user._id
    const post = await Post.findById(postId).populate('comments');
    if(!post){
      return res.status(404).json("Post Not found!")
    }
    const foundUser = await User.findById(userId);
    foundUser.savedPosts.push(post._id);
    foundUser.save();
    res.status(200).json("Post Saved Succesfully");
  } catch (err) {
    return res.status(500).json(err);
  }
}

// Get saved post
exports.getSavedPost = async(req, res) => {
  try {
    const userId = req.user._id
    const foundUser = await User.findById(userId);
    const savedPosts = foundUser.savedPosts;
    res.status(200).json(savedPosts);
  } catch (err) {
    return res.status(500).json(err);
  }
}
