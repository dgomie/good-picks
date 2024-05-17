const router = require("express").Router();
const { Artist } = require("../../models");

router.get("/artists", async (req, res) => {
  try {
    const artists = await Artist.findAll();
    res.status(200).json(artists);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:artist", async (req, res) => {
  try {
    const musicData = await Music.findAll({
      where: { artist: req.params.artist },
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


router.post("/", async (req, res) => {
  try {
    const existingArtist = await Artist.findOne({where: {name: req.body.artistName}})
    if (!existingArtist) {
      const response = await fetch(`http://localhost:3001/api/spotify/artist/${req.body.artistId}`);
      const artistData = await response.json()
      const artistImgUrl = artistData.body.images[0].url;
      
      const newArtistData = await Artist.create({
        name: req.body.artistName,
        artistImg: artistImgUrl
      })
      console.log("Posted Music Data", newArtistData)
      res.status(200).json(newArtistData)
    } else {
      console.log("Artist already in Database", existingArtist)
      res.status(200).json(existingArtist)
    }
  }
  catch (error) {
    console.error("Error adding Artist:", error);
  }
});

module.exports = router;
