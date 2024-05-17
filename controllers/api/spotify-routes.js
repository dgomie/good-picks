// Import the necessary modules.
require("dotenv").config();
const router = require("express").Router();
const { response } = require("express");
const SpotifyWebApi = require("spotify-web-api-node");

// Initialize the Spotify API with credentials from environment variables.
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URL,
});

// Route handler for the login endpoint.
router.get("/login", (req, res) => {
  // Define the scopes for authorization; these are the permissions we ask from the user.
  const scopes = [
    "user-read-private",
    "user-read-email",
    "user-read-playback-state",
    "user-modify-playback-state",
  ];
  // Redirect the client to Spotify's authorization page with the defined scopes.
  res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

// Route handler for the callback endpoint after the user has logged in.
router.get("/callback", (req, res) => {
  // Extract the error, code, and state from the query parameters.
  const error = req.query.error;
  const code = req.query.code;

  // If there is an error, log it and send a response to the user.
  if (error) {
    console.error("Callback Error:", error);
    res.send(`Callback Error: ${error}`);
    return;
  }

  // Exchange the code for an access token and a refresh token.
  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      const accessToken = data.body["access_token"];
      const refreshToken = data.body["refresh_token"];
      const expiresIn = data.body["expires_in"];

      // Set the access token and refresh token on the Spotify API object.
      spotifyApi.setAccessToken(accessToken);
      spotifyApi.setRefreshToken(refreshToken);

      req.session.spotAccessToken = accessToken;
      req.session.spotRefreshToken = refreshToken;

      req.session.save((err) => {
        if (err) {
          // handle error
          res.status(500).json(err);
        } else {
          res.redirect("/dashboard");
        }
      });

      // Send a success message to the user.
      // res.redirect('/dashboard');

      // Refresh the access token periodically before it expires.
      setInterval(async () => {
        const data = await spotifyApi.refreshAccessToken();
        const accessTokenRefreshed = data.body["access_token"];
        spotifyApi.setAccessToken(accessTokenRefreshed);
      }, (expiresIn / 2) * 1000); // Refresh halfway before expiration.
    })
    .catch((error) => {
      console.error("Error getting Tokens:", error);
      res.send("Error getting tokens");
    });
});


router.get("/artist/:artist/:track", async (req, res) => {
  try {
  const artistTrackData = await spotifyApi.searchTracks(
    `track:${req.params.track} artist:${req.params.artist}`
  );
  res.send(artistTrackData);
} catch (error) {
  res.send("Error getting data")
}
});

router.get("/artist/:artistId", async (req, res) => {
  try {
  const artistData = await spotifyApi.getArtist(req.params.artistId)
  console.log('Artist information', artistData);
  res.status(200).json(artistData)
  } catch (error) {
    res.send("error getting data")
  }
})

//Retrieve the artist images for profile page

router.get("/artist-image/:artistName", async (req, res) => {
  const artistName = req.params.artistName; // replace with the artist name you want to search for
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
      const artistData = await response.json();
      res.send(artistData);
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
});

// Getting album artwork
router.get("/albums/:artistName/:albumName", async (req, res) => {
  const artistName = req.params.artistName;
  const albumName = req.params.albumName
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
        console.log(albumData)
        let albumId = null;

        for(let i = 0; i < albumData.items.length; i++) {
          if (albumData.items[i]["name"].toLowerCase() === albumName.toLowerCase()){
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
              console.log(albumArtUrl); 
              //link to album artwork
              res.send(albumArtUrl);
            }
          } else {
            res.send("Couldn't find album");
          }
    }
  } else {
    console.error(
      "Failed to fetch artist:",
      response.status,
      response.statusText
    );
    res.send(`Error: ${(response.status, response.statusText)}`);
  }
});


// tracks get route
router.get("/tracks", async (req, res) => {
  try {
    const recentlyPlayedTracksData = await spotifyApi.getMyRecentlyPlayedTracks({
      limit: 5
    });

    console.log("Your 5 most recently played tracks are:");
    recentlyPlayedTracksData.body.items.forEach(item => console.log(item.track));

    res.send(recentlyPlayedTracksData.body.items);
  } catch (error) {
    console.error('Something went wrong!', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
