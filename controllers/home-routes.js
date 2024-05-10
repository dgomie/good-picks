const router = require('express').Router();
const { User, Music } = require('../models');
const withAuth = require('../utils/auth');


// homepage
router.get('/', (req, res) => {
  res.render('homepage', {
    title: 'Good Picks'
  })
})

// login page
router.get('/login', (req, res) => {
  
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('login', {
    title: 'Login'
  
  });
});

// registration page
router.get('/register', (req, res) => {
  res.render('register', {
    title: 'Register'
  })
})

//user dashboard
// put back withAuth
router.get('/dashboard', withAuth, (req, res) => {
  res.render('dashboard', {
    title: 'Dashboard',
    //  don't know if this will work but hey, it's worth a shot. It didn't work
    // top5: req.session.user.top5
    // don't know if this is needed
    // username: req.session.name,
    
    // just adding to add as a possible future goal, don't know if it will work
    // isPremiumUser: false
  })
})

// user profile
// put back withAuth
router.get('/profile', withAuth, (req, res) => {
  res.render('profile', {
    title: 'Profile',
    //  don't know if this is needed
    // username: req.session.name,
  })
})

router.get('/logout', (req, res) => {
  res.render('logout')
})

router.get('/charts', (req, res) => {
  res.render('charts', {
    title: 'Charts',
    // don't know if this is needed ro if will work
    // artist: req.session.artist,
  })
})

router.get('/music', (req, res) => {
  res.render('music')
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