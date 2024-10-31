const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');
// Home route - displays all posts on the homepage
router.get('/', async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    const posts = postData.map((post) => post.get({ plain: true }));

    res.render('homepage', {
      posts,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET route for rendering the signup page
router.get('/signup', (req, res) => {
  res.render('signup');  // Render the signup form view
});

// POST route for handling user signup form submission
router.post('/signup', async (req, res) => {
  try {
    const userData = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    req.session.save(() => {
      req.session.userId = userData.id;
      req.session.username = userData.username;
      req.session.loggedIn = true;

      // Redirect to the dashboard after signup
      res.redirect('/dashboard');
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
// GET route for rendering the login page
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.render('login'); // Render the login view
});

// POST route for handling user login form submission
router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res.status(400).json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    const validPassword = await bcrypt.compare(req.body.password, userData.password);

    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.userId = userData.id;
      req.session.username = userData.username;
      req.session.loggedIn = true;

      res.json({ user: userData, message: 'You are now logged in!' });
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
// Dashboard route - displays posts specific to the logged-in user
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    const userPostsData = await Post.findAll({
      where: {
        user_id: req.session.userId,
      },
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    const userPosts = userPostsData.map((post) => post.get({ plain: true }));

    res.render('dashboard', {
      userPosts,
      loggedIn: req.session.loggedIn,
      username: req.session.username,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
// POST route to handle the creation of a new post

router.get('/create-post', withAuth, (req, res) => {
  res.render('create-post', {
    loggedIn: req.session.loggedIn,
  });
});
router.post('/create-post', withAuth, async (req, res) => {
  try {
    console.log(req.body); // Debugging: ensure req.body has title and content

    const newPost = await Post.create({
      title: req.body.title,
      content: req.body.content,
      user_id: req.session.userId,
    });

    // Redirect to the dashboard after successful post creation
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});
// DELETE route to handle post deletion
router.delete('/delete-post/:id', withAuth, async (req, res) => {
  try {
    const postId = req.params.id;
    const postData = await Post.destroy({
      where: {
        id: postId,
        user_id: req.session.userId, // Ensure that the user can only delete their own posts
      },
    });

    if (!postData) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }

    res.status(200).json({ message: 'Post deleted successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.redirect('/signup'); // Redirect to the login page after logout
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;