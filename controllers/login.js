import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { SECRET } from "../utils/config.js";
import { User } from "../models/index.js";
import { Session } from "../models/index.js";

const loginRouter = express.Router();

loginRouter.post("/", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({
    where: {
      username: username,
    },
  });

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({ error: "Invalid username or password!" });
  }

  if (user.disabled) {
    return res.status(401).json({ error: "User account is disabled!" });
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, SECRET);

  await Session.create({ userId: user.id, token });

  res.status(200).send({
    token,
    username: user.username,
    name: user.name,
  });
});

export default loginRouter;
