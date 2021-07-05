const express = require("express");
const { isLoggedIn } = require("../../middleware/middleware");
const Post = require("../../models/post");
const router = express.Router();
const User = require("../../models/user");

// To get all the posts
router.get("/api/post", isLoggedIn, async (req, res) => {
  const posts = await Post.find({}).populate("postedBy");
  console.log(posts)
  res.json(posts);
});

// To add new Posts
router.post("/api/post", isLoggedIn, async (req, res) => {
  const post = {
    content: req.body.content,
    postedBy: req.user,
  };

  const newPost = await Post.create(post);
  console.log(newPost);
  res.json(newPost);
});

router.patch("/api/posts/:id/like", isLoggedIn, async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id;

  const isLiked = req.user.likes && req.user.likes.includes(postId);
  const option = isLiked ? "$pull" : "$addToSet";
  req.user = await User.findByIdAndUpdate(
    userId,
    {
      [option]: { likes: postId },
    },
    { new: true }
  );

  const post = await Post.findByIdAndUpdate(
    postId,
    {
      [option]: { likes: userId },
    },
    { new: true }
  );

  res.status(200).json(post);
});

module.exports = router;
