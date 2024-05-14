const router = require("express").Router();
const { Music } = require("../../models");

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
    const musicData = await Music.findAll({ where: { genre: req.params.genre } });
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
    const musicData = await Music.findAll({ where: { artist: req.params.artist } });
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
    const musicData = await Music.findOne({ where: { artist: req.params.artist, id: req.params.id } });
    if (!musicData) {
      res.status(404).json({ message: "No song found with this artist and id!" });
      return;
    }
    res.status(200).json(musicData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// route to post song rating
router.post("/", async (req, res) => {
  try {
    const musicData = await Music.create(req.body);
    res.status(200).json(musicData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// route to update song rating
router.put("/:id", async (req, res) => {
  try {
    const musicData = await Music.update(req.body, { where: { id: req.params.id } });
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
    const musicData = await Music.findAll({ order: [["rating", "DESC"]], limit: 5 });
    res.status(200).json(musicData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// route to delete an artist
router.delete("/artist/:artist/:id", async (req, res) => {
try {
  const musicData = await Music.findOne({ where: { artist: req.params.artist, id: req.params.id } });
  if(!musicData){
    res.status(404).json({ message: 'No artist with this id!' });
    return;
  }
  res.status(200).json(musicData)
}catch (err) {
  res.status(500).json(err);
}
});

// route to delete a song
router.delete("/song/:song/:id", async (req, res) => {
  try {
    const musicData = await Music.findOne({ where: { artist: req.params.artist, id: req.params.id } });
    if(!musicData){
      res.status(404).json({ message: 'No song with this id!' });
      return;
    }
    res.status(200).json(musicData)
  }catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;