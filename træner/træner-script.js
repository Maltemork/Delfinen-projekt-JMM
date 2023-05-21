"use strict";

import { getData, members } from "../crud.js";

window.addEventListener("load", start);

let filteredTeamsArray = [];

async function start() {
  await getData();
  changeTeamTable();
  document
    .querySelector("#sort-dropdown")
    .addEventListener("change", sortTable);
  document.querySelector("#go-to-login").addEventListener("click", () => {
    window.location.href = "../login/login.html";
  });
  document
    .querySelector("#search-members")
    .addEventListener("input", searchMembers);
  document
    .querySelector("#hold-selector")
    .addEventListener("change", changeTeamTable);
  document
    .querySelector("#descipline-times-btn")
    .addEventListener("click", discplineTimesClicked);
}

function changeTeamTable() {
  filteredTeamsArray = [];
  if (document.querySelector("#hold-selector").value == "hold-junior") {
    console.log("JUNIOR GROUP SELECTED");
    clearTable();
    for (let i = 0; i < members.length; i++) {
      if (members[i].group == 1) {
        filteredTeamsArray.push(members[i]);
      }
    }
  } else if (document.querySelector("#hold-selector").value == "hold-senior") {
    console.log("SENIOR GROUP SELECTED");
    clearTable();
    for (let i = 0; i < members.length; i++) {
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
    const name_AZ = filteredTeamsArray.sort((a, b) => {
      let nameA = a.name.toLowerCase();
      let nameB = b.name.toLowerCase();

      if (nameA < nameB) return -1;
      return 1;
    });
    name_AZ.forEach(showMembersTable);
    console.log(name_AZ);
  }
  if (sortOption == "name-ZA") {
    //Sorter efter navn Z-A
    const name_ZA = filteredTeamsArray.sort((a, b) => {
      let nameA = a.name.toLowerCase();
      let nameB = b.name.toLowerCase();

      if (nameA < nameB) return 1;
      return -1;
    });
    name_ZA.forEach(showMembersTable);
    console.log(name_ZA);
  }
  if (sortOption == "age-LOW") {
    const age_LOW = filteredTeamsArray.sort((a, b) => a.age - b.age);
    age_LOW.forEach(showMembersTable);
    console.log(age_LOW);
  }

  if (sortOption == "age-HIGH") {
    const age_HIGH = filteredTeamsArray.sort((a, b) => b.age - a.age);
    age_HIGH.forEach(showMembersTable);
    console.log(age_HIGH);
  }

  if (sortOption == "active-YES") {
    const active_YES = filteredTeamsArray.sort((a, b) => {
      if (a.activity < b.activity) return -1;
      return 1;
    });
    active_YES.forEach(showMembersTable);
  }
  if (sortOption == "active-NO") {
    const active_NO = filteredTeamsArray.sort((a, b) => {
      if (a.activity > b.activity) return -1;
      return 1;
    });
    active_NO.forEach(showMembersTable);
  }
}

/* ----- Seach - Member -----*/
function searchMembers() {
  clearTable();
  const searchInput = document
    .querySelector("#search-members")
    .value.toLowerCase();
  //filter members based on search input, without being case sensitive.
  const filteredMembers = filteredTeamsArray.filter(member =>
    member.name.toLowerCase().includes(searchInput)
  );
  if (searchInput.length !== 0) {
    filteredMembers.forEach(showMembersTable);
  } else {
    filteredTeamsArray.forEach(showMembersTable);
  }
}

function clearTable() {
  document.querySelector("#members-table").innerHTML =
    /*HTML*/
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

/* ------ Discipline and Time Dialog ------ */
function discplineTimesClicked() {
  clearTables(); //Clear all tables before opening dialog to prevent duplication
  const dialog = document.querySelector("#discipline-times-dialog");
  dialog.showModal();
  document
    .querySelector("#close-discipline-times-dialog")
    .addEventListener("click", () => {
      dialog.close();
    });

  //Discipline arrays with members of each discipline
  const backCrawlArray = [];
  const butterFlyArray = [];
  const chestArray = [];
  const crawlArray = [];

  const groupSelector = document.querySelector("#hold-selector");

  if (groupSelector.value == "hold-junior") {
    members.forEach(member => {
      if (member.group == 1) {
        fillDisciplineArrays(member);
      }
    });
  } else if (groupSelector.value == "hold-senior") {
    members.forEach(member => {
      if (member.group == 2) {
        fillDisciplineArrays(member);
      }
    });
  }

  function fillDisciplineArrays(member) {
    if (member.disciplines) {
      const disciplinesKeysArray = Object.keys(member.disciplines);
      for (let i = 0; i < disciplinesKeysArray.length; i++) {
        switch (disciplinesKeysArray[i]) {
          case "backcrawl":
            backCrawlArray.push(member);
            break;
          case "butterfly":
            butterFlyArray.push(member);
            break;
          case "chest":
            chestArray.push(member);
            break;
          case "crawl":
            crawlArray.push(member);
            break;
        }
      }
    }
  }
  showDisciplineTables();

  console.log("Back Crawl Members:");
  console.log(backCrawlArray);
  console.log("Butterfly Members:");
  console.log(butterFlyArray);
  console.log("Chest Members:");
  console.log(chestArray);
  console.log("Crawl Members:");
  console.log(crawlArray);

  function showDisciplineTables() {
    const MAX_SHOWN = 5;
    //---------- Backcrawl Table -----------
    for (let i = 0; i < MAX_SHOWN; i++) {
      const sortedArray = backCrawlArray.sort(
        (a, b) =>
          b.disciplines.backcrawl.time1.time -
          a.disciplines.backcrawl.time1.time
      );
      const member = sortedArray[i];
      document.querySelector("#backcrawl-table").insertAdjacentHTML(
        "beforeend",
        /* html */ `
          <tr>
            <td>${member.group}</td>
            <td>${member.name}</td>
            <td>${member.age}</td>
            <td>${member.email}</td>
            <td>${member.disciplines.backcrawl.time1.time}</td>
            <td>${member.disciplines.backcrawl.time1.date}</td>
          </tr>
      `
      );
    }
    //---------- Butterfly Table ----------
    for (let i = 0; i < MAX_SHOWN; i++) {
      const sortedArray = butterFlyArray.sort(
        (a, b) =>
          b.disciplines.butterfly.time1.time -
          a.disciplines.butterfly.time1.time
      );
      const member = sortedArray[i];
      document.querySelector("#butterfly-table").insertAdjacentHTML(
        "beforeend",
        /* html */ `
          <tr>
            <td>${member.group}</td>
            <td>${member.name}</td>
            <td>${member.age}</td>
            <td>${member.email}</td>
            <td>${member.disciplines.butterfly.time1.time}</td>
            <td>${member.disciplines.butterfly.time1.date}</td>
          </tr>
      `
      );
    }
    //---------- Chest Table ----------
    for (let i = 0; i < MAX_SHOWN; i++) {
      const sortedArray = chestArray.sort(
        (a, b) =>
          b.disciplines.chest.time1.time - a.disciplines.chest.time1.time
      );
      const member = sortedArray[i];
      document.querySelector("#chest-table").insertAdjacentHTML(
        "beforeend",
        /* html */ `
          <tr>
            <td>${member.group}</td>
            <td>${member.name}</td>
            <td>${member.age}</td>
            <td>${member.email}</td>
            <td>${member.disciplines.chest.time1.time}</td>
            <td>${member.disciplines.chest.time1.date}</td>
          </tr>
      `
      );
    }
    //---------- Crawl Table ----------
    for (let i = 0; i < MAX_SHOWN; i++) {
      const sortedArray = crawlArray.sort(
        (a, b) =>
          b.disciplines.crawl.time1.time - a.disciplines.crawl.time1.time
      );
      const member = sortedArray[i];
      document.querySelector("#crawl-table").insertAdjacentHTML(
        "beforeend",
        /* html */ `
          <tr>
            <td>${member.group}</td>
            <td>${member.name}</td>
            <td>${member.age}</td>
            <td>${member.email}</td>
            <td>${member.disciplines.crawl.time1.time}</td>
            <td>${member.disciplines.crawl.time1.date}</td>
          </tr>
      `
      );
    }
  }
  //Clear all tables
  function clearTables() {
    const disciplines = ["backcrawl", "butterfly", "chest", "crawl"];
    for (const discipline of disciplines) {
      const table = document.querySelector(`#${discipline}-table`);
      table.innerHTML = "";
      table.insertAdjacentHTML(
        "beforeend",
        /* html */ `
        <tr>
          <td>Hold</td>
          <td>Navn</td>
          <td>Alder</td>
          <td>E-mail</td>
          <td>Tid</td>
          <td>Dato</td>
        </tr>
      `
      );
    }
  }
}
