const router = require('express').Router();

const userRoutes = require('./user-routes');
const musicRoutes = require('./music-routes');
const ratingRoutes = require('./rating-routes');
const spotifyRoutes = require('./spotify-routes');
const artistRoutes = require('./artist-routes');

router.use('/users', userRoutes);
router.use('/music', musicRoutes);
router.use('/spotify', spotifyRoutes);
router.use('/ratings', ratingRoutes);
router.use('/artists', artistRoutes)

module.exports = router;