import express from "express";
import { PORT } from "./utils/config.js";
import "express-async-errors";
import { connectToDatabase } from "./utils/db.js";
import blogsRouter from "./controllers/blogs.js";
import usersRouter from "./controllers/users.js";
import loginRouter from "./controllers/login.js";
import authorsRouter from "./controllers/authors.js";

const app = express();
app.use(express.json());
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/authors", authorsRouter);
// error middleware
app.use((error, req, res, next) => {
  console.error(error.message);
  if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }
  if (error.name === "SequelizeValidationError") {
    const validationErrors = error.errors.map((err) => err.message);
    return res.status(400).json({ error: validationErrors });
  }
  res.status(400).json({ error: error.message });
});

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
