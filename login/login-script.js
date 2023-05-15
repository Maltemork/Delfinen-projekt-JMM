"use strict";

import { users, getData } from "../crud.js";

window.addEventListener("load", start);

async function start() {
  await getData();
  document.querySelector("#login-form").addEventListener("submit", checkDetailsOnLogin);
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
      window.location.href = `/${users[i].type}/${users[i].type}.html`;
      console.log(users[i]);
    } else if (users.length === i) {
      document
        .querySelector(".login-container")
        .classList.add("wrong-password");
      document.querySelector("#wrong-password-text").textContent =
        "Wrong password. Please try again.";
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
