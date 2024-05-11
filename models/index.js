const User = require('./User');
// changed the import statement to match the actual file name
const Music = require('./music');
// I'm iffy about this one because it wasn't working with the actual file name when it was uppercase
const Rating = require('./rating'); // Fix: Change the import statement to match the actual file name

module.exports = { User, Music, Rating};
