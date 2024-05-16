window.addEventListener("submit", function (event) {
  if (event.target.matches("#formID")) {
    event.preventDefault();

    closeBtn.addEventListener("click", clearInputs);

    // Get the form input values here, when the form is submitted
    const song = document.getElementById("songInput").value.trim();
    const artist = document.getElementById("artistInput").value.trim();
    const album = document.getElementById("albumInput").value.trim();
    const genre = document.getElementById("categoryInput").value.trim();
    const rating = document.querySelector('input[name="rating"]:checked').value;
    console.log(`song: ${song} artist:${artist}, album: ${album}`);

    fetchArtist(artist)
      .then((data) => {
        console.log(data);
        return fetchMusic(artist, song, album);
      })
      .then((data) => {
        console.log(data);
        return fetchRatings(song, album, rating);
      })
      .then(() => {
        this.location.reload()
      })
      .catch((error) => {
        console.error(error);
      });

  }
});

function fetchArtist(artist) {
  return fetch("api/artists/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      artistName: artist,
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else if (response.status === 400) {
        return Promise.resolve("artist already in database");
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function fetchMusic(artist, song, album, genre) {
  return fetch("api/music/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      artistName: artist,
      songTitle: song,
      albumName: album,
      genre: genre,
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else if (response.status === 400) {
        return Promise.resolve("song already in database");
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function fetchRatings(song, album, rating) {
  return fetch("api/ratings/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      songTitle: song,
      albumName: album,
      rating: rating
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        console.log(response)
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

const clearInputs = () => {
  document.getElementById("songInput").value = "";
  document.getElementById("artistInput").value = "";
  document.getElementById("albumInput").value = "";
  document.getElementById("categoryInput").value = "";

  const radios = document.querySelectorAll(
    'input[type="radio"][name="rating"]'
  );
  radios.forEach((radio) => {
    radio.checked = false;
  });
};

//refresh page to see new post after submitting

// create music item with song name/album name/genre/and artist_id
// create rating with rating, user_id, music_id,
