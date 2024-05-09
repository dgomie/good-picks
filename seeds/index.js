const sequelize = require('../config/connection');
const { User, Music } = require('../models');

const userData = require('./user-data.json');
const songData = require('./song-data.json')

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  await Music.bulkCreate(songData);

  process.exit(0);
};

seedDatabase();