"use strict";

import { getData, members } from "../crud.js";

window.addEventListener("load", start);

async function start() {
  await getData();
  members.forEach(kassererMembersTable);
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
