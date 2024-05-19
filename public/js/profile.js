async function deleteArtist(){
  const artists = document.querySelectorAll('li');
  const deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = '🗑';
deleteBtn.classList.add("flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600");

artists.appendChild(deleteBtn);

deleteBtn.addEventListener('click', async () => {
  const response = await fetch(`/api/spotify/tracks/${trackName}`, {
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