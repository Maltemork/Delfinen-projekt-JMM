"use strict";

import { getData, members } from "../crud.js";

window.addEventListener("load", start);

let filteredTeamsArray = [];

async function start() {
  await getData();
  changeTeamTable();
  document.querySelector("#sort-dropdown").addEventListener("change", sortTable);
  document.querySelector("#go-to-login").addEventListener("click", () => 
  {
    window.location.href = "../login/login.html"
  });
  document.querySelector("#search-members").addEventListener("input", searchMembers);
  document.querySelector("#hold-selector").addEventListener("change", changeTeamTable);
}

function changeTeamTable() {
  filteredTeamsArray = [];
  if (document.querySelector("#hold-selector").value == "hold-junior"){
    console.log("JUNIOR GROUP SELECTED");
    clearTable();
    for (let i = 0; i < members.length; i++){
        if (members[i].group == 1) {
        filteredTeamsArray.push(members[i]);
        }
      }
  } else if (document.querySelector("#hold-selector").value == "hold-senior"){
    console.log("SENIOR GROUP SELECTED");
    clearTable();
    for (let i = 0; i < members.length; i++){
        if (members[i].group == 2) {
        filteredTeamsArray.push(members[i]);
        }
      }
  }
  filteredTeamsArray.forEach(showMembersTable);
}


function showMembersTable(member) {
  document.querySelector("#members-table").insertAdjacentHTML(
    "beforeend",
    /* html */ `
        <tr class="table-item">
          <td>${member.group}</td>
          <td>${isActiveSymbol(member.activity)}</td>
          <td>${member.name}</td>
          <td>${member.age}</td>
          <td>${member.email}</td>
          <td>${member.phone}</td>
        </tr>
      `
  );
}

function isActiveSymbol(activity) {
  if (activity == "active") {
    return "✔";
  } else {
    return "✖";
  }
}

function sortTable() {
  clearTable();
  const sortOption = document.querySelector("#sort-dropdown").value;

  // læser værdien i dropdown menuen og sorterer efter valgt.
  if (sortOption == "name-AZ") {
    // Sorter efter navn A-Z.
    const name_AZ = filteredTeamsArray.sort((a,b) => {
      let nameA = a.name.toLowerCase();
      let nameB = b.name.toLowerCase();
  
      if (nameA < nameB) return -1;
      return 1;
    });
    name_AZ.forEach(showMembersTable);
    console.log(name_AZ)
  }
  if (sortOption == "name-ZA") {
    //Sorter efter navn Z-A
    const name_ZA = filteredTeamsArray.sort((a,b) => {
      let nameA = a.name.toLowerCase();
      let nameB = b.name.toLowerCase();
  
      if (nameA < nameB) return 1;
      return -1;
    });
    name_ZA.forEach(showMembersTable);
    console.log(name_ZA);
  
  }
  if (sortOption == "age-LOW") {
    const age_LOW = filteredTeamsArray.sort((a,b) => a.age - b.age);
    age_LOW.forEach(showMembersTable);
    console.log(age_LOW);
  }

  if (sortOption == "age-HIGH") {
    const age_HIGH = filteredTeamsArray.sort((a,b) => b.age - a.age);
    age_HIGH.forEach(showMembersTable);
    console.log(age_HIGH);
  }

  if (sortOption == "active-YES") {
    const active_YES = filteredTeamsArray.sort((a,b) => {
      if (a.activity < b.activity) return -1;
      return 1;
    });
    active_YES.forEach(showMembersTable);
    
  }
  if (sortOption == "active-NO") {
    const active_NO = filteredTeamsArray.sort((a,b) => {
      if (a.activity > b.activity) return -1;
      return 1;
    });
    active_NO.forEach(showMembersTable);
    
  }
}

/* ----- Seach - Member -----*/
function searchMembers() {
  clearTable();
  const searchInput = document.querySelector("#search-members").value.toLowerCase();
  //filter members based on search input, without being case sensitive.
  const filteredMembers = filteredTeamsArray.filter((member) =>
    member.name.toLowerCase().includes(searchInput)
  );
  if (searchInput.length !== 0) {
    filteredMembers.forEach(showMembersTable);
  } else {
    filteredTeamsArray.forEach(showMembersTable)
  }
}

function clearTable() {
  document.querySelector("#members-table").innerHTML = /*HTML*/
  `
  <tr class="table-item">
        <td>Hold</td>
        <td>Aktiv</td>
        <td>Navn</td>
        <td>Alder</td>
        <td>E-mail</td>
        <td>Telefon</td>
      </tr>`;

}
