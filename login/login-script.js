/**
 * This script is for any logic concerning the view for login.
 * The login page checks if a user exists and if so goes to
 * the correct view.
 */

"use strict";

import { users, getData } from "../crud.js";

window.addEventListener("load", start);

async function start() {
  await getData();
  document
    .querySelector("#login-form")
    .addEventListener("submit", checkDetailsOnLogin);
}

function checkDetailsOnLogin(event) {
  event.preventDefault();

  let usernameValue = document.querySelector("#login-username").value;
  let passwordValue = document.querySelector("#login-password").value;

  console.log("Checking login");

  for (let i = 0; i < users.length; i++) {
    if (
      users[i].username == usernameValue &&
      users[i].password === passwordValue
    ) {
      window.location.href = `../${users[i].type}/${users[i].type}.html`;
      console.log(users[i]);
      break;
    } else if (users.length - 1 === i) {
      document
        .querySelector(".login-container")
        .classList.add("wrong-password");
      document.querySelector("#wrong-password-text").textContent =
        "Forkert brugernavn eller kodeord. Prøv igen.";
      document
        .querySelector(".login-container")
        .addEventListener("animationend", () => {
          document
            .querySelector(".login-container")
            .classList.remove("wrong-password");
        });
    }
  }
}
