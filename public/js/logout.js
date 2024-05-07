const logout = async () => {
    // TODO: Add a comment describing the functionality of this expression
    // This sends a POST request to the logout route
    const response = await fetch('/api/users/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
  
    if (response.ok) {
      // TODO: Add a comment describing the functionality of this statement
      // This redirects the user to the login page
      document.location.replace('/login');
    } else {
      alert('Failed to log out');
    }
  };
  
  document.querySelector('#logout').addEventListener('click', logout);