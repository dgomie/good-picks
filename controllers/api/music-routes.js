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

    const artistName = artist.name;

    // const existingAlbum = await Music.findOne({
    //   where: {
    //     album: req.bodyalbumName,
    //     artist_id: artist.id,
    //   },
    // });

    // if (existingAlbum) {
    //   const musicData = await Music.create({
    //     title: req.body.songTitle,
    //     artist_id: artist.id,
    //     album: existingAlbum.name,
    //     genre: artist.genre,
    //     albumImg: existingAlbum.albumImg,
    //   });

    //   console.log("bananas data", musicData);
    //   res.status(200).json(musicData);
    // } else {
    const albumName = req.body.albumName;
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
    // Getting artist id
    if (response.ok) {
      const data = await response.json();
      const artistId = data.artists.items[0].id;

      const artistAlbumsEndpoint = `https://api.spotify.com/v1/artists/${artistId}/albums`;
      response = await fetch(artistAlbumsEndpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const albumData = await response.json();
        // Get the album that matches the albumName parameter
        console.log(albumData);
        let albumId = null;
        

        for (let i = 0; i < albumData.items.length; i++) {
          if (
            albumData.items[i]["name"].toLowerCase() === albumName.toLowerCase()
          ) {
            albumId = albumData.items[i]["id"];
            console.log(albumId);
            break;
          }
        }

        if (albumId) {
          const albumEndpoint = `https://api.spotify.com/v1/albums/${albumId}`;
          response = await fetch(albumEndpoint, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const albumData = await response.json();
            const albumArtUrl = albumData.images[0].url;

            const musicData = await Music.create({
              title: req.body.songTitle,
              artist_id: artist.id,
              album: req.body.albumName,
              genre: req.body.genre,
              albumImg: albumArtUrl,
            });

            console.log("bananas data", musicData);
            res.status(200).json(musicData);
          }
        } else {
          res.status(400).send("Couldn't find album");
        }
      }
      // }
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

// ------------------------------------

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
