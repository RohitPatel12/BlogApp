const express = require("express");
const { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog, likeBlog, addComment } = require("../controllers/blogController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE a new blog post (Only authenticated users)
router.post("/", authMiddleware, createBlog);

// READ all blog posts
router.get("/", getAllBlogs);

// READ a single blog post by ID
router.get("/:id", getBlogById);

// UPDATE a blog post (Only the author)
router.put("/:id", authMiddleware, updateBlog);

// DELETE a blog post (Only the author)
router.delete("/:id", authMiddleware, deleteBlog);

// LIKE a blog post
router.post("/:id/like", authMiddleware, likeBlog);

// ADD a comment to a blog post
router.post("/:id/comment", authMiddleware, addComment);

module.exports = router;
