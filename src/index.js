import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  query,
  where,
  addDoc,
  setDoc,
  deleteDoc,
  snapshotEqual,
  onSnapshot,
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCkUUSr_KEovHJ7RLRgsgPmmv2s01dhYI",
  authDomain: "fire-giftr-932c4.firebaseapp.com",
  projectId: "fire-giftr-932c4",
  storageBucket: "fire-giftr-932c4.appspot.com",
  messagingSenderId: "391569546762",
  appId: "1:391569546762:web:1d07395685ec9c6ea609f3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// A variable that holds the id of the selected person.
let selectedPersonId = null;

// Arrays to hold data
let people = [];
let ideas = [];

document.addEventListener("DOMContentLoaded", () => {
  onSnapshot(collection(db, "people"), (snapshot) => {
    people = [];
    snapshot.docs.forEach((personData) => {
      let person = personData.data();
      const id = doc.id;
      people.push({ id, ...person });
    });
    selectedPersonId = buildPeople(people);
  });
  //set up the dom events
  /* Adding an event listener to the cancel button. */
  document
    .getElementById("btnCancelPerson")
    .addEventListener("click", hideOverlay);

  /* Adding an event listener to the cancel button. */
  document
    .getElementById("btnCancelIdea")
    .addEventListener("click", hideOverlay);

  /* Adding an event listener to the overlay. */
  document.querySelector(".overlay").addEventListener("click", hideOverlay);

  /* Adding an event listener to the person-list class. */
  document
    .querySelector(".person-list")
    .addEventListener("click", handleSelectPerson);

  /* Adding an event listener to the button with the id of btnAddPerson. */
  document
    .getElementById("btnAddPerson")
    .addEventListener("click", showOverlay);

  /* Adding an event listener to the button with the id of btnAddIdea. */
  document.getElementById("btnAddIdea").addEventListener("click", showOverlay);

  /* Adding an event listener to the save button. */
  document
    .getElementById("btnSavePerson")
    .addEventListener("click", savePerson);

  //  Adding an event listener to the button with the id of btnSaveIdea.
  document.getElementById("btnSaveIdea").addEventListener("click", saveNewGift);

  /* Calling the function getPeople() */
  getPeople();
});

//  =+++++++++++++++++++++++++++++++++++++++++++++++++++
//  =+++++++++++++++++++++++++++++++++++++++++++++++++++
//  =+++++++++++++++++++++++++++++++++++++++++++++++++++

// If the user clicks on the overlay, the overlay is hidden
// and the dialog is hidden.
function hideOverlay(ev) {
  ev.preventDefault();
  if (
    !ev.target.classList.contains("overlay") &&
    ev.target.id != "btnSavePerson" &&
    ev.target.id != "btnSaveIdea" &&
    ev.target.id != "btnCancelPerson" &&
    ev.target.id != "btnCancelIdea"
  )
    return;

  document.querySelector(".overlay").classList.remove("active");
  document
    .querySelectorAll(".overlay dialog")
    .forEach((dialog) => dialog.classList.remove("active"));
}

// When the user clicks on the Add Person or
// Add Idea button, the overlay is shown dialog
function showOverlay(ev) {
  ev.preventDefault();
  document.querySelector(".overlay").classList.add("active");
  const id = ev.target.id === "btnAddPerson" ? "dlgPerson" : "dlgIdea";
  document.getElementById(id).classList.add("active");
}

/* --------------------------------------*/
/* ==============PEOPLE/PERSON===========*/
/* --------------------------------------*/

// --------------------------------------  FETCH PEOPLE
// Fetch Function and Push to Array (people)
// async function getPeople() {
//   const querySnapshot = await getDocs(collection(db, "people"));
//   querySnapshot.forEach((doc) => {
//     const data = doc.data();
//     const id = doc.id;
//     people.push({ id, ...data });
//   });
//   selectedPersonId = buildPeople(people);

//   // Read ARRAY people
//   // console.log(people);

//   let li = document.querySelector(`[data-id="${selectedPersonId}"]`);
//   li.click();
//   //Logging the li element to the console.
//   // console.log(li);
// }

// --------------------------------------  BUILD DOM--> PEOPLE
//Build the DOM-Elements for the people
function buildPeople(people) {
  console.log("run");
  let ul = document.querySelector("ul.person-list");
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  //replaced --> DONE-OKAY.
  ul.innerHTML = people
    .map((person) => {
      const dob = `${months[person["birth-month"] - 1]} ${person["birth-day"]}`;

      return `<li data-id="${person.id}" class="person">
      <p class="name">${person.name}</p>
            <p class="dob">${dob}</p>
            <button id="editPerson" class="btnDefault btnEditPerson">Edit</button>
            <button id="deletePerson" class="btnDefault btnDeletePerson">Delete</button>
            </li>
            
            `;
    })
    .join("");
  // Returning the first person in the array.
  let selected = people[0].id;
  document
    .getElementById("deletePerson")
    .addEventListener("click", deletePerson);
  return selected;
}

// When a user clicks on a person, the function will get
// the id of the person and then get the ideas associated with that person
function handleSelectPerson(ev) {
  const li = ev.target.closest(".person");
  const id = li ? li.getAttribute("data-id") : null;

  if (id) {
    selectedPersonId = id;
    if (ev.target.classList.contains("edit")) {
    } else if (ev.target.classList.contains("delete")) {
    } else {
      document.querySelector("li.selected")?.classList.remove("selected");

      li.classList.add("selected");
      getIdeas(id);
      console.log(ideas); //-----------------------------------------
      console.log(id); // -----------------------------------------
    }
  } else {
    console.log("no id"); // --------------------------------------
  }
}

// --------------------------------------  SAVE NEW PERSON
/* Saving the person to the database. */
async function savePerson(ev) {
  let name = document.getElementById("name").value;
  let month = document.getElementById("month").value;
  let day = document.getElementById("day").value;
  // If the name, month, or day is empty, the function will return.
  if (!name || !month || !day) return;
  // Creating an object with the name, month, and day.
  const person = {
    name,
    "birth-month": month,
    "birth-day": day,
  };
  // Adding the person to the database.
  try {
    const documentReference = await addDoc(collection(db, "people"), person);
    document.getElementById("name").value = "";
    document.getElementById("month").value = "";
    document.getElementById("day").value = "";
    // Hiding the overlay.
    hideOverlay(ev);

    tellUser(`Person ${name} database Updated `);
    person.id = documentReference.id;
  } catch (err) {}
}

// ---------------------------------------  SHOWUP/UPDATE-> NEW PERSON
function showPersonList(person) {
  //add the newly created person OR update if person exists
  const ul = document.querySelector("ul.person-list");
  const dob = `${months[person["birth-month"] - 1]} ${person["birth-day"]}`;
  ul.innerHTML += `<li data-id="${person.id}" class="person">
    <p class="name">${person.name}</p>
    <p class="dob">${dob}</p>
  </li>`;
  //add to people array
  people.push(person);
}

// ---------------------------------------  SNAPSHOTS

// *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- TO DO -*-*-*-*-*-*-*-*

/* --------------------------------------*/
/* --------------------------------------*/
/* ==============IDEAS===================*/
/* --------------------------------------*/
/* --------------------------------------*/

// --------------------------------------  FETCH IDEAS
async function getIdeas(id) {
  const personRef = doc(collection(db, "people"), id);
  const ideaCollectionRef = collection(db, "gift-ideas");
  const docs = query(ideaCollectionRef, where("person-id", "==", personRef));
  const querySnapshot = await getDocs(docs);
  ideas = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const id = doc.id;
    console.log(data.idea);
    ideas.push({
      id,
      title: data.idea,
      location: data.location,
      bought: data.bought,
      person_id: data["person-id"].id,
      person_ref: data["person-id"],
    });
  });

  buildIdeas(ideas);
}

// --------------------------------------  BUILD DOM --> IDEAS
// Building the DOM-Elements for the ideas.
function buildIdeas(ideas) {
  const ul = document.querySelector(".idea-list");
  if (ideas.length) {
    ul.innerHTML = ideas

      // Creating a list of ideas.
      .map((idea) => {
        return `<li class="idea" data-id="${idea.id}">
                <label for="chk-${idea.id}"
                  ><input type="checkbox" id="chk-${idea.id}" /> Bought</label
                >
                <p class="title">${idea.title}</p>
                <p class="location">${idea.location}</p>
                <button id="editGift" class=" btnGift">Edit</button>
            <button id="deleteGift" class=" btnGift">Delete</button>
              </li>`;
      })
      .join("");
    document.getElementById("deleteGift").addEventListener("click", deleteGift);
  } else {
    // If there are no ideas, Keep Clean.
    ul.innerHTML = '<li class="idea"><p></p><p> ^ Cart are Empty ^ </p></li>';
  }
}

// ++++++++++++++++++++++++++++++++++++++  SAVE NEW IDEA

/* The above code is getting the value of the title and location from the form. */
async function saveNewGift(ev) {
  let title = document.getElementById("title").value;
  let location = document.getElementById("location").value;

  /* Checking to see if the title and location are empty. If they are, it will return. */
  if (!title || !location) return;

  const idea = {
    idea: title,
    location: location,
    bought: false,
    // Creating a reference to the person-id.
    "person-id": doc(db, "people", selectedPersonId),
  };

  try {
    const documentReference = await addDoc(collection(db, "gift-ideas"), idea);
    document.getElementById("title").value = "";
    document.getElementById("location").value = "";
    hideOverlay(ev);
    tellUser(`Idea ${title} database Updated `);
    idea.id = documentReference.id;
  } catch (err) {
    console.log("Error adding document:", err);
  }
}

// ++++++++++++++++++++++++++++++++++++++  DELETE PERSON
function deletePerson(ev) {
  const li = ev.target.closest(".person");
  const id = li ? li.getAttribute("data-id") : null;
  if (id) {
    deleteDoc(doc(db, "people", id));
    alert(`Person ${li.querySelector(".name").textContent} deleted`);
    li.remove();
    console.log("Clicked GOOOOODDD");
  }
}

// *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- TO DO -*-*-*-*-*-*-*-*

// ++++++++++++++++++++++++++++++++++++++  DELETE IDEA
function deleteGift(ev) {
  const li = ev.target.closest(".idea");
  const id = li ? li.getAttribute("data-id") : null;
  if (id) deleteDoc(doc(db, "gift-ideas", id));
  alert(`Gift ${li.querySelector(".title").textContent} deleted`);
  li.remove();
  // console.log("Clicked GOOOOODDD");
}

// ++++++++++++++++++++++++++++++++++++++  SHOW UP/UPDATE-> NEW IDEA

// ++++++++++++++++++++++++++++++++++++++  EDIT IDEA

// ++++++++++++++++++++++++++++++++++++++  TOGGLE IDEA

// ++++++++++++++++++++++++++++++++++++++  SAVE EDITED IDEA

// ++++++++++++++++++++++++++++++++++++++  DELETE PERSON

// ++++++++++++++++++++++++++++++++++++++  EDIT PERSON

/* ----------------------------------------------------------*/
/* ----------------------------------------------------------*/
/* ----------------------------------------------------------*/
/* ----------------------------------------------------------*/
/* ----------------------------------------------------------*/
/* ----------------------------------------------------------*/
/* ----------------------------------------------------------*/
/* ----------------------------------------------------------*/
