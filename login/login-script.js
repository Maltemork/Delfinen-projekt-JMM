"use strict";

import { users, getData } from "../crud.js";

window.addEventListener("load", start);

async function start() {
  await getData();
  document
    .querySelector("#login-submit")
    .addEventListener("click", checkDetailsOnLogin);
}

function checkDetailsOnLogin() {
  console.log("Checking login");
  const usernameValue = document.querySelector("#login-username").value;
  const passwordValue = document.querySelector("#login-password").value;

  for (let i = 0; i < users.length; i++) {
    if (
      users[i].username == usernameValue &&
      users[i].password === passwordValue
    ) {
      window.location.href = `/${users[i].type}/${users[i].type}.html`;
      console.log(users[i]);
    } else if (users.length - 1 === i) {
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
