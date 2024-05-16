const User = require('./User');
const Artist = require('./artist')
const Music = require('./music');
const Rating = require('./rating'); 



// User.js
User.hasMany(Rating, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});


  // Artist has many Music
  Artist.hasMany(Music, {
    foreignKey: 'artist_id',
    onDelete: "CASCADE"
  });

  Music.belongsTo(Artist, {
    foreignKey: 'artist_id', // matches the field defined in Music model
    onDelete: "CASCADE", 
  });
  

// Music.js
Music.hasMany(Rating, {
    foreignKey: 'music_id',
    onDelete: 'CASCADE'
});

// Rating.js
Rating.belongsTo(User, {
    foreignKey: 'user_id'
});

Rating.belongsTo(Music, {
    foreignKey: 'music_id'
});

// Rating.belongsTo(Artist, {
//   foreignKey: 'artist_id',
// });

// // Artist.js
// Artist.hasMany(Rating, {
//   foreignKey: 'artist_id',
// });



module.exports = { User, Music, Rating, Artist};
