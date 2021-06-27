const express = require("express");
const { isLoggedIn } = require("../../middleware/middleware");
const Post = require("../../models/post");
const router = express.Router();

// To get all the posts
router.get("/api/post", async (req, res) => {
  const posts = await Post.find({});
  res.json(posts);
});

// To add new Posts

router.post("/api/post", isLoggedIn, async (req, res) => {
  const post = {
    content: req.body.content,
    postedBy: req.user.username,
  };

  const newPost = await Post.create(post);
  console.log(newPost);
  res.json(newPost);
});

module.exports = router;
