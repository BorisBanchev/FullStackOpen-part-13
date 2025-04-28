import Blog from "./Blog.js";
import User from "./User.js";
import ReadingList from "./Readinglist.js";
import Session from "./Session.js";

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, {
  through: ReadingList,
  as: "readingList",
});
Blog.belongsToMany(User, {
  through: ReadingList,
  as: "readers",
});

export { Blog, User, ReadingList, Session };
