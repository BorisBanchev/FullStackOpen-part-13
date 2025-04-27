import express from "express";
import { ReadingList, Blog, User } from "../models/index.js";

const readingListRouter = express.Router();

readingListRouter.post("/", async (req, res, next) => {
  const { blog_id, user_id } = req.body;
  console.log(blog_id, user_id);

  try {
    const blogToBeAdded = await Blog.findByPk(blog_id);
    const user = await User.findByPk(user_id);
    if (!blogToBeAdded || !user) {
      return res.status(400).json({ error: "User or blog does'nt exist!" });
    }
    const readingListEntry = await ReadingList.create({
      userId: user_id,
      blogId: blog_id,
    });
    res.status(201).json(readingListEntry);
  } catch (error) {
    next(error);
  }
});

export default readingListRouter;
