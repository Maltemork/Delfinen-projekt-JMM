"use strict";

window.addEventListener("load", start);

const endpoint =
  "https://delfinen-4077b-default-rtdb.europe-west1.firebasedatabase.app/";

const members = [];
const users = [];

async function start() {
  getData();
  console.log("App is running! 😊");

  document
    .querySelector("#create-member-btn")
    .addEventListener("click", createClicked);
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

/* ------ Create New Member ------- */
function createClicked() {
  console.log("New Member Clicked");
  document.querySelector("#create-dialog").showModal();
  document
    .querySelector("#create-form")
    .addEventListener("submit", createMember);
}

function createMember(event) {
  event.preventDefault();
  document
    .querySelector("#create-form")
    .removeEventListener("submit", createMember);

  const createForm = document.querySelector("#create-form");

  const newMember = {
    activity: createForm.activity.value,
    age: createForm.age.value,
    arrears: 0,
    competition: { lokation: "", meet: "", time: "" },
    disciplines: chosenDisciplines(),
    group: correctGroup(),
    name: createForm.name.value,
    subscription: correctSubscription(),
    type: createForm.type.value,
  };

  createdMemberSend(newMember);
  document.querySelector("#create-form").reset();
  document.querySelector("#create-dialog").close();

  function correctSubscription() {
    let subscription = 0;
    if (createForm.age.value < 18) {
      subscription = 1000;
    } else if (createForm.age.value <= 60) {
      subscription = 1600;
    } else {
      subscription = 1200;
    }
    if (createForm.activity.value == "passive") {
      subscription = 500;
    }
    return subscription;
  }

  function correctGroup() {
    let group = 0;
    if (createForm.type.value == "comp") {
      if (createForm.age.value < 18) {
        group = 1;
      } else {
        group = 2;
      }
    }
    return group;
  }

  function chosenDisciplines() {
    console.log("Chosen Disciplines");
    const disciplines = {};

    if (createForm.type.value == "comp") {
      const inputs = createForm.querySelectorAll("input[type='checkbox']");
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

  async function createdMemberSend(newMember) {
    console.log("Posting member");

    const jsonString = JSON.stringify(newMember);

    const response = await fetch(`${endpoint}/members.json`, {
      method: "POST",
      body: jsonString,
    });

    if (response.ok) {
      console.log("Member Creation Successful");
    } else {
      console.log("Error during posting");
    }
  }
}
