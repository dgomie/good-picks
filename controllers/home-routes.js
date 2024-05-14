const router = require('express').Router();
const { User, Music } = require('../models');
const withAuth = require('../utils/auth');


// homepage
router.get('/', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/dashboard');
    return;
  }

  res.render('homepage', {
    title: 'Good Picks'
  })
})

// login page
router.get('/login', (req, res) => {
  
  if (req.session.loggedIn) {
    res.redirect('/dashboard');
    return;
  }

  res.render('login', {
    title: 'Login',
    loggedIn: req.session.loggedIn,
  
  });
});

// registration page
router.get('/register', (req, res) => {
  res.render('register', {
    title: 'Register',
    loggedIn: req.session.loggedIn,
  })
})

//user dashboard
// TODO: put back withAuth
router.get('/dashboard', (req, res) => {
  console.log(req.session)
  res.render('dashboard', {
    title: 'Dashboard',
    ...req.session
    //  don't know if this will work but hey, it's worth a shot. It didn't work
    // top5: req.session.user.top5
    // don't know if this is needed
    // username: req.session.name,
    
    // just adding to add as a possible future goal, don't know if it will work
    // isPremiumUser: false
  })
})

// user profile
// TODO: put back withAuth
router.get('/profile', (req, res) => {
  res.render('profile', {
    title: 'Profile',
    ...req.session
  })
})

router.get('/logout', (req, res) => {
  res.render('logout')
})

router.get('/charts', (req, res) => {
  res.render('charts', {
    title: 'Charts',
    ...req.session
    // don't know if this is needed ro if will work
    // artist: req.session.artist,
  })
})

router.get('/music', (req, res) => {
  res.render('music')
})

module.exports = router;