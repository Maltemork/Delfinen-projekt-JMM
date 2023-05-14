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
          <td>${isActiveHtml(member.activity)}</td>
          <td>${member.name}</td>
          <td>${member.age}</td>
          <td>${member.email}</td>
          <td>${member.phone}</td>
          <td>${member.subscription} kr.</td>
          <td>${hasPayedHtml(member.arrears)}</td>
        </tr>
      `
  );

  function isActiveHtml(activity) {
    if (activity == "active") {
      return "✔";
    } else {
      return "✖";
    }
  }

  function hasPayedHtml(arrears) {
    if (arrears == 0) {
      return "✔";
    } else {
      return "✖";
    }
  }
}
