const sequelize = require('../config/connection');
const { User, Music, Rating, Artist} = require('../models');

const userData = require('./user-data.json');
const artistData = require('./artist-data.json')
const songData = require('./song-data.json')
const ratingData = require('./rating-data.json')


const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  await Artist.bulkCreate(artistData);

  await Music.bulkCreate(songData);

  await Rating.bulkCreate(ratingData);

  process.exit(0);
};

seedDatabase();