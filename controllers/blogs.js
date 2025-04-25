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

blogsRouter.post("/", async (req, res, next) => {
  try {
    const { title, url } = req.body;

    if (!title || !url) {
      throw new Error("Title and URL are required fields!");
    }
    const blog = await Blog.create(req.body);
    console.log(blog.toJSON());
    res.json(blog);
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    await req.blog.destroy();
    res.json(req.blog);
  }
  res.status(204).end();
});

blogsRouter.put("/:id", blogFinder, async (req, res, next) => {
  try {
    if (req.blog) {
      const { likes } = req.body;

      if (likes < 0) {
        throw new Error("Likes can't be negative!");
      }
      req.blog.likes = likes;
      await req.blog.save();
      res.json(req.blog);
    } else {
      res.status(404).json({ error: "Blog not found!" });
    }
  } catch (error) {
    next(error);
  }
});

export default blogsRouter;
