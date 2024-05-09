const router = require('express').Router();
const userRoutes = require('./user-routes');
const musicRoutes = require('./music-routes');

router.use('/users', userRoutes);
router.use('/music', musicRoutes)

module.exports = router;