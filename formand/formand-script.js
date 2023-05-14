"use strict";

import {
  editMemberClicked,
  deleteClicked,
  createClicked,
  members,
  getData,
} from "../crud.js";

window.addEventListener("load", start);

async function start() {
  await getData();
  console.log("Formand is running! 😊");
  members.forEach(formandMembersTable);
  document
    .querySelector("#create-member-btn")
    .addEventListener("click", createClicked);
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
          <tr id="table-${member.id}" class="table-item">
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
      .addEventListener("click", () => {
        editMemberClicked(member);
      });
    document
      .querySelector(`#delete-${member.id}`)
      .addEventListener("click", () => {
        deleteClicked(member);
      });
  }
}
