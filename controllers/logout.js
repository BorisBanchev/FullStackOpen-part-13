import express from "express";
import { sessionValidator } from "../middleware/sessionValidator.js";
import { Session } from "../models/index.js";

const logoutRouter = express.Router();

logoutRouter.delete("/", sessionValidator, async (req, res) => {
  await Session.destroy({ where: { token: req.token } });
  res.status(204).end();
});

export default logoutRouter;
