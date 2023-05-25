/**
 * This script is for any logic concerning the view for Kasserer.
 * The Kasserer can see all the members and their subscription
 * and arrears with the option to sort and search.
 * Furthermore the Kasserer can see an overview
 * of the expected budget for the club and the sum of money
 * from unpayed subscriptions.
 */

"use strict";

import { getData, members } from "../crud.js";

window.addEventListener("load", start);

async function start() {
  await getData();
  members.forEach(showMembersTable);
  calculateAndDisplayTotal();

  sortKassererTable();
  document
    .querySelector("#sort-dropdown")
    .addEventListener("change", sortKassererTable);
  document.querySelector("#go-to-login").addEventListener("click", () => {
    window.location.href = "../login/login.html";
  });
  document
    .querySelector("#search-members")
    .addEventListener("input", searchMembers);
  document
    .querySelector("#close-arrears-dialog")
    .addEventListener("click", () => {
      document.querySelector("#arrears-dialog").close();
    });
}
//Shows table with all members
function showMembersTable(member) {
  document.querySelector("#members-table-body").insertAdjacentHTML(
    "beforeend",
    /* html */ `
        <tr class="table-item">
          <td>${isActiveSymbol(member.activity)}</td>
          <td>${member.name}</td>
          <td>${member.age}</td>
          <td>${member.email}</td>
          <td>${member.phone}</td>
          <td>${member.subscription} kr.</td>
          <td>${hasPayedSymbol(member.arrears)}</td>
        </tr>
      `
  );
}
//Returns correct symbol based on activity
function isActiveSymbol(activity) {
  if (activity == "active") {
    return "✔";
  } else {
    return "✖";
  }
}
//Returns correct symbol based on arrears
function hasPayedSymbol(arrears) {
  if (arrears == 0) {
    return "✔";
  } else {
    return "✖";
  }
}

function arrearsBtnClicked() {
  const dialog = document.querySelector("#arrears-dialog");
  document.querySelector("#arrears-table-body").innerHTML = "";
  members.forEach(member => {
    if (member.arrears == 1) {
      document.querySelector("#arrears-table-body").insertAdjacentHTML(
        "beforeend",
        /* html */ `
        <tr class="table-item">
          <td>${isActiveSymbol(member.activity)}</td>
          <td>${member.name}</td>
          <td>${member.age}</td>
          <td>${member.email}</td>
          <td>${member.phone}</td>
          <td>${member.subscription} kr.</td>
          <td>${hasPayedSymbol(member.arrears)}</td>
        </tr>
      `
      );
    }
  });
  dialog.showModal();
}

function sortKassererTable() {
  clearTable();

  const sortOption = document.querySelector("#sort-dropdown").value;

  // læser værdien i dropdown menuen og sorterer efter valgt.
  if (sortOption == "name-AZ") {
    // Sorter efter navn A-Z.
    const name_AZ = members.sort((a, b) => {
      let nameA = a.name.toLowerCase();
      let nameB = b.name.toLowerCase();

      if (nameA < nameB) return -1;
      return 1;
    });
    name_AZ.forEach(showMembersTable);
  }
  if (sortOption == "name-ZA") {
    //Sorter efter navn Z-A
    const name_ZA = members.sort((a, b) => {
      let nameA = a.name.toLowerCase();
      let nameB = b.name.toLowerCase();

      if (nameA < nameB) return 1;
      return -1;
    });
    name_ZA.forEach(showMembersTable);
  }
  if (sortOption == "age-LOW") {
    const age_LOW = members.sort((a, b) => a.age - b.age);
    age_LOW.forEach(showMembersTable);
    console.log(age_LOW);
  }

  if (sortOption == "age-HIGH") {
    const age_HIGH = members.sort((a, b) => b.age - a.age);
    age_HIGH.forEach(showMembersTable);
    console.log(age_HIGH);
  }
  if (sortOption == "subscription-HIGH") {
    const subscription_HIGH = members.sort((a, b) => {
      if (a.subscription > b.subscription) return -1;
      return 1;
    });
    subscription_HIGH.forEach(showMembersTable);
  }
  if (sortOption == "subscription-LOW") {
    const subscription_LOW = members.sort((a, b) => {
      if (a.subscription < b.subscription) return -1;
      return 1;
    });
    subscription_LOW.forEach(showMembersTable);
  }

  if (sortOption == "active-YES") {
    const active_YES = members.sort((a, b) => {
      if (a.activity < b.activity) return -1;
      return 1;
    });
    active_YES.forEach(showMembersTable);
  }
  if (sortOption == "active-NO") {
    const active_NO = members.sort((a, b) => {
      if (a.activity > b.activity) return -1;
      return 1;
    });
    active_NO.forEach(showMembersTable);
  }
  if (sortOption == "paid-NO") {
    const paid_YES = members.sort((a, b) => {
      if (a.arrears > b.arrears) return -1;
      return 1;
    });
    paid_YES.forEach(showMembersTable);
  }

  document
    .querySelector("#arrears-members-btn")
    .addEventListener("click", arrearsBtnClicked);
}

/* ----- Seach - Member -----*/
function searchMembers() {
  clearTable();
  const searchInput = document
    .querySelector("#search-members")
    .value.toLowerCase();
  //filter members based on search input, without being case sensitive.
  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchInput)
  );
  if (searchInput.length !== 0) {
    filteredMembers.forEach(showMembersTable);
  } else {
    members.forEach(showMembersTable);
  }
}
function calculateAndDisplayTotal() {
  // Beregn det samlede kontingent ved hjælp af reduce()-metoden
  const totalSubscription = members.reduce(
    (total, member) => total + member.subscription,
    0
  );

  // Beregn det samlede ubetalte beløb ved at filtrere medlemmerne baseret på deres restance og summere beløbene
  const totalArrears = members
    .filter(member => member.arrears > 0)
    .reduce((total, member) => total + member.subscription, 0);

  // Opret et nyt div-element til at vise kontingentoplysningerne
  const totalContainer = document.createElement("div");
  totalContainer.classList.add("total-container");

  // Opret elementer til at vise det samlede kontingentbeløb og det ubetalte beløb
  const totalSubscriptionElement = document.createElement("div");
  totalSubscriptionElement.textContent = `Forventet kontingent: ${totalSubscription} kr.`;

  const totalArrearsElement = document.createElement("div");
  totalArrearsElement.textContent = `Ubetalte beløb: ${totalArrears} kr.`;

  // Tilføj elementerne til totalContainer
  totalContainer.appendChild(totalSubscriptionElement);
  totalContainer.appendChild(totalArrearsElement);

  // Indsæt totalContainer før kasserer-members-table
  document
    .querySelector("#members-table")
    .insertAdjacentElement("beforebegin", totalContainer);
}

// Fjerner alt i table.
function clearTable() {
  document.querySelector("#members-table-body").innerHTML = "";
}
