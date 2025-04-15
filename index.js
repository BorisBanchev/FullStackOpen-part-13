import sequelize from "./connection_db.js";
import "dotenv/config";
import express from "express";
import Blog from "./models/Blog.js";
const app = express();
app.use(express.json());

app.get("/");

const main = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

main();

app.get("/api/blogs/", async (req, res) => {
  try {
    const blogs = await Blog.findAll();
    res.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(404).end();
  }
});

app.post("/api/blogs", async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    console.log(blog.toJSON());
    res.json(blog);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

app.delete("/api/blogs/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Blog.destroy({
      where: { id },
    });
    res.json(deleted);
  } catch (error) {
    return res.status(400).json({ error });
  }
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
