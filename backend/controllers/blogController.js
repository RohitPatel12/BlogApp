const Blog = require("../models/blog");

// ✅ CREATE a blog post
exports.createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }
    const newBlog = await Blog.create({
      title,
      content,
      author: req.user.id,
    });
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ READ all blog posts
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("author", "name email");
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ READ a single blog post by ID (including comments with user details)
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "name email")
      .populate("comments.user", "name email");
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ UPDATE a blog post (Only the author)
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only edit your own blogs." });
    }
    blog.title = req.body.title || blog.title;
    blog.content = req.body.content || blog.content;
    await blog.save();
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ DELETE a blog post (Only the author)
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own blogs." });
    }
    await blog.deleteOne();
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ LIKE a blog post
exports.likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    const userId = req.user.id;
    if (blog.likes.includes(userId)) {
      await Blog.findByIdAndUpdate(req.params.id, { $pull: { likes: userId } });
    } else {
      await Blog.findByIdAndUpdate(req.params.id, { $addToSet: { likes: userId } });
    }
    const updatedBlog = await Blog.findById(req.params.id);
    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ ADD a comment to a blog post
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    const newComment = { user: req.user.id, text };
    blog.comments.push(newComment);
    await blog.save();
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
