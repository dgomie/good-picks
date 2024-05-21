const Handlebars = require('handlebars');

Handlebars.registerHelper('generateStars', function(rating) {
    let stars = '';
    for (let i = 0; i < rating; i++) {
        stars += '★';
    }
    for (let i=0; stars.length <= 4; i++) {
        stars += '☆'
    }
    return new Handlebars.SafeString(stars);
});

Handlebars.registerHelper('renderAlbumImages', function(albumImages) {
    const albumImagesHtml = albumImages.map(imageUrl => {
      return `<img src="${imageUrl}" alt="Album Image">`;
    }).join('');
  
    return new Handlebars.SafeString(albumImagesHtml);
  });

Handlebars.registerHelper('roundAvg', function(averageRating) {
    const formatAvg =  Math.round(averageRating * 10) / 10;

    return new Handlebars.SafeString(formatAvg);
  });

  Handlebars.registerHelper('mod', function(v1, v2) {
    return v1 % v2;
  });
  
  Handlebars.registerHelper('eq', function(v1, v2) {
    return v1 === v2;
  });

  Handlebars.registerHelper('inc', function(value) {
    return parseInt(value) + 1;
  });

  Handlebars.registerHelper('isEven', function(value, options) {
    if((value % 2) == 0) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });