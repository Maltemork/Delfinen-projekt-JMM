"use strict";

import { getData, members } from "../crud.js";

window.addEventListener("load", start);

async function start() {
  await getData();
  members.forEach(showKassererMembersTable);
  document
    .querySelector("#arrears-members-btn")
    .addEventListener("click", arrearsBtnClicked);
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
