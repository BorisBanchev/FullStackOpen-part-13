import jwt from "jsonwebtoken";
import { SECRET } from "../utils/config.js";
import { Session, User } from "../models/index.js";

export const sessionValidator = async (req, res, next) => {
  const authorization = req.get("authorization");
  if (!authorization || !authorization.toLowerCase().startsWith("bearer ")) {
    return res.status(401).json({ error: "Token missing or invalid!" });
  }

  const token = authorization.substring(7);
  const decodedToken = jwt.verify(token, SECRET);

  const session = await Session.findOne({ where: { token } });
  if (!session) {
    return res.status(401).json({ error: "Session doesn't exist!" });
  }

  const user = await User.findByPk(decodedToken.id);
  if (!user || user.disabled) {
    return res.status(403).json({ error: "User account is disabled!" });
  }

  req.user = user;
  req.token = token;
  next();
};
