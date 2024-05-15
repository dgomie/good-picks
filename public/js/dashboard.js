document.addEventListener('DOMContentLoaded', (event) => {
    const closeBtn = document.getElementById('closeBtn');
    closeBtn.addEventListener('click', clearInputs)
    
    let rating = 1;
    let stars = document.getElementsByName('rating');

    // Add an event listener to each star
    for(let i = 0; i < stars.length; i++) {
        stars[i].addEventListener('click', function() {
            // This will log the value of the clicked star
            rating = parseInt(this.value, 10);
        });
    }

    window.addEventListener('submit', function(event) {
        if (event.target.matches('#formID')) {
            event.preventDefault();

            // Get the form input values here, when the form is submitted
            const song = document.getElementById('songInput').value.trim();
            const artist = document.getElementById('artistInput').value.trim();
            const album = document.getElementById('albumInput').value.trim();
            const genre = document.getElementById('categoryInput').value.trim();

            console.log("song name", song);
            console.log("artist", artist);
            console.log("album name", album);
            console.log("genre", genre);
            console.log("rating", rating);

            // create new artist in db if not already there
            fetch('api/artists/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    artistName: artist,
                })
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            })
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error(error);
            });
            // create new song using music routes
            fetch('api/music/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    artistName: artist,
                    songTitle: song,
                    albumName: album,
                    genre: genre
                })
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            })
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error(error);
            });
          
            }
    });
});


const clearInputs = () => { 
    document.getElementById('songInput').value = '';
    document.getElementById('artistInput').value = '';
    document.getElementById('albumInput').value = '';
    document.getElementById('categoryInput').value = "";

    const radios = document.querySelectorAll('input[type="radio"][name="rating"]');
    radios.forEach(radio => {
        radio.checked = false;
    });
};
  
   

//refresh page to see new post after submitting 

    // create music item with song name/album name/genre/and artist_id
    // create rating with rating, user_id, music_id,