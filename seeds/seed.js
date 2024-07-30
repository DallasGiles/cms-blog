const sequelize = require('../config/config');
const { User, Post, Comment } = require('../models');

const userData = [
  {
    username: 'testuser1',
    password: 'password123',
  },
  {
    username: 'testuser2',
    password: 'password123',
  },
];

const postData = [
  {
    title: 'First Post',
    content: 'This is the first post content.',
    user_id: 1,
  },
  {
    title: 'Second Post',
    content: 'This is the second post content.',
    user_id: 2,
  },
];

const commentData = [
  {
    comment_text: 'Great post!',
    user_id: 2,
    post_id: 1,
  },
  {
    comment_text: 'Thanks for sharing.',
    user_id: 1,
    post_id: 2,
  },
];

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  await Post.bulkCreate(postData);
  await Comment.bulkCreate(commentData);

  process.exit(0);
};

seedDatabase();