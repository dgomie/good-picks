const router = require("express").Router();
const { User, Music, Rating, Artist } = require("../models");
const { Sequelize } = require('sequelize');
const withAuth = require("../utils/auth");


// homepage
router.get("/", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/dashboard");
    return;
  }

  res.render("homepage", {
    title: "Good Picks",
  });
});

// login page
router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/dashboard");
    return;
  }

  res.render("login", {
    title: "Login",
    loggedIn: req.session.loggedIn,
  });
});

// registration page
router.get("/register", (req, res) => {
  res.render("register", {
    title: "Register",
    loggedIn: req.session.loggedIn,
  });
});

// settings page
router.get("/settings", (req, res) => {
  res.render("settings", {
    title: "Settings",
    ...req.session,
  });
});

//user dashboard
router.get("/dashboard", withAuth, async (req, res) => {
  console.log(req.session);

  try {
    const dbRatingData = await Rating.findAll({
      include: [
        {
          model: User,
          attributes: ["name", "profileImg"],
        },
        {
          model: Music,
          attributes: ["title", "album", "albumImg"],
          include: [
            {
              model: Artist,
              attributes: ["name"],
            },
          ],
        },
      ],
      order: [
        ['created_at', 'DESC'],
      ],
    });
    const ratings = dbRatingData.map((rating) => rating.get({ plain: true }));

    console.log(ratings);
    res.render("dashboard", {
      title: "Dashboard",
      ...req.session,
      ratings,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/charts", async (req, res) => {
  try {
    const dbRatingData = await Rating.findAll({
      attributes: ['music.id', [Sequelize.fn('AVG', Sequelize.col('rating')), 'averageRating']],
      include: [
        {
          model: Music,
          attributes: ["title", "album"],
          include: [
            {
              model: Artist,
              attributes: ["name"]
            }
          ]
        }
      ],
      group: ['music.id', 'music.title', 'music.album', 'music->artist.name'],
      order: [[Sequelize.fn('AVG', Sequelize.col('rating')), 'DESC']],
      limit: 20
    })
    const ratings = dbRatingData.map((rating) => rating.get({ plain: true }))
    res.render("charts", {
      title: "Charts",
      ...req.session,
      ratings
    })
  } catch (err) {
    console.log(err);
    res.status(500).json(err)
  }
});

// user profile
router.get("/profile", withAuth, async (req, res) => {
  // const dbArtistData = await Artist.findAll();
  // const artists = dbArtistData.map((artist) => artist.get({ plain: true }));
  // console.log(artists)
  const userId = req.session.userId// the user ID

  const dbRatingData = await Rating.findAll({
    where: {
      user_id: userId,
      rating: 5,
    },
    include: [
      {
        model: Music,
        attributes: ["title", "album", "artist_id", "albumImg"],
        include: [
          {
            model: Artist,
            attributes: ["name", "artistImg"]
          }
        ]
      }
    ]
  });

  const artistData = dbRatingData.map(rating => ({
    url: rating.music.artist.artistImg,
    artistName: rating.music.artist.name
  }));

  const songData = dbRatingData.map(rating => ({
    url: rating.music.albumImg,
    songName: rating.music.title
  }))

  const dbRecentlyRated = await Rating.findAll({
    where: {
      user_id: userId,
    },
    include: [
      {
        model: Music,
        attributes: ["title", "album", "artist_id", "albumImg"],
        include: [
          {
            model: Artist,
            attributes: ["name", "artistImg"]
          }
        ]
      }
    ],
    order: [["created_at", "DESC"]],
    limit: 5
  });

  const recentlyRatedData = dbRecentlyRated.map(rating => ({
    url: rating.music.albumImg,
    songName: rating.music.title,
    rating: rating.rating
  }))

  res.render("profile", {
    title: "Profile",
    ...req.session,
    artistImgUrl: artistData,
    albumImgUrl: songData,
    recentlyRatedData: recentlyRatedData
  });
});

router.get("/profile/:userName", async (req, res) => {
  const userName = req.params.userName;
  const userData = await User.findOne({ where: { name: userName } })
  const userId = userData.id
  const dbRatingData = await Rating.findAll({
    where: {
      user_id: userId,
      rating: 5,
    },
    include: [
      {
        model: Music,
        attributes: ["title", "album", "artist_id", "albumImg"],
        include: [
          {
            model: Artist,
            attributes: ["name", "artistImg"]
          }
        ]
      }
    ]
  });
  const artistData = dbRatingData.map(rating => ({
    url: rating.music.artist.artistImg,
    artistName: rating.music.artist.name
  }));
  const songData = dbRatingData.map(rating => ({
    url: rating.music.albumImg,
    songName: rating.music.title
  }))
  const dbRecentlyRated = await Rating.findAll({
    where: {
      user_id: userId,
    },
    include: [
      {
        model: Music,
        attributes: ["title", "album", "artist_id", "albumImg"],
        include: [
          {
            model: Artist,
            attributes: ["name", "artistImg"]
          }
        ]
      }
    ],
    order: [["created_at", "DESC"]],
    limit: 5
  });
  const recentlyRatedData = dbRecentlyRated.map(rating => ({
    url: rating.music.albumImg,
    songName: rating.music.title,
    rating: rating.rating
  }))
  res.render("profile", {
    title: "Profile",
    profileImg: userData.profileImg,
    username: userName,
    artistImgUrl: artistData,
    albumImgUrl: songData,
    recentlyRatedData: recentlyRatedData
  });
});

router.get("/logout", (req, res) => {
  res.render("logout");
});


router.get("/music", (req, res) => {
  res.render("music");
});

module.exports = router;
