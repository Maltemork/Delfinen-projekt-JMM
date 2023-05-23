"use strict";

const endpoint =
  "https://delfinen-4077b-default-rtdb.europe-west1.firebasedatabase.app";

const members = [];
const users = [];

/* ------ Read members ------ */
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
/* ------ Delete member ------ */
//When the delete button is clicked
function deleteClicked(member) {
  console.log("Delete clicked");
  const dialog = document.querySelector("#delete-dialog");
  dialog.showModal();
  dialog.addEventListener("cancel", event => {
    /*Prevents the dialog closing when pressing escape 
   to make sure it doesn't send multiple requests at the same time  */
    event.preventDefault();
  });
  //Ask for confirmation
  document.querySelector(
    "#delete-dialog h3"
  ).textContent = `Fjern ${member.name}?`;
  //Confirm button
  document
    .querySelector("#confirm-delete-btn")
    .addEventListener("click", () => {
      deleteMember(member.id);
    });
  //Cancel button
  document.querySelector("#cancel-delete-btn").addEventListener("click", () => {
    location.reload();
  });
  //Delete member in the database by request
  async function deleteMember(memberId) {
    console.log("Deleting member");
    const response = await fetch(`${endpoint}/members/${memberId}.json`, {
      method: "DELETE",
    });
    if (response.ok) {
      console.log("Deletion successful");
      location.reload();
    } else {
      console.log("Error in deleting: " + memberId);
    }
  }
}

/* ------ Create New Member ------- */
//When "new member" button is clicked
function createClicked() {
  console.log("New Member Clicked");
  const dialog = document.querySelector("#create-dialog");
  dialog.showModal();
  dialog.addEventListener("cancel", event => {
    /*Prevents the dialog closing when pressing escape 
   to make sure it doesn't send multiple requests at the same time  */
    event.preventDefault();
  });
  const createForm = document.querySelector("#create-form");
  createForm.reset(); //Reset the form
  //Submit button
  document
    .querySelector("#create-form")
    .addEventListener("submit", createMember);
  //close button
  document.querySelector("#close-create-btn").addEventListener("click", () => {
    location.reload();
  });
  //When the submit button is clicked
  function createMember(event) {
    event.preventDefault();
    document
      .querySelector("#create-form")
      .removeEventListener("submit", createMember);

    //Create the member object
    const newMember = {
      activity: createForm.activity.value,
      age: createForm.age.value,
      arrears: 0,
      competition: hasCompetitions(),
      disciplines: chosenDisciplines(),
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
    document.querySelector("#create-dialog").close(); //Close the dialog

    function hasCompetitions() {
      if (createForm.type.value == "comp") {
        return { competition1: { location: "", meet: "", time: "" } };
      } else {
        return {};
      }
    }

    //Returns an object with the chosen disciplines checked from the checkboxes
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
              disciplines.backcrawl = { time1: { time: 0, date: "" } };
              break;
            case "butterfly":
              disciplines.butterfly = { time1: { time: 0, date: "" } };
              break;
            case "chest":
              disciplines.chest = { time1: { time: 0, date: "" } };
              break;
            case "crawl":
              disciplines.crawl = { time1: { time: 0, date: "" } };
              break;
          }
        }
      }
      return disciplines;
    }

    document.querySelector("#create-dialog").close();
    //Send the object to database by request
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

/* ------ Update member ------ */
//When edit button is clicked
function editMemberClicked(member) {
  console.log(`Editing ${member.name}`);
  document
    .querySelector(`#edit-${member.id}`)
    .removeEventListener("click", () => {
      editMemberClicked(member);
    });
  //Auto fill update form
  const updateForm = document.querySelector("#update-form");
  updateForm.activity.value = member.activity;
  updateForm.email.value = member.email;
  updateForm.name.value = member.name;
  updateForm.phone.value = member.phone;

  const dialog = document.querySelector("#update-dialog");
  dialog.showModal();

  dialog.addEventListener("cancel", event => {
    /*Prevents the dialog closing when pressing escape 
   to make sure it doesn't send multiple requests at the same time  */
    event.preventDefault();
  });

  document
    .querySelector("#update-form")
    .addEventListener("submit", updateMember);

  document.querySelector("#close-update-btn").addEventListener("click", () => {
    location.reload();
  });
  //Makes the updated object
  function updateMember(event) {
    event.preventDefault();

    console.log("Update member");
    document
      .querySelector("#update-form")
      .removeEventListener("submit", updateMember);

    const updatedMember = {
      activity: updateForm.activity.value,
      age: member.age,
      arrears: member.arrears,
      competition: member.competition,
      disciplines: member.disciplines,
      email: updateForm.email.value,
      group: member.group,
      name: updateForm.name.value,
      phone: updateForm.phone.value,
      subscription: correctSubscription(member.age, updateForm.activity.value),
      type: member.type,
    };
    sendUpdatedMember();
    dialog.close();

    //Send the updated object to database by put request
    async function sendUpdatedMember() {
      console.log("Updating member");
      console.log(member.id);
      console.log(updatedMember);

      const jsonString = JSON.stringify(updatedMember);
      console.log(jsonString);

      const response = await fetch(`${endpoint}/members/${member.id}.json`, {
        method: "PUT",
        body: jsonString,
      });

      if (response.ok) {
        console.log("Update successfull");
        location.reload();
      } else {
        console.log("Failed to update");
      }
    }
  }
}

//Makes sure the member get the correct subscription based on age or activity
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
//Makes sure the member gets in the correct group based on age and type
function correctGroup(age, type) {
  if (type == "comp") {
    if (age < 18) {
      return 1;
    } else {
      return 2;
    }
  }
  return 0;
}

//POST the new added time to the correct discipline for the correct member using member id
async function sendNewTime(memberId, newTime, discipline) {
  const jsonString = JSON.stringify(newTime);

  const response = await fetch(
    `${endpoint}/members/${memberId}/disciplines/${discipline}.json`,
    {
      method: "POST",
      body: jsonString,
    }
  );

  if (response.ok) {
    console.log("New time added");
    location.reload();
  } else {
    console.log("Error during posting");
  }
}

async function sendNewCompetition(memberId, newCompetition) {
  const jsonString = JSON.stringify(newCompetition);

  const response = await fetch(
    `${endpoint}/members/${memberId}/competition.json`,
    {
      method: "POST",
      body: jsonString,
    }
  );

  if (response.ok) {
    console.log("New competition added");
    location.reload();
  } else {
    console.log("Error during posting");
  }
}

export {
  members,
  users,
  getData,
  createClicked,
  deleteClicked,
  editMemberClicked,
  sendNewTime,
  sendNewCompetition,
};
