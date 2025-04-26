import Blog from "./Blog.js";
import User from "./User.js";

User.hasMany(Blog);
Blog.belongsTo(User);

export { Blog, User };
