import express from "express";
import { PORT } from "./utils/config.js";
import "express-async-errors";
import { connectToDatabase } from "./utils/db.js";
import blogsRouter from "./controllers/blogs.js";

const app = express();
app.use(express.json());
app.use("/api/blogs", blogsRouter);

// error middleware
app.use((error, req, res, next) => {
  console.error(error.message);
  res.status(400).json({ error: error.message });
});

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
