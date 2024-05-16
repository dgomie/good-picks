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
    // Check if the artist already exists
    const existingArtist = await Artist.findOne({
      where: { name: req.body.artistName },
    });

    if (existingArtist) {
      res.status(204).send(existingArtist);
      return;
    }

    const artistName = req.body.artistName;

    const searchEndpoint = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      artistName
    )}&type=artist`;
    const token = req.session.spotAccessToken;

    let response = await fetch(searchEndpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      const artistId = data.artists.items[0].id;

      const artistImgEndpoint = `https://api.spotify.com/v1/artists/${artistId}`;
      response = await fetch(artistImgEndpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

        const spotArtistName = data.name;
        const artistPhoto = data.images[0].url;
        const genre = data.genres[0];

        const newArtist = await Artist.create({
          name: spotArtistName,
          artistImg: artistPhoto,
          genre: genre,
        });
        res.status(201).json(newArtist);
      } else {
        console.error(
          "Failed to fetch artist image:",
          response.status,
          response.statusText
        );
        res.send(`Error: ${(response.status, response.statusText)}`);
      }
    } else {
      console.error(
        "Failed to fetch artist:",
        response.status,
        response.statusText
      );
      res.send(`Error: ${(response.status, response.statusText)}`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

module.exports = router;
