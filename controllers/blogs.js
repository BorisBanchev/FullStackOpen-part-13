import express from "express";
import Blog from "../models/Blog.js";

const blogsRouter = express.Router();

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

blogsRouter.get("/", async (req, res) => {
  try {
    const blogs = await Blog.findAll();
    res.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(404).end();
  }
});

blogsRouter.post("/", async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    console.log(blog.toJSON());
    res.json(blog);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

blogsRouter.delete("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    await req.blog.destroy();
    res.json(req.blog);
  }
  res.status(204).end();
});

export default blogsRouter;
