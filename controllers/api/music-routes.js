const router = require("express").Router();
const { Music, Artist } = require("../../models");

// these aren't definite routes, just a starting point based off what I think we need.
// route to get all songs
router.get("/", async (req, res) => {
  try {
    const musicData = await Music.findAll();
    res.status(200).json(musicData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// route to get one song
router.get("/:id", async (req, res) => {
  try {
    const musicData = await Music.findByPk(req.params.id);
    if (!musicData) {
      res.status(404).json({ message: "No song found with this id!" });
      return;
    }
    res.status(200).json(musicData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// router to get all songs by genre
router.get("/genre/:genre", async (req, res) => {
  try {
    const musicData = await Music.findAll({
      where: { genre: req.params.genre },
    });
    if (!musicData) {
      res.status(404).json({ message: "No songs found with this genre!" });
      return;
    }
    res.status(200).json(musicData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// route to get artist
router.get("/artist/:artist", async (req, res) => {
  try {
    const musicData = await Music.findAll({
      where: { name: req.params.artist },
    });
    if (!musicData) {
      res.status(404).json({ message: "No songs found with this artist!" });
      return;
    }
    res.status(200).json(musicData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// route to get one song by artist
router.get("/artist/:artist/:id", async (req, res) => {
  try {
    const musicData = await Music.findOne({
      where: { artist: req.params.artist, id: req.params.id },
    });
    if (!musicData) {
      res
        .status(404)
        .json({ message: "No song found with this artist and id!" });
      return;
    }
    res.status(200).json(musicData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// route to post song
router.post("/", async (req, res) => {
  try {
    const artist = await Artist.findOne({
      where: { name: req.body.artistName },
    });
    const artistId = artist.id;

    const existingSong = await Music.findOne({
      where: { title: req.body.songTitle, artist_id: artistId },
    });

    if (!existingSong) {
      console.log("Attemping to create artist")
      const musicData = await Music.create({
        title: req.body.songTitle,
        artist_id: artistId,
        album: req.body.albumName,
        albumImg: req.body.albumImg,
      });
      console.log("Posted Music Data", musicData);
      res.status(200).json(musicData);
    } else {
      console.log("Song already in Database", existingSong);
      res.status(200).json(existingSong);
    }
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

// route to update song rating
router.put("/:id", async (req, res) => {
  try {
    const musicData = await Music.update(req.body, {
      where: { id: req.params.id },
    });
    if (!musicData) {
      res.status(404).json({ message: "No song found with this id!" });
      return;
    }
    res.status(200).json(musicData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// route to get top 5 songs
router.get("/top5", async (req, res) => {
  try {
    const musicData = await Music.findAll({
      order: [["rating", "DESC"]],
      limit: 5,
    });
    res.status(200).json(musicData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// route to delete an artist
router.delete("/artist/:artist/:id", async (req, res) => {
  try {
    const musicData = await Music.findOne({
      where: { artist: req.params.artist, id: req.params.id },
    });
    if (!musicData) {
      res.status(404).json({ message: "No artist with this id!" });
      return;
    }
    res.status(200).json(musicData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// route to delete a song
router.delete("/song/:song/:id", async (req, res) => {
  try {
    const musicData = await Music.findOne({
      where: { artist: req.params.artist, id: req.params.id },
    });
    if (!musicData) {
      res.status(404).json({ message: "No song with this id!" });
      return;
    }
    res.status(200).json(musicData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
