const logout = async () => {
  console.log('logout started')
    const response = await fetch('/api/users/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
  
    if (response.ok) {
      document.location.replace('/logout');
    } else {
      alert('Failed to log out');
    }
  };
  
  document.querySelector('#logout').addEventListener('click', logout);