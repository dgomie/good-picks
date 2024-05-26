const router = require("express").Router();
const { where } = require("sequelize");
const { Rating, Artist, Music } = require("../../models");

// route to get all ratings
router.get("/", async (req, res) => {
  try {
    const ratingData = await Rating.findAll({
      include: [
        {
          model: user,
          attributes: ["name", "profileImg"],
        },
        {
          model: music,
          attributes: ["song", "artist", "album"],
        },
      ],
    });
    const ratings = ratingData.map((rating) => rating.get({ plain: true }));
    console.log(ratings);
    res.status(200).send(ratings);
  } catch (err) {
    res.status(500).json(err);
  }
});

// route to get one rating
router.get("/:id", async (req, res) => {
  try {
    const ratingData = await Rating.findByPk(req.params.id);
    if (!ratingData) {
      res.status(404).json({ message: "No rating found with this id!" });
      return;
    }
    res.status(200).json(ratingData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// router to get all ratings by user
router.get("/user/:user_id", async (req, res) => {
  try {
    const ratingData = await Rating.findAll({
      where: { user_id: req.params.user_id },
    });
    if (!ratingData) {
      res.status(404).json({ message: "No ratings found with this user!" });
      return;
    }
    res.status(200).json(ratingData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// route to get one rating by user
router.get("/user/:user_id/:id", async (req, res) => {
  try {
    const ratingData = await Rating.findOne({
      where: { user_id: req.params.user_id, id: req.params.id },
    });
    if (!ratingData) {
      res.status(404).json({ message: "No rating found with this user!" });
      return;
    }
    res.status(200).json(ratingData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// copilot mumbo jumbo, don't know if we need, but can be used as a reference for the future
// route to get average rating for a song
router.get("/average/:music_id", async (req, res) => {
  try {
    const ratingData = await Rating.findAll({
      where: { music_id: req.params.music_id },
    });
    if (!ratingData) {
      res.status(404).json({ message: "No ratings found for this song!" });
      return;
    }
    let total = 0;
    for (let i = 0; i < ratingData.length; i++) {
      total += ratingData[i].rating;
    }
    const average = total / ratingData.length;
    res.status(200).json(average);
  } catch (err) {
    res.status(500).json(err);
  }
});

// route to post new rating
router.post("/", async (req, res) => {
  try {
    const music = await Music.findOne({
      where: {
        title: req.body.songTitle,
        album: req.body.albumName,
      },
    });

    const existingRating = await Rating.findOne({
      where: {
        user_id: req.session.userId,
        music_id: music.id,
      },
    });

    if (!existingRating) {
      const newRating = await Rating.create({
        rating: req.body.rating,
        artist_id: music.artist_id,
        music_id: music.id,
        user_id: req.session.userId,
      });
      console.log("New Rating added to database", newRating);
      res.status(200).json(newRating);
    } else {
      console.log(
        "Rating for this song already exists for this user",
        existingRating
      );
      res.status(200).json(existingRating);
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete("/", async (req, res) => {
  try {
    const ratingData = await Rating.destroy({
      where: {id: req.body.id },
    });
    if (!ratingData) {
      res.status(404).json({ message: "No rating found with this user!" });
      return;
    }
    res.status(200).json(ratingData);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.put("/", async (req, res) => {
  try {
    const [affectedRows] = await Rating.update(
      {
        rating: req.body.rating,
      },
      {
        where: {id: req.body.id},
      }
    );

    if (affectedRows === 0) {
      const rating = await Rating.findOne({ where: { id: req.body.id } });

      if (!rating) {
        res.status(404).json({ message: "No rating found with this id!" });
        return;
      }
    }

    res.status(200).json({ message: "Rating updated successfully!" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
