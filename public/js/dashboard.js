// const { User, Music, Rating } = require('../../models');
document.addEventListener('DOMContentLoaded', (event) => {
const songName = document.getElementById('name').value.trim();
const artistName = document.getElementById('artist-pick').value.trim();
const albumName = document.getElementById('album-pick').value.trim();
const genre = document.getElementById('category').value.trim();
let rating = 1

let stars = document.getElementsByName('rating');

// Add an event listener to each star
for(let i = 0; i < stars.length; i++) {
    stars[i].addEventListener('click', function() {
        // This will log the value of the clicked star
        rating = parseInt(this.value, 10)
    });
}

window.addEventListener('submit', function(event) {
    if (event.target.matches('#formID')) {
        event.preventDefault();
            console.log("song name", songName);
            console.log("artist", artistName);
            console.log("album name", albumName);
            console.log("genre", genre);
            clearInputs()
    // create artist name and pull img if doesn't exist in db
    // create music item with song name/album name/genre/and artist_id
    // create rating with rating, user_id, music_id,
    }
}, true);


const clearInputs = () =>{
    document.getElementById('name').value = '';
    document.getElementById('artist-pick').value = '';
    document.getElementById('album-pick').value = '';
    document.getElementById('category').value = '';
    const radios = document.querySelectorAll('input[type="radio"][name="rating"]');

    // Loop over the radio buttons and set their checked property to false
    radios.forEach(radio => {
        radio.checked = false;
    });
    
}





});
