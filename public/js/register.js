// deleted async
const signupFormHandler = (event) => {
  event.preventDefault();

  const warningBanner = document.querySelector("#warning-banner");
  const warningMessage = document.querySelector("#warning-message");

  const username = document.querySelector("#username-register").value.trim();
  const email = document.querySelector("#email-register").value.trim();
  const password = document.querySelector("#password-register").value.trim();
  const passwordConfirm = document
    .querySelector("#password-confirm")
    .value.trim();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      document.querySelector("#warning-banner").classList.remove("hidden");
      document.querySelector("#warning-message").innerHTML = "Invalid email format";
      return;
    }

  if (password === passwordConfirm) {
    if (password.length > 8) {
      if (username && email && password) {
        fetch("api/users", {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        })
        .then((response) => {
          return response.json()
        })
        .then((data) => {

          let credentialsExist = false
          for (let i = 0; i < data.length; i++) {
            if (email === data[i].email){
              warningBanner.classList.remove("hidden");
              warningMessage.innerHTML = "Email already registered";
              credentialsExist = true;
              break;
            } else if (username === data[i].name){
              warningBanner.classList.remove("hidden");
              warningMessage.innerHTML = "Username already taken";
              credentialsExist = true;
              break;
            }
          }

          if (!credentialsExist) {
            fetch("/api/users", {
              method: "POST",
              body: JSON.stringify({ username, email, password }),
              headers: { "Content-Type": "application/json" }
            })
              .then((response) => {
                return response.json();
              })
              .then((data) => {
                console.log(data);
                localStorage.setItem("userId", data.id);
                document.location.replace("/api/spotify/login");
              })
              .catch((err) => {
                alert("Failed to sign up.");
              });
          }
        })
      } else {
        warningBanner.classList.remove("hidden");
        warningMessage.innerHTML = "Please enter all fields";
      }
    } else {
      warningBanner.classList.remove("hidden");
      warningMessage.innerHTML = "Passwords must be at least 8 characters";
    }
  } else {
    warningBanner.classList.remove("hidden");
    warningMessage.innerHTML = "Passwords must match";
  }
};

document
  .querySelector("#register-form")
  .addEventListener("click", signupFormHandler);
