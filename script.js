"use strict";

window.addEventListener("load", start);

const endpoint = "https://delfinen-4077b-default-rtdb.europe-west1.firebasedatabase.app/";

const members = [];
const users = [];

async function start() {
  getData();
  console.log("App is running! 😊");
}

async function getData() {
  console.log("Getting data!");
  
  const responseUsers = await fetch(`${endpoint}/users.json`)
  const dataUsers = await responseUsers.json();

  const responseMembers = await fetch(`${endpoint}/members.json`);
  const dataMembers = await responseMembers.json();

  users.push(dataUsers);
  members.push(dataMembers);
}

