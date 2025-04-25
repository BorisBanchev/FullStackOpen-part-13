import express from "express";
import { Blog } from "../models/index.js";
import { fn, col } from "sequelize";

const authorsRouter = express.Router();

authorsRouter.get("/", async (req, res) => {
  try {
    const authors = await Blog.findAll({
      attributes: [
        "author",
        [fn("COUNT", col("id")), "blogs"],
        [fn("SUM", col("likes")), "likes"],
      ],
      group: ["author"],
      order: [[fn("SUM", col("likes")), "DESC"]],
    });
    res.json(authors);
  } catch (error) {
    res.status(404).json({ error: "Failed to fetch authors" });
  }
});

export default authorsRouter;
