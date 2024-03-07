const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require('../models/user')

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate('users', { username: 1, name: 1, id: 1});
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id).populate('users', { username: 1, name: 1, id: 1});
    if (blog) {
      response.json(blog);
    } else {
      response.status(404).end();
    }
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.post("/", async (request, response, next) => {
  const body = request.body;
  const user = await User.findById(body.userId)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    users: user.id
  });

  try {
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog);
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.delete("/:id", async (request, response, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(request.params.id);
    if (blog) {
      response.status(204).end();
    }
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.put("/:id", async (request, response, next) => {
  try {
    const body = await request.body;
    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
    };

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
      new: true,
    });
    if (updatedBlog) {
      response.status(200).json(updatedBlog);
    }
  } catch (exception) {
    next(exception);
  }
});

module.exports = blogsRouter;
