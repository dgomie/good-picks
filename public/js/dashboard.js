window.addEventListener("submit", function (event) {
  if (event.target.matches("#formID")) {
    event.preventDefault();

    closeBtn.addEventListener("click", clearInputs);

    // Get the form input values here, when the form is submitted
    const songInput = document.getElementById("songInput").value.trim();
    const artistInput = document.getElementById("artistInput").value.trim();
    const albumInput = document.getElementById("albumInput").value.trim();
    const genreInput = document.getElementById("categoryInput").value.trim();
    const ratingInput = document.querySelector(
      'input[name="rating"]:checked'
    ).value;
    console.log(
      `song: ${songInput} artist:${artistInput}, album: ${albumInput}`
    );

    fetch(
      `/api/spotify/artist/${encodeURIComponent(
        artistInput
      )}/${encodeURIComponent(songInput)}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        const albumId = data.body.tracks.items[0].album.id;
        const albumName = data.body.tracks.items[0].album.name;
        const albumImgUrl = data.body.tracks.items[0].album.images[0].url;
        const songName = data.body.tracks.items[0].name;
        const artistName = data.body.tracks.items[0].album.artists[0].name;

        console.log("Album Name", albumName);
        console.log("Album Img", albumImgUrl);
        console.log("Song Title", songName);
        console.log("Artist Name", artistName);

        fetch('/api/music/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "songName": songName,
            "artistName": artistName,
            "albumName": albumName,
            "albumImgUrl": albumImgUrl
          }),
        });
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('POST request success:', data)
        const ratingInput = document.querySelector(
          'input[name="rating"]:checked'
        ).value;
        fetch('/api/ratings/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "songTitle": songName,
            "albumName": albumName,
            "rating": ratingInput
          }),
        });
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
});

// window.addEventListener("submit", function (event) {
//   if (event.target.matches("#formID")) {
//     event.preventDefault();

//     closeBtn.addEventListener("click", clearInputs);

//     // Get the form input values here, when the form is submitted
//     const songInput = document.getElementById("songInput").value.trim();
//     const artistInput = document.getElementById("artistInput").value.trim();
//     const albumInput = document.getElementById("albumInput").value.trim();
//     const genreInput = document.getElementById("categoryInput").value.trim();
//     const ratingInput = document.querySelector(
//       'input[name="rating"]:checked'
//     ).value;
//     console.log(
//       `song: ${songInput} artist:${artistInput}, album: ${albumInput}`
//     );

//     fetch(
//       `/api/spotify/artist/${encodeURIComponent(
//         artistInput
//       )}/${encodeURIComponent(songInput)}`
//     )
//       .then((response) => response.json())
//       .then((data) => {
//         console.log("Success:", data);
//         const albumId = data.body.tracks.items[0].album.id;
//         const albumName = data.body.tracks.items[0].album.name;
//         const albumImgUrl = data.body.tracks.items[0].album.images[0].url;
//         const songName = data.body.tracks.items[0].name;
//         const artistName = data.body.tracks.items[0].album.artists[0].name;

//         console.log("Album Name", albumName);
//         console.log("Album Img", albumImgUrl);
//         console.log("Song Title", songName);
//         console.log("Artist Name", artistName);

//         return fetch('/api/music/', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             songName: songName,
//             artistName: artistName,
//             albumName: albumName,
//             albumImgUrl: albumImgUrl
//           }),
//         });
//       })
//       .then(response => response.json())
//       .then(data => console.log('POST request success:', data))
//       .catch((error) => {
//         console.error("Error:", error);
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });
//   }
// });

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

// //refresh page to see new post after submitting

// // create music item with song name/album name/genre/and artist_id
// // create rating with rating, user_id, music_id
