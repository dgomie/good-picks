const router = require("express").Router();
const { Artist } = require("../../models");


router.get('/artists', async (req, res) => {
    try {
        const artists = await Artist.findAll();
        res.status(200).json(artists);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/:artist", async (req, res) => {
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

  router.post('/', async (req, res) => {

    const artist = await req.body.name;

    try {
        // Check if the artist already exists
        const existingArtist = await Artist.findOne({ where: { name: artist} });

        if (existingArtist) {
            res.status(400).json({ message: 'Artist already exists' });
            return;
        }
        // If the artist doesn't exist, create a new artist
        try {
            const response = await fetch(`/artist-image/${encodeURIComponent(artist)}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();

            const artistName = data.name;
            const artistPhoto = data.images[0].url;
            const genre = data.genres[0]

            const newArtist = await Artist.create({
                name: artistName,
                artistImg: artistPhoto,
                genre: genre
            });
            res.status(201).json(newArtist);
        } catch (error) {
            console.error('Error:', error);
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;