document.addEventListener('DOMContentLoaded', (event) => {
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
            const songName = document.getElementById('songInput').value.trim();
            const artistName = document.getElementById('artistInput').value.trim();
            const albumName = document.getElementById('albumInput').value.trim();
            const genre = document.getElementById('categoryInput').value.trim();

            console.log("song name", songName);
            console.log("artist", artistName);
            console.log("album name", albumName);
            console.log("genre", genre);
            console.log("rating", rating);
            clearInputs();
        }
    });
});


const clearInputs = () =>{
    document.getElementById('songInput').value = '';
    document.getElementById('artistInput').value = '';
    document.getElementById('albumInput').value = '';
    document.getElementById('categoryInput').value = "";

    const radios = document.querySelectorAll('input[type="radio"][name="rating"]');
    radios.forEach(radio => {
        radio.checked = false;
    });
   ;
   clearInputs();
   //refresh page to see new post
    
}


 // create artist name and pull img if doesn't exist in db
    // create music item with song name/album name/genre/and artist_id
    // create rating with rating, user_id, music_id,





