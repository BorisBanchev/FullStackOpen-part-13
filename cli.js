import { sequelize } from "./utils/db.js";
import Blog from "./models/Blog.js";

const main = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    await Blog.sync();
    const blogs = await Blog.findAll();
    blogs.forEach((blog) => {
      console.log(
        `${blog.author || "Unknown Author"}: '${blog.title}', ${
          blog.likes
        } likes`
      );
    });

    await sequelize.close();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

main();
