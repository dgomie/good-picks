const router = require('express').Router();
const { User } = require('../models');
const withAuth = require('../utils/auth');


// homepage
router.get('/', (req, res) => {
  res.render('homepage')
})

// login page
router.get('/login', (req, res) => {
  
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('login');
});

// registration page
router.get('/register', (req, res) => {
  res.render('register')
})

//user dashboard
router.get('/dashboard', withAuth, (req, res) => {
  res.render('dashboard')
})

// user profile
router.get('/profile', withAuth, (req, res) => {
  res.render('profile')
})

router.get('/logout', (req, res) => {
  res.render('logout')
})

router.get('/charts', (req, res) => {
  res.render('charts')
})

module.exports = router;




// router.get('/', withAuth, async (req, res) => {
//   try {
//     const userData = await User.findAll({
//       attributes: { exclude: ['password'] },
//       order: [['name', 'ASC']],
//     });

//     const users = userData.map((project) => project.get({ plain: true }));

//     res.render('homepage', {
//       users,
      
//       logged_in: req.session.logged_in,
//     });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });