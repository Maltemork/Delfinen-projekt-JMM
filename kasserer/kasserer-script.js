"use strict";

import { getData, members } from "../crud.js";

window.addEventListener("load", start);

async function start() {
  await getData();
  members.forEach(kassererMembersTable);
  calculateAndDisplayTotal();
}

function kassererMembersTable(member) {
  const table = document.querySelector("#kasserer-members-table");
  table.insertAdjacentHTML(
    "beforeend",
    /* html */ `
        <tr class="table-item">
          <td>${isActiveHtml()}</td>
          <td>${member.name}</td>
          <td>${member.age}</td>
          <td>${member.email}</td>
          <td>${member.phone}</td>
          <td>${member.subscription} kr.</td>
          <td>${hasPayedHtml()}</td>
        </tr>
      `
  );

  function isActiveHtml() {
    if (member.activity == "active") {
      return "✔";
    } else {
      return "✖";
    }
  }

  function hasPayedHtml() {
    if (member.arrears == 0) {
      return "✔";
    } else {
      return "✖";
    }
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
    .filter((member) => member.arrears > 0)
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
