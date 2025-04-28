import jwt from "jsonwebtoken";
import { SECRET } from "../utils/config.js";

export const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch (error) {
      return res.status(401).json({ error: "Invalid token!" });
    }
  } else {
    return res.status(401).json({ error: "Token missing!" });
  }
  next();
};
