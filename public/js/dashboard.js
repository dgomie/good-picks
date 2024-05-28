let page = 1;
let inProgress = false;

function loadMoreRatings() {
  if (inProgress) return;
  inProgress = true;

  fetch(`api/ratings/html/${page}`)
    .then(response => response.text())
    .then(data => {
      // If the server returns an empty string, there's no more data
      if (data === '') {
        inProgress = false;
        return;
      }

      document.getElementById('feed').innerHTML += data;

      const userData = localStorage.getItem('userId');
      const cardBtns = document.querySelectorAll(`.user-id-${userData}`);

      cardBtns.forEach(btn => {
        btn.classList.remove('hidden');
      });

      inProgress = false;
      page++;
    });
}

window.onscroll = function() {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    console.log("reached bottom");
    loadMoreRatings();
  }
};

loadMoreRatings();

window.addEventListener("submit", function(event) {
  if (event.target.matches("#formID")) {
    event.preventDefault();

    closeBtn.addEventListener("click", clearInputs);

    const songInput = document.getElementById("songInput").value.trim();
    const artistInput = document.getElementById("artistInput").value.trim();
    console.log(`song: ${songInput} artist:${artistInput}`);

    fetch(`/api/spotify/artist/${encodeURIComponent(artistInput)}/${encodeURIComponent(songInput)}`)
      .then(response => response.json())
      .then(data => {
        console.log("Success:", data);

        if (data.body.tracks.items.length === 0) {
          console.log("Can't find song");
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
          .then(response => response.json())
          .then(data => {
            console.log("POST request success:", data);
            const ratingInput = document.querySelector('input[name="rating"]:checked').value;
            console.log("Data", data);
            console.log(`Data stingified ${data.album}, ${data.title}, ${ratingInput}`);
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
          .then(response => response.json())
          .then(data => {
            console.log("POST request success:", data);
            location.reload();
          })
          .catch(error => {
            console.error("Error:", error);
          });
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }
});

const clearInputs = () => {
  document.getElementById("songInput").value = "";
  document.getElementById("artistInput").value = "";
  document.getElementById("categoryInput").value = "";

  const radios = document.querySelectorAll(
    'input[type="radio"][name="rating"]'
  );
  radios.forEach(radio => {
    radio.checked = false;
  });
};

//delete button logic
document.addEventListener("DOMContentLoaded", function() {
  document.body.addEventListener("click", function(event) {
    // Event delegation for delete buttons
    if (event.target.matches(".deleteRating, .deleteRating *")) {
      event.preventDefault();
      let target = event.target;
      while (!target.classList.contains("deleteRating")) {
        target = target.parentElement;
      }

      const ratingId = target.dataset.id;
      console.log("Delete button clicked:", target);
      console.log("Rating ID:", ratingId);

      fetch(`/api/ratings/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: ratingId,
        }),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log("Delete response:", data);
          location.reload();
        })
        .catch(error => {
          console.error("There was a problem with the fetch operation:", error);
        });
    }
  });
});

// edit rating
let ratingId;

document.addEventListener("DOMContentLoaded", function() {
  document.body.addEventListener('click', function(event) {
    let target = event.target;
    
    // Open the modal when the edit button is clicked
    if (target.matches('svg') && target.closest('[data-modal-target="popup-modal"]')) {
      target = target.closest('[data-modal-target="popup-modal"]');
    }

    if (target.matches('[data-modal-target="popup-modal"]')) {
      event.preventDefault();
      console.log("edit clicked");
      ratingId = target.dataset.id;
      document.getElementById('popup-modal').classList.remove('hidden');
    }

    // Close the modal when the close button or the overlay is clicked
    if (target.matches('[data-modal-hide="popup-modal"]')) {
      event.preventDefault();
      document.getElementById('popup-modal').classList.add('hidden');
    }

    // Handle rating update submission
    if (target.matches('svg') && target.closest('.submit-rating')) {
      target = target.closest('.submit-rating');
    }

    if (target.matches('.submit-rating')) {
      event.preventDefault();
    
      const newRatingElement = document.querySelector('input[name="editRating"]:checked');
      if (newRatingElement !== null) {
        const newRating = newRatingElement.value;
    
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
          console.log("Rating Updated");
          location.reload();
        });
      }
    }
  });
});