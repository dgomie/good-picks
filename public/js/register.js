// deleted async
const signupFormHandler =  (event) => {
  event.preventDefault();

  const username = document.querySelector("#username-register").value.trim();
  const email = document.querySelector("#email-register").value.trim();
  const password = document.querySelector("#password-register").value.trim();
  const passwordConfirm = document
    .querySelector("#password-confirm")
    .value.trim();

  if (password === passwordConfirm) {
    if (username && email && password) {
       fetch("/api/users", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
        headers: { "Content-Type": "application/json" },
      }).then(response  => {
        return response.json()
      }).then(data => {
        console.log(data)
        localStorage.setItem('userId', data.id);
        document.location.replace('/api/spotify/login');
      }).catch(err => {
          alert("Failed to sign up.");
      })
    }
  } else {
    alert("passwords must match");
  };
};

document
  .querySelector("#register-form")
  .addEventListener("click", signupFormHandler);
