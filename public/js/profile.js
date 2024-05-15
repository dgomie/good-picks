let artistArray = ["The Beatles", "Dominic Fike", "Kendrick Lamar"]

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
  const deleteBtn = document.createElement('button'); // adding delete button
  deleteBtn.innerHTML = '🗑';
  deleteBtn.classList.add("flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600") // tailwind classes
  listItem.innerHTML = `<img src=${imageLink} width=300>`;
  artistList.appendChild(listItem);
  listItem.appendChild(deleteBtn); //appending to the list item

  // delete an artist event listener
  deleteBtn.addEventListener('click', async () => {
    const response = await fetch(`/api/music/artist/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      listItem.remove();
    } else {
      console.error('Failed to delete artist');
    }
  })
}

artistArray.forEach((artist) => {
  setArtistImage(artist);
});

let songArray = ["Hey Jude", "Ant Pile", "Money Trees"]
// fetches favorite song images
async function fetchSongImage() {
  const response = await fetch(`/api/`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  // if (response.ok) {
  //   const data = await response.json();
  //   console.log("RESPONSE", data)
  //   const imgSource = data.images[0].url; // replace with the correct path to the image URL in the response data
  //   console.log(imgSource)
  //   return imgSource
  // } else {
  //   alert('Failed to fetch artist image.');
  // }
}
// sets the song images
async function setSongImage() {
  const songList = document.querySelector(".song-list");
  const songImageLink = await fetchSongImage();
  const songListItem = document.createElement('li');
  const deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = '🗑';
  deleteBtn.classList.add("flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600");
  songListItem.innerHTML = `<img src=${songImageLink} width=300>`;
  songList.appendChild(songListItem);
  songListItem.appendChild(deleteBtn);

  // delete a song event listener
  deleteBtn.addEventListener('click', async () => {
    const response = await fetch(`/api/music/tracks/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.ok) {
      listItem.remove();
    } else {
      console.error('Failed to delete song');
    }
  });
}
