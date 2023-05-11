"use strict";

window.addEventListener("load", start);

const endpoint =
  "https://delfinen-4077b-default-rtdb.europe-west1.firebasedatabase.app/";

const members = [];
const users = [];

async function start() {
  await getData();
  console.log("App is running! 😊");
  members.forEach(formandMembersTable);
  document
    .querySelector("#create-member-btn")
    .addEventListener("click", createClicked);
}

function checkDetailsOnLogin() {
  const username = document.querySelector("#login-username").value;
}

// Get data from endpoint - gets both members and users
async function getData() {
  console.log("Getting data!");

  const responseUsers = await fetch(`${endpoint}/users.json`);
  const dataUsers = await responseUsers.json();

  const responseMembers = await fetch(`${endpoint}/members.json`);
  const dataMembers = await responseMembers.json();

  prepareData(dataUsers, dataMembers);
}

// prepares the json data from getData and sends it to the global arrays.
function prepareData(dataUsers, dataMembers) {
  // push every object in dataUsers into the global users array
  for (const key in dataUsers) {
    const data = dataUsers[key];
    data.id = key;
    users.push(data);
  }

  // push every object in dataMembers into the global members array
  for (const key in dataMembers) {
    const data = dataMembers[key];
    data.id = key;
    members.push(data);
  }
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
          <tr id="table-${member.id}">
            <td>✔</td>
            <td>${member.name}</td>
            <td>${member.email}</td>
            <td>${member.phone}</td>
            <td>${member.age}</td>
            <td>${member.type}</td>
            <td><button id="edit-${member.id}">🖊</button></td>
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
          </tr>
          `
      );
    }
    document
      .querySelector(`#edit-${member.id}`)
      .addEventListener("click", () => {
        editMemberClicked(member);
      });
  }

  function editMemberPlaceholderFunction() {
    console.log(member);
  }
}
/* ------ Create New Member ------- */
function createClicked() {
  console.log("New Member Clicked");
  document.querySelector("#create-dialog").showModal();
  document
    .querySelector("#create-form")
    .addEventListener("submit", createMember);

  const createForm = document.querySelector("#create-form");
  createForm.reset();

  function createMember(event) {
    event.preventDefault();
    document
      .querySelector("#create-form")
      .removeEventListener("submit", createMember);

    const newMember = {
      activity: createForm.activity.value,
      age: createForm.age.value,
      arrears: 0,
      competition: checkCompetition(createForm.type.value),
      disciplines: chosenDisciplines(createForm.type.value, "create"),
      email: createForm.email.value,
      group: correctGroup(createForm.age.value, createForm.type.value),
      name: createForm.name.value,
      phone: createForm.phone.value,
      subscription: correctSubscription(
        createForm.age.value,
        createForm.activity.value
      ),
      type: createForm.type.value,
    };

    createdMemberSend(newMember);

    document.querySelector("#create-dialog").close();
    async function createdMemberSend(newMember) {
      console.log("Posting member");

      const jsonString = JSON.stringify(newMember);

      const response = await fetch(`${endpoint}/members.json`, {
        method: "POST",
        body: jsonString,
      });

      if (response.ok) {
        console.log("Member Creation Successful");
        location.reload();
      } else {
        console.log("Error during posting");
      }
    }
  }
}

function editMemberClicked(member) {
  console.log(`Editing ${member.name}`);
  document
    .querySelector(`#edit-${member.id}`)
    .removeEventListener("click", () => {
      editMemberClicked(member);
    });

  const updateForm = document.querySelector("#update-form");
  updateForm.activity.value = member.activity;
  updateForm.age.value = member.age;
  updateForm.email.value = member.email;
  updateForm.name.value = member.name;
  updateForm.phone.value = member.phone;
  updateForm.type.value = member.type;

  const dialog = document.querySelector("#update-dialog");
  dialog.showModal();

  document
    .querySelector("#update-form")
    .addEventListener("submit", updateMember);

  function updateMember() {
    console.log("Update member");
    document
      .querySelector("#update-form")
      .removeEventListener("submit", updateMember);

    const updatedMember = {
      activity: updateForm.activity.value,
      age: updateForm.age.value,
      arrears: member.arrears,
      competition: checkCompetition(updateForm.type.value),
      disciplines: chosenDisciplines(updateForm.type.value, "update"),
      email: updateForm.email.value,
      group: correctGroup(updateForm.age.value, updateForm.type.value),
      name: updateForm.name.value,
      phone: updateForm.phone.value,
      subscription: correctSubscription(
        updateForm.age.value,
        updateForm.activity.value
      ),
      type: updateForm.type.value,
    };
    sendUpdatedMember(member.id, updatedMember);
    dialog.close();

    async function sendUpdatedMember(memberId, updatedMember) {
      console.log("Updating member");
      console.log(memberId);
      console.log(updatedMember);

      // const jsonString = JSON.stringify(updatedMember);

      // const response = await fetch(`${endpoint}/members/${memberId}.json`, {
      //   method: "PUT",
      //   body: jsonString,
      // });

      // if (response.ok) {
      //   console.log("Update successfull");
      //   location.reload();
      // } else {
      //   console.log("Failed to update");
      // }
    }
  }
}

function correctSubscription(age, activity) {
  let subscription = 0;
  if (age < 18) {
    subscription = 1000;
  } else if (age <= 60) {
    subscription = 1600;
  } else {
    subscription = 1200;
  }
  if (activity == "passive") {
    subscription = 500;
  }
  return subscription;
}

function correctGroup(age, type) {
  let group = 0;
  if (type == "comp") {
    if (age < 18) {
      group = 1;
    } else {
      group = 2;
    }
  }
  return group;
}

function checkCompetition(type) {
  let comp = {};
  if (type == "comp") {
    comp = { lokation: "", meet: "", time: "" };
  }
  return comp;
}

function chosenDisciplines(type, action) {
  console.log("Chosen Disciplines");
  const disciplines = {};

  if (type == "comp") {
    const inputs = document
      .querySelector(`#${action}-form`)
      .querySelectorAll("input[type='checkbox']");
    const selected = [];

    for (const input of inputs) {
      if (input.checked) {
        selected.push(input.value);
      }
    }

    for (const discipline of selected) {
      switch (discipline) {
        case "backcrawl":
          disciplines.backcrawl = { date: [""], time: [0] };
          break;
        case "butterfly":
          disciplines.butterfly = { date: [""], time: [0] };
          break;
        case "chest":
          disciplines.chest = { date: [""], time: [0] };
          break;
        case "crawl":
          disciplines.crawl = { date: [""], time: [0] };
          break;
      }
    }
  }
  return disciplines;
}
