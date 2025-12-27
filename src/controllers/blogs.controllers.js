import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Blog } from '../models/blogs.model.js';
import { Comment } from '../models/comments.model.js';
import mongoose from 'mongoose';

// @desc    Get all blogs
// @route   GET /api/v1/blogs
// @access  Public
const getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 }).lean();

  const comments = await Comment.find().sort({ createdAt: -1 }).lean();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        blogs,
        blogs.length ? 'All blogs fetched successfully' : 'No blogs found',
        comments,
        comments.length
          ? 'All comments fetched successfully'
          : 'No comments found'
      )
    );
});

// @desc    Create blogs
// @route   POST /api/v1/blogs
// @access  Private
const createBlog = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  if (!title?.trim() || !content?.trim()) {
    throw new ApiError(400, 'Title and content are required');
  }

  const blog = await Blog.create({
    title,
    content,
    author: req.user._id,
  });

  res.status(201).json(new ApiResponse(201, blog, 'Blog created successfully'));
});

// @desc    Get a blog by id
// @route   GET /api/v1/blogs/:id
// @access  Private
const getBlogById = asyncHandler(async (req, res) => {
  const blog_id = req.params.id;

  if (!blog_id) {
    throw new ApiError(400, 'Blog id is required');
  }

  const blog = await Blog.findById(blog_id);
  if (!blog) {
    throw new ApiError(404, 'Blog not found');
  }

  res
    .status(200)
    .json(new ApiResponse(200, blog, `Fetched ${blog_id}blog successfuly`));
});

// @desc    Update a blog
// @route   PATCH /api/v1/blogs/:id
// @access  Private
const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid blog id');
  }

  if (!title && !content) {
    throw new ApiError(400, 'Title and content are required');
  }

  const blog = await Blog.findById(id);

  if (title) blog.title = title;
  if (content) blog.content = content;

  const updatedBlog = await blog.save({ validateBeforeSave: true });

  res
    .status(201)
    .json(new ApiResponse(200, updatedBlog, 'Blog updated successfully!'));
});

// @desc    Delete a blog
// @route   DELETE /api/v1/blogs/:id
// @access  Private

const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid blog id');
  }

  const blog = await Blog.findById(id);

  if (!blog) {
    throw new ApiError(404, 'Blog not found');
  }

  if (blog.author.toString() !== req.user._id) {
    throw new ApiError(403, 'You are not allowed to delete this blog');
  }

  await blog.deleteOne();

  res.status(200).json(new ApiResponse(200, null, 'Blog deleted successfully'));
});

// @desc    Create a comment
// @route   POST /api/v1/blogs/:id/comments
// @access  Private
const createComment = asyncHandler(async (req, res) => {
  const { id: blogID } = req.params;
  const { content } = req.body;

  if (!content || !content.trim()) {
    throw new ApiError(400, 'Comment content is required');
  }

  const blog = await Blog.findById(blogID);
  if (!blog) {
    throw new ApiError(404, 'Blog not found');
  }

  const comment = await Comment.create({
    content: content.trim(),
    author: req.user._id,
    blog: blogID,
  });

  res
    .status(201)
    .json(new ApiResponse(201, comment, 'Comment posted successfully!'));
});

// @desc    Get all comments on a blog
// @route   GET /api/v1/blogs/:id/comments
// @access  Private
const getAllComments = asyncHandler(async (req, res) => {
  const { id: blogID } = req.params;

  const blog = await Blog.findById(blogID);
  if (!blog) {
    throw new ApiError(404, 'Blog not found');
  }

  const comments = await Comment.find({ blog: blogID })
    .populate('author', 'email')
    .sort({ createdAt: -1 });

    res.status(200).json(
    new ApiResponse(200, comments, "Comments fetched successfully")
  );
});

export {
  getAllBlogs,
  createBlog,
  getBlogById,
  updateBlog,
  deleteBlog,
  createComment,
  getAllComments,
};
