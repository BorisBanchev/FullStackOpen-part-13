import express from "express";
import { User, Blog, ReadingList } from "../models/index.js";
import bcrypt from "bcrypt";

const usersRouter = express.Router();

usersRouter.get("/", async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ["passwordHash"] },
    include: {
      model: Blog,
      attributes: { exclude: ["userId"] },
    },
  });
  res.json(users);
});

usersRouter.get("/:id", async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ["name", "username"],
      include: {
        model: Blog,
        as: "readingList",
        attributes: ["id", "url", "title", "author", "likes", "year"],
        through: { attributes: [] },
      },
    });
    if (!user) {
      res.status(404).json({ error: "User not found!" });
    }
    const response = {
      name: user.name,
      username: user.username,
      readings: user.readingList,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/", async (req, res, next) => {
  const { username, name, password } = req.body;
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  try {
    const user = await User.create({
      username: username,
      name: name,
      passwordHash: passwordHash,
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
});

usersRouter.put("/:username", async (req, res, next) => {
  try {
    const { username: newUsername } = req.body;
    const userToChange = await User.findOne({
      where: {
        username: req.params.username,
      },
    });

    if (!userToChange) {
      return res.status(404).json({ error: "User not found!" });
    }

    const existingUser = await User.findOne({
      where: {
        username: newUsername,
      },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Username already exists!" });
    }

    userToChange.username = newUsername;

    await userToChange.save();
    res.json(userToChange);
  } catch (error) {
    next(error);
  }
});

export default usersRouter;
