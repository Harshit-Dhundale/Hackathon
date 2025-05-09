const express = require('express');
const Post = require('../models/Post');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { validatePost, validateReply } = require('../validators/postValidator');
const handleValidationErrors = require('../middleware/errorHandler');

// 🔹 Create a New Post (Protected Route)
router.post(
  '/',
  authMiddleware, // Ensure user is authenticated
  validatePost,
  handleValidationErrors,
  async (req, res) => {
    try {
      const newPost = new Post({
        title: req.body.title,
        content: req.body.content,
        createdBy: req.user._id, // Use authenticated user ID
      });

      await newPost.save();
      res.status(201).json(newPost);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }
);

// 🔹 Get Paginated Posts
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const posts = await Post.find()
      .populate('createdBy', 'username') // Populate creator username
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip((page - 1) * limit)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    res.json({
      posts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// 🔹 Get a Single Post by ID
router.get('/:postId', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate('createdBy', 'username') // populate post creator username
      .populate('replies.createdBy', 'username'); // populate each reply's creator username

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const posts = await Post.find({ createdBy: req.params.userId });
    return res.json(posts || []);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// 🔹 Add a Reply to a Post (Protected Route)
router.post(
  '/:postId/replies',
  authMiddleware, // Ensure user is authenticated
  validateReply,
  handleValidationErrors,
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.postId);

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      post.replies.push({
        text: req.body.text,
        createdBy: req.user._id, // Set reply's creator as authenticated user
      });

      await post.save();
      res.status(201).json(post);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }
);

// DELETE post route
router.delete('/:postId', authMiddleware, async (req, res) => {
  try {
    const deleted = await Post.findByIdAndDelete(req.params.postId);
    if (!deleted) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:postId', authMiddleware, async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      req.body,
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

module.exports = router;