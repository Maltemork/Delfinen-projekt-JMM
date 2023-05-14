("use strict");

window.addEventListener("load", start);

import {
  members,
  users,
  getData,
  createClicked,
  editMemberClicked,
  deleteClicked,
} from "./crud.js";

async function start() {
  await getData();
  console.log("App is running! 😊");
  members.forEach(formandMembersTable);
  document
    .querySelector("#create-member-btn")
    .addEventListener("click", createClicked);
}
