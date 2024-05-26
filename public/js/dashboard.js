window.addEventListener("submit", function (event) {
  if (event.target.matches("#formID")) {
    event.preventDefault();

    
    closeBtn.addEventListener("click", clearInputs);

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
        
        if (data.body.tracks.items.length === 0) {
          console.log("Can't find song")
          document.querySelector("#song-warning").classList.remove("hidden");
        }
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


//delete button logic
const deleteBtns = document.querySelectorAll(".deleteRating");
    deleteBtns.forEach((btn) => {
      btn.addEventListener("click", function(event) {
        event.preventDefault()
        const ratingId = this.dataset.id

        fetch(`/api/ratings/`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: ratingId, 
          }),
        })
        .then(() => {
          location.reload();
        })
  
      });
    });


//update logic
let ratingId;

const editRatingBtn = document.querySelectorAll('[data-modal-target="popup-modal"]');
editRatingBtn.forEach((btn) => {
  btn.addEventListener("click", function(event) {
    event.preventDefault()
    ratingId = btn.dataset.id;
  });
});

const body = document.body;
body.addEventListener('click', function(event) {
  if (event.target.matches('.submit-rating')) {
    event.preventDefault();
    const newRating = document.querySelector('input[name="editRating"]:checked').value;

    fetch(`/api/ratings/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: ratingId,
        rating: newRating
      }),
    })
    .then(() => {
      console.log("Rating Updated")
      location.reload();
    })
  }
});