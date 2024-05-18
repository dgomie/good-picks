window.addEventListener("submit", function (event) {
  if (event.target.matches("#formID")) {
    event.preventDefault();

    closeBtn.addEventListener("click", clearInputs);

    // Get the form input values here, when the form is submitted
    const songInput = document.getElementById("songInput").value.trim();
    const artistInput = document.getElementById("artistInput").value.trim();
    // const albumInput = document.getElementById("albumInput").value.trim();
    // const genreInput = document.getElementById("categoryInput").value.trim();

    console.log(
      `song: ${songInput} artist:${artistInput}`
    );

    fetch(`/api/spotify/artist/${encodeURIComponent(artistInput)}/${encodeURIComponent(songInput)}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        const albumId = data.body.tracks.items[0].album.id;
        const albumName = data.body.tracks.items[0].album.name;
        const albumImgUrl = data.body.tracks.items[0].album.images[0].url;
        const songName = data.body.tracks.items[0].name;
        const artistName = data.body.tracks.items[0].album.artists[0].name;
        const artistId = data.body.tracks.items[0].album.artists[0].id;

        console.log("Album Name", albumName);
        console.log("Album Img", albumImgUrl);
        console.log("Song Title", songName);
        console.log("Artist Name", artistName);
        console.log("Album Id", albumId);
        console.log("Artist Id", artistId);

        return {
          artistName: artistName,
          artistId: artistId,
          songName: songName,
          albumName: albumName,
          albumImgUrl: albumImgUrl,
        };
      })
      .then(({ artistName, artistId, songName, albumName, albumImgUrl }) => {
        return fetch("/api/artists", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            artistName: artistName,
            artistId: artistId,
          }),
        })
        .then(() => ({ artistName, songName, albumName, albumImgUrl }));
      })
      .then(({ artistName, songName, albumName, albumImgUrl }) => {
        fetch("/api/music", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            artistName: artistName,
            songTitle: songName,
            albumName: albumName,
            albumImg: albumImgUrl,
          }),
        })
        .then((response) => response.json())
        .then((data) => {
          console.log("POST request success:", data);
          const ratingInput = document.querySelector('input[name="rating"]:checked').value;
          console.log("Data", data)
          console.log(`Data stingified ${data.album}, ${data.title}, ${ratingInput}`)
          return fetch("/api/ratings/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              songTitle: songName,
              albumName: albumName,
              rating: ratingInput,
            }),
          });
        })
        .then((response) => response.json())
        .then((data) => {
          console.log("POST request success:", data);
          location.reload();
      })
        .catch((error) => {
          console.error("Error:", error);
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
      

    // brackets for event listener
  }
});

const clearInputs = () => {
  document.getElementById("songInput").value = "";
  document.getElementById("artistInput").value = "";
  document.getElementById("categoryInput").value = "";

  const radios = document.querySelectorAll(
    'input[type="radio"][name="rating"]'
  );
  radios.forEach((radio) => {
    radio.checked = false;
  });
};

// //refresh page to see new post after submitting

// // create music item with song name/album name/genre/and artist_id
// // create rating with rating, user_id, music_id
