import express from "express";
import { User } from "../models/index.js";
import bcrypt from "bcrypt";
import moment from "moment-timezone";

const usersRouter = express.Router();

usersRouter.get("/", async (req, res) => {
  const users = await User.findAll();
  const usersWithTimezone = users.map((user) => {
    const createdAt = moment(user.createdAt).tz("UTC+03:00").format();
    const updatedAt = moment(user.updatedAt).tz("UTC+03:00").format();

    return {
      id: user.id,
      username: user.username,
      name: user.name,
      createdAt,
      updatedAt,
    };
  });

  res.json(usersWithTimezone);
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
    const createdAt = moment(user.createdAt).tz("UTC+03:00").format();
    const updatedAt = moment(user.updatedAt).tz("UTC+03:00").format();
    res.json({
      id: user.id,
      username: user.username,
      name: user.name,
      createdAt,
      updatedAt,
    });
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

    const createdAt = moment(userToChange.createdAt).tz("UTC+03:00").format();
    const updatedAt = moment(userToChange.updatedAt).tz("UTC+03:00").format();
    await userToChange.save();
    res.json({
      id: userToChange.id,
      username: userToChange.username,
      name: userToChange.name,
      createdAt,
      updatedAt,
    });
  } catch (error) {
    next(error);
  }
});

export default usersRouter;
