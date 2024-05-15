const songName = document.getElementById('name').value.trim();
const artistName = document.getElementById('artist-pick').value.trim();
const albumName = document.getElementById('album-pick').value.trim();
const genre = document.getElementById('category').value.trim();
let rating = 1
// Get all the stars
let stars = document.getElementsByName('rating');

// Add an event listener to each star
for(let i = 0; i < stars.length; i++) {
    stars[i].addEventListener('click', function() {
        // This will log the value of the clicked star
        rating = parseInt(this.value, 10)
    });
}