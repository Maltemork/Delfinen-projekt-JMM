"use strict";

window.addEventListener("load", start);

const endpoint =
  "https://delfinen-4077b-default-rtdb.europe-west1.firebasedatabase.app/";

const members = [];
const users = [];

async function start() {
  await getData();
  console.log("App is running! 😊");
  members.forEach(formandMembersTable);
}

function checkDetailsOnLogin() {
  const username = document.querySelector("#login-username").value;
}

// Get data from endpoint - gets both members and users
async function getData() {
  console.log("Getting data!");

  const responseUsers = await fetch(`${endpoint}/users.json`);
  const dataUsers = await responseUsers.json();

  const responseMembers = await fetch(`${endpoint}/members.json`);
  const dataMembers = await responseMembers.json();

  prepareData(dataUsers, dataMembers);
}

// prepares the json data from getData and sends it to the global arrays.
function prepareData(dataUsers, dataMembers) {
  // push every object in dataUsers into the global users array
  for (const key in dataUsers) {
    const data = dataUsers[key];
    data.id = key;
    users.push(data);
  }

  // push every object in dataMembers into the global members array
  for (const key in dataMembers) {
    const data = dataMembers[key];
    data.id = key;
    members.push(data);
  }
}

function formandMembersTable(member) {
  insertMember(member);

  // Insert member function
  function insertMember(member) {
    const table = document.querySelector("#formand-members-table");
    if (member.activity === "active") {
      table.insertAdjacentHTML(
        "beforeend",
        /*html*/ `
          <tr id="table-${member.id}">
            <td>✔</td>
            <td>${member.name}</td>
            <td>${member.email}</td>
            <td>${member.phone}</td>
            <td>${member.age}</td>
            <td>${member.type}</td>
            <td><button id="edit-${member.id}">🖊</button></td>
            <td><button id="delete-${member.id}">🗑</button></td>
          </tr>
          `
      );
    } else {
      table.insertAdjacentHTML(
        "beforeend",
        /*html*/ `
          <tr id="table-${member.id}" class="table-item">
            <td>✖</td>
            <td>${member.name}</td>
            <td>${member.email}</td>
            <td>${member.phone}</td>
            <td>${member.age}</td>
            <td>${member.type}</td>
            <td><button id="edit-${member.id}">🖊</button></td>
            <td><button id="delete-${member.id}">🗑</button></td>
          </tr>
          `
      );
    }
    document
      .querySelector(`#edit-${member.id}`)
      .addEventListener("click", editMemberPlaceholderFunction);
    document
      .querySelector(`#delete-${member.id}`)
      .addEventListener("click", () => {
        deleteClicked(member.id);
      });
  }

  function editMemberPlaceholderFunction() {
    console.log(member);
  }
}

function deleteClicked(memberId) {
  console.log("Delete clicked");
  document.querySelector("#delete-dialog").showModal();
  document
    .querySelector("#confirm-delete-btn")
    .addEventListener("click", () => {
      deleteMember(memberId);
    });
  document.querySelector("#cancel-delete-btn").addEventListener("click", () => {
    document.querySelector("#delete-dialog").close();
    document
      .querySelector("#cancel-delete-btn")
      .removeEventListener("click", () => {
        document.querySelector("#delete-dialog").close();
      });
  });

  async function deleteMember(memberId) {
    console.log("Deleting member");
    const response = await fetch(`${endpoint}/members/${memberId}.json`, {
      method: "DELETE",
    });
    if (response.ok) {
      console.log("Deletion successful");
      location.reload();
      //Update what is shown?
    } else {
      console.log("Error in deleting: " + memberId);
    }
  }
}
