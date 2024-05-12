let artistArray = ["Rainbow Kitten Surprise", "King Gizzard and the Lizard Wizard", "Dominic Fike", "Kendrick Lamar"]

async function fetchArtistImage(artistName) {
  const response = await fetch(`/api/spotify/artist-image/${artistName}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    const data = await response.json();
    console.log("RESPONSE", data)
    const imgSource = data.images[0].url; // replace with the correct path to the image URL in the response data
    console.log(imgSource)
    return imgSource
  } else {
    alert('Failed to fetch artist image.');
  }
}

async function setArtistImage(artistName) {
    const artistList = document.querySelector(".artist-list");
    const imageLink = await fetchArtistImage(artistName);
    const listItem = document.createElement('li');
    listItem.innerHTML = `<img src=${imageLink}>`;
    artistList.appendChild(listItem);
  }
  
  artistArray.forEach((artist) => {
    setArtistImage(artist);
  });
  