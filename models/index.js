import Blog from "./Blog.js";
import User from "./User.js";
import ReadingList from "./Readinglist.js";

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, { through: ReadingList });
Blog.belongsToMany(User, { through: ReadingList });

export { Blog, User, ReadingList };
