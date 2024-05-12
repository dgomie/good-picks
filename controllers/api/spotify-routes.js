// Import the necessary modules.
require("dotenv").config();
const router = require("express").Router();
const SpotifyWebApi = require("spotify-web-api-node");

// Initialize the Spotify API with credentials from environment variables.
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URL,
});

// Route handler for the login endpoint.
//TODO: Need a helper to prevent if token exists
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

      // TODO: Remove console.logs
      // Logging tokens can be a security risk; this should be avoided in production.
      // console.log('The access token is ' + accessToken);
      // console.log('The refresh token is ' + refreshToken);

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

// Route handler for the search endpoint.
router.get("/search", (req, res) => {
  // Extract the search query parameter.
  const { q } = req.query;

  // Make a call to Spotify's search API with the provided query.
  spotifyApi
    .searchTracks(q)
    .then((searchData) => {
      // Extract the URI of the first track from the search results.
      const trackUri = searchData.body.tracks.items[0].uri;
      // Send the track URI back to the client.
      res.send({ uri: trackUri });
    })
    .catch((err) => {
      console.error("Search Error:", err);
      res.send("Error occurred during search");
    });
});

// Route handler for the play endpoint.
router.get("/play", (req, res) => {
  // Extract the track URI from the query parameters.
  const { uri } = req.query;

  // Send a request to Spotify to start playback of the track with the given URI.
  spotifyApi
    .play({ uris: [uri] })
    .then(() => {
      res.send("Playback started");
    })
    .catch((err) => {
      console.error("Play Error:", err);
      res.send("Error occurred during playback");
    });
});
router.get("/artist-image/:artistName", async (req, res) => {
  const artistName = req.params.artistName; // replace with the artist name you want to search for
  const searchEndpoint = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
    artistName
  )}&type=artist`;
  const token = req.session.spotAccessToken; // replace with your actual token

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
      res.send(artistData.images[0].url);
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

// router.get('/artist-name/:id', async (req, res) => {
//     const artistImgEndpoint = 'https://api.spotify.com/v1/artists/4LLpKhyESsyAXpc4laK94U';
//     const token = req.session.spotAccessToken; // replace with your actual token
//     const response = await fetch(artistImgEndpoint, {
//     method: 'GET',
//     headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//     }
//     });

//     if (response.ok) {
//         const data = await response.json();
//         console.log(data);
//         res.send(data)
//     } else {
//         console.error('Failed to fetch artist image:', response.status, response.statusText);
//         res.send(`Error: ${response.status, response.statusText}`)
//     }
// })

// // Get artist image from spotify
// //TODO replace 4LLpKhyESsyAXpc4laK94U with ${id}
// router.get('/artist-image', async (req, res) => {
//     // console.log("DAFTPUNK", getArtistUrl())
//     const artistImgEndpoint = 'https://api.spotify.com/v1/artists/4LLpKhyESsyAXpc4laK94U';
//     const token = req.session.spotAccessToken; // replace with your actual token
//     const response = await fetch(artistImgEndpoint, {
//     method: 'GET',
//     headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//     }
//     });

//     if (response.ok) {
//         const data = await response.json();
//         console.log(data);
//         res.send(data)
//     } else {
//         console.error('Failed to fetch artist image:', response.status, response.statusText);
//         res.send(`Error: ${response.status, response.statusText}`)
//     }
// })

module.exports = router;
