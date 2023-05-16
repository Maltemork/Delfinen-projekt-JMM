"use strict";

import { getData, members } from "../crud.js";

window.addEventListener("load", start);

async function start() {
  await getData();
  members.forEach(showMembersTable);
  
  sortTable();
  document.querySelector("#sort-dropdown").addEventListener("change", sortTable);
  document.querySelector("#go-to-login").addEventListener("click", () => 
  {
    window.location.href = "../login/login.html"
  });
  document.querySelector("#search-members").addEventListener("input", searchMembers);
}

function showMembersTable(member) {
  
  document.querySelector("#members-table").insertAdjacentHTML(
    "beforeend",
    /* html */ `
        <tr class="table-item">
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

  document.querySelector("#members-table").innerHTML = /*HTML*/
  `
  <tr class="table-item">
      <td>Aktiv</td>
      <td>Navn</td>
      <td>Alder</td>
      <td>E-mail</td>
      <td>Telefon</td>
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
    name_AZ.forEach(showMembersTable);
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
    name_ZA.forEach(showMembersTable);
    console.log(name_ZA);
  
  }
  if (sortOption == "age-LOW") {
    const age_LOW = members.sort((a,b) => {
      if (a.age < b.age) return -1;
      return 1;
    });
    age_LOW.forEach(showMembersTable);

  }
  if (sortOption == "age-HIGH") {
    const age_HIGH = members.sort((a,b) => {
      if (a.age > b.age) return -1;
      return 1;
    });
    age_HIGH.forEach(showMembersTable);
    
  }

  if (sortOption == "active-YES") {
    const active_YES = members.sort((a,b) => {
      if (a.activity < b.activity) return -1;
      return 1;
    });
    active_YES.forEach(showMembersTable);
    
  }
  if (sortOption == "active-NO") {
    const active_NO = members.sort((a,b) => {
      if (a.activity > b.activity) return -1;
      return 1;
    });
    active_NO.forEach(showMembersTable);
    
  }
}

/* ----- Seach - Member -----*/
function searchMembers() {
  document.querySelector("#members-table").innerHTML = `
  <tr class="table-item">
  <td>Aktiv</td>
  <td>Navn</td>
  <td>Alder</td>
  <td>E-mail</td>
  <td>Telefon</td>
</tr>
  `;
  const searchInput = document.querySelector("#search-members").value.toLowerCase();
  //filter members based on search input, without being case sensitive.
  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchInput)
  );
  if (searchInput.length !== 0) {
    filteredMembers.forEach(showMembersTable);
  } else {
    members.forEach(showMembersTable)
  }
}
