// delete account
function deleteAccount(userId) {
    console.log(userId)
    const deleteBtn = document.getElementById('deleteBtn');

    // deleted async and await
    deleteBtn.addEventListener('click', (event) => {
        event.preventDefault();

       fetch(`/api/users/${userId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            console.log('Account deleted');
            localStorage.removeItem('userId');
            document.location.replace('/');    
        }).catch(err => {
            console.log('Failed to delete account')
            alert('Failed to delete account');
        });
    });
}
const userId = localStorage.getItem('userId');

deleteAccount(userId);
