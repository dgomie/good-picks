const withAuth = (req, res, next) => {
    if(!req.session.loggedIn){
      res.redirect('/login');
    }else {
      next();
    }
  };
  

module.exports = withAuth;


// const express = require('express');
// const app = express();
// // Import the withAuth middleware
// const withAuth = require('./path/to/withAuth');
// // Example route that requires authentication
// app.get('/profile', withAuth, (req, res) => {
//     // Only logged-in users can access this route
//     res.send('Welcome to your profile');
// });
// // Other routes...
// app.listen(3000, () => {
//     console.log('Server is running on port 3000');
// });