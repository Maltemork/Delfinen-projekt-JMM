"use strict";

import { getData, members } from "../crud.js";

window.addEventListener("load", start);

async function start() {
  await getData();
  members.forEach(showKassererMembersTable);
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
}

function showKassererMembersTable(member) {
  document.querySelector("#kasserer-members-table").insertAdjacentHTML(
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

function isActiveSymbol(activity) {
  if (activity == "active") {
    return "✔";
  } else {
    return "✖";
  }
}

function hasPayedSymbol(arrears) {
  if (arrears == 0) {
    return "✔";
  } else {
    return "✖";
  }
}

function arrearsBtnClicked() {
  const dialog = document.querySelector("#arrears-dialog");
  dialog.innerHTML = "";
  dialog.insertAdjacentHTML(
    "beforeend",
    /* html */ `
    <h3>Medlemmer i restance</h3>
    <table id="arrears-table">
      <tr class="table-item">
        <td>Aktiv</td>
        <td>Navn</td>
        <td>Alder</td>
        <td>E-mail</td>
        <td>Telefon</td>
        <td>Kontigent</td>
        <td>Betalt</td>
      </tr>
    </table>
  `
  );
  members.forEach(member => {
    if (member.arrears == 1) {
      document.querySelector("#arrears-table").insertAdjacentHTML(
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
  document.querySelector("#kasserer-members-table").innerHTML =
    /*HTML*/
    `
  <tr class="table-item">
      <td>Aktiv</td>
      <td>Navn</td>
      <td>Alder</td>
      <td>E-mail</td>
      <td>Telefon</td>
      <td>Kontingent</td>
      <td>
        Betalt
      </td>
  </tr>`;

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
    console.log("HVAD");
    name_AZ.forEach(showKassererMembersTable);
    console.log(name_AZ);
  }
  if (sortOption == "name-ZA") {
    //Sorter efter navn Z-A
    const name_ZA = members.sort((a, b) => {
      let nameA = a.name.toLowerCase();
      let nameB = b.name.toLowerCase();

      if (nameA < nameB) return 1;
      return -1;
    });
    name_ZA.forEach(showKassererMembersTable);
    console.log(name_ZA);
  }
  if (sortOption == "age-LOW") {
    const age_LOW = members.sort((a, b) => {
      if (a.age < b.age) return -1;
      return 1;
    });
    age_LOW.forEach(showKassererMembersTable);
  }
  if (sortOption == "age-HIGH") {
    const age_HIGH = members.sort((a, b) => {
      if (a.age > b.age) return -1;
      return 1;
    });
    age_HIGH.forEach(showKassererMembersTable);
  }
  if (sortOption == "subscription-HIGH") {
    const subscription_HIGH = members.sort((a, b) => {
      if (a.subscription > b.subscription) return -1;
      return 1;
    });
    subscription_HIGH.forEach(showKassererMembersTable);
  }
  if (sortOption == "subscription-LOW") {
    const subscription_LOW = members.sort((a, b) => {
      if (a.subscription < b.subscription) return -1;
      return 1;
    });
    subscription_LOW.forEach(showKassererMembersTable);
  }

  if (sortOption == "active-YES") {
    const active_YES = members.sort((a, b) => {
      if (a.activity < b.activity) return -1;
      return 1;
    });
    active_YES.forEach(showKassererMembersTable);
  }
  if (sortOption == "active-NO") {
    const active_NO = members.sort((a, b) => {
      if (a.activity > b.activity) return -1;
      return 1;
    });
    active_NO.forEach(showKassererMembersTable);
  }
  if (sortOption == "paid-NO") {
    const paid_YES = members.sort((a, b) => {
      if (a.arrears > b.arrears) return -1;
      return 1;
    });
    paid_YES.forEach(showKassererMembersTable);
  }

  document
    .querySelector("#arrears-members-btn")
    .addEventListener("click", arrearsBtnClicked);
}

/* ----- Seach - Member -----*/
function searchMembers() {
  document.querySelector("#kasserer-members-table").innerHTML = `
  <tr class="table-item">
  <td>Aktiv</td>
  <td>Navn</td>
  <td>Alder</td>
  <td>E-mail</td>
  <td>Telefon</td>
  <td>Kontigent</td>
  <td>
    Betalt
  </td>
</tr>
  `;
  const searchInput = document
    .querySelector("#search-members")
    .value.toLowerCase();
  //filter members based on search input, without being case sensitive.
  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchInput)
  );
  if (searchInput.length !== 0) {
    filteredMembers.forEach(showKassererMembersTable);
  } else {
    members.forEach(showKassererMembersTable);
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
  const totalSubscriptionElement = document.createElement("span");
  totalSubscriptionElement.textContent = `Forventet kontingent: ${totalSubscription} kr.`;

  const totalArrearsElement = document.createElement("span");
  totalArrearsElement.textContent = `Ubetalte beløb: ${totalArrears} kr.`;

  // Tilføj elementerne til totalContainer
  totalContainer.appendChild(totalSubscriptionElement);
  totalContainer.appendChild(totalArrearsElement);

  // Indsæt totalContainer før kasserer-members-table
  document
    .querySelector("#kasserer-members-table")
    .insertAdjacentElement("beforebegin", totalContainer);
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
  const totalSubscriptionElement = document.createElement("span");
  totalSubscriptionElement.textContent = `Forventet kontingent: ${totalSubscription} kr.`;

  const totalArrearsElement = document.createElement("span");
  totalArrearsElement.textContent = `Ubetalte beløb: ${totalArrears} kr.`;

  // Tilføj elementerne til totalContainer
  totalContainer.appendChild(totalSubscriptionElement);
  totalContainer.appendChild(totalArrearsElement);

  // Indsæt totalContainer før kasserer-members-table
  document
    .querySelector("#kasserer-members-table")
    .insertAdjacentElement("beforebegin", totalContainer);
}
