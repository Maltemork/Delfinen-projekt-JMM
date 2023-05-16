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
  document.querySelector("#sort-dropdown").addEventListener("change", sortFormandTable);
  document.querySelector("#go-to-login").addEventListener("click", () => 
  {
    window.location.href = "../login/login.html"
  });

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

function sortFormandTable () {

  document.querySelector("#formand-members-table").innerHTML = /*HTML*/
  `
  <tr class="table-item">
          <td id="sort-ACTIVE">Aktiv</td>
          <td id="sort-NAME">Navn</td>
          <td id="sort-EMAIL">E-mail</td>
          <td id="sort-PHONE">Telefon</td>
          <td id="sort-AGE">Alder</td>
          <td id="sort-TYPE">Type</td>
          <td>Rediger</td>
          <td>Slet</td>
        </tr>`;

  const sortOption = document.querySelector("#sort-dropdown").value;

  // læser værdien i dropdown menuen og sorterer efter valgt.
  if (sortOption == "name-AZ") {
    // Sorter efter navn A-Z.
    const name_AZ = members.sort((a,b) => {
      let nameA = a.name.toLowerCase();
      let nameB = b.name.toLowerCase();
  
      if (nameA < nameB) return -1;
      return 1;
    });
    console.log("HVAD")
    name_AZ.forEach(formandMembersTable);
    console.log(name_AZ)
  }
  if (sortOption == "name-ZA") {
    //Sorter efter navn Z-A
    const name_ZA = members.sort((a,b) => {
      let nameA = a.name.toLowerCase();
      let nameB = b.name.toLowerCase();
  
      if (nameA < nameB) return 1;
      return -1;
    });
    name_ZA.forEach(formandMembersTable);
    console.log(name_ZA);
  
  }
  if (sortOption == "age-LOW") {
    const age_LOW = members.sort((a,b) => {
      if (a.age < b.age) return -1;
      return 1;
    });
    age_LOW.forEach(formandMembersTable);

  }
  if (sortOption == "age-HIGH") {
    const age_HIGH = members.sort((a,b) => {
      if (a.age > b.age) return -1;
      return 1;
    });
    age_HIGH.forEach(formandMembersTable);
    
  }


  if (sortOption == "active-YES") {
    const active_YES = members.sort((a,b) => {
      if (a.activity < b.activity) return -1;
      return 1;
    });
    active_YES.forEach(formandMembersTable);
    
  }
  if (sortOption == "active-NO") {
    const active_NO = members.sort((a,b) => {
      if (a.activity > b.activity) return -1;
      return 1;
    });
    active_NO.forEach(formandMembersTable);
    
  }
  if (sortOption == "memberType") {
    const member_TYPE = members.sort((a,b) => {
      if (a.type > b.type) return -1;
      return 1;
    });
    member_TYPE.forEach(formandMembersTable);
  }
}
