import express from "express";
import jwt from "jsonwebtoken";
import { SECRET } from "../utils/config.js";
import { Blog, User } from "../models/index.js";
import { Op, fn, col } from "sequelize";
import { tokenExtractor } from "../middleware/tokenExtractor.js";
import { sessionValidator } from "../middleware/sessionValidator.js";
const blogsRouter = express.Router();

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

blogsRouter.get("/", async (req, res) => {
  try {
    const search = req.query.search;
    const where = search
      ? {
          [Op.or]: [
            {
              title: {
                [Op.iLike]: `%${search}%`,
              },
            },
            {
              author: {
                [Op.iLike]: `%${search}%`,
              },
            },
          ],
        }
      : {};

    const blogs = await Blog.findAll({
      attributes: { exclude: ["userId"] },
      include: {
        model: User,
        attributes: ["name"],
      },
      where,
      order: [["likes", "DESC"]],
    });
    res.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(404).end();
  }
});

blogsRouter.post(
  "/",
  tokenExtractor,
  sessionValidator,
  async (req, res, next) => {
    try {
      const user = await User.findByPk(req.decodedToken.id);
      const { title, url } = req.body;

      if (!title || !url) {
        throw new Error("Title and URL are required fields!");
      }

      const blog = await Blog.create({ ...req.body, userId: user.id });

      res.json(blog);
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        return res
          .status(400)
          .json({ error: error.errors.map((e) => e.message) });
      }
      next(error);
    }
  }
);

blogsRouter.delete(
  "/:id",
  tokenExtractor,
  sessionValidator,
  blogFinder,
  async (req, res) => {
    if (req.blog) {
      if (req.blog.userId !== req.decodedToken.id) {
        return res
          .status(401)
          .json({ error: "Not authorized to delete this blog!" });
      }
      await req.blog.destroy();
      return res.json(req.blog);
    }
    res.status(404).json({ error: "Blog not found!" });
  }
);

blogsRouter.put(
  "/:id",
  blogFinder,
  sessionValidator,
  async (req, res, next) => {
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
  }
);
export default blogsRouter;
