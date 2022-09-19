import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  query,
  where,
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
  //set up the dom events
  document
    .getElementById("btnCancelPerson")
    .addEventListener("click", hideOverlay);
  document
    .getElementById("btnCancelIdea")
    .addEventListener("click", hideOverlay);
  document.querySelector(".overlay").addEventListener("click", hideOverlay);

  document
    .getElementById("btnAddPerson")
    .addEventListener("click", showOverlay);
  document.getElementById("btnAddIdea").addEventListener("click", showOverlay);

  document
    .querySelector(".person-list")
    .addEventListener("click", handleSelectPerson);

  getPeople();
});

//  =+++++++++++++++++++++++++++++++++++++++++++++++++++
//  =+++++++++++++++++++++++++++++++++++++++++++++++++++
//  =+++++++++++++++++++++++++++++++++++++++++++++++++++

// function hideOverlay(ev) {
//   ev.preventDefault();

//   document.querySelector(".overlay").classList.remove("active");
//   document
//     .querySelectorAll(".overlay dialog")
//     .forEach((dialog) => dialog.classList.remove("active"));
// }

// If the user clicks on the overlay(Cancel or Save), the overlay is hidden
function hideOverlay(ev) {
  ev.preventDefault();
  if (
    !ev.target.classList.contains("overlay") &&
    ev.target.id != "btnSavePerson" &&
    ev.target.id != "btnCancelPerson" &&
    ev.target.id != "btnSaveIdea" &&
    ev.target.id != "btnCancelIdea"
  )
    return;

  document.querySelector(".overlay").classList.remove("active");
  document
    .querySelectorAll(".overlay dialog")
    .forEach((dialog) => dialog.classList.remove("active"));
}

// ---------------STEVE CODE----------------
function showOverlay(ev) {
  ev.preventDefault();
  document.querySelector(".overlay").classList.add("active");
  const id = ev.target.id === "btnAddPerson" ? "dlgPerson" : "dlgIdea";
  document.getElementById(id).classList.add("active");
}

//  =+++++++++++++++++++++++++++++++++++++++++++++++++++
//  =+++++++++++++++++++++++++++++++++++++++++++++++++++
//  =+++++++++++++++++++++++++++++++++++++++++++++++++++

/* --------------------------------------*/
/* --------------------------------------*/
/* ==============PEOPLE/PERSON===========*/
/* --------------------------------------*/

// Fetch Function and Push to Array (people)
async function getPeople() {
  const querySnapshot = await getDocs(collection(db, "people"));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const id = doc.id;
    people.push({ id, ...data });
  });
  selectedPersonId = buildPeople(people);

  // Read ARRAY people
  // console.log(people);

  let li = document.querySelector(`[data-id="${selectedPersonId}"]`);
  li.click();
  //Logging the li element to the console.
  // console.log(li);
}

//Build the DOM-Elements for the people
function buildPeople(people) {
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
  //replaced --> OKAY
  ul.innerHTML = people
    .map((person) => {
      const dob = `${months[person["birth-month"] - 1]} ${person["birth-day"]}`;

      return `<li data-id="${person.id}" class="person">
            <p class="name">${person.name}</p>
            <p class="dob">${dob}</p>
          </li>`;
    })
    .join("");

  // Returning the first person in the array.
  let selected = people[0].id;
  return selected;
}

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

/* --------------  TO DO ---------------- */
// ++++++++++++++++++++++++++++++++++++++  SAVE NEW PERSON

// ++++++++++++++++++++++++++++++++++++++  SHOWUP/UPDATE-> NEW PERSON

/* --------------------------------------*/
/* --------------------------------------*/
/* ==============IDEAS===================*/
/* --------------------------------------*/
/* --------------------------------------*/

async function getIdeas(id) {
  const personRef = doc(collection(db, "people"), id);
  const ideaCollectionRef = collection(db, "gift-ideas");
  const docs = query(ideaCollectionRef, where("person-id", "==", personRef));
  const querySnapshot = await getDocs(docs);
  ideas = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const id = doc.id;
    ideas = [];
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

function buildIdeas(ideas) {
  const ul = document.querySelector(".idea-list");
  if (ideas.length) {
    ul.innerHTML = ideas
      .map((idea) => {
        return `<li class="idea" data-id="${idea.id}">
                <label for="chk-${idea.id}"
                  ><input type="checkbox" id="chk-${idea.id}" /> Bought</label
                >
                <p class="title">${idea.title}</p>
                <p class="location">${idea.location}</p>
              </li>`;
      })
      .join("");
  } else {
    // If there are no ideas, Keep Clean.
    ul.innerHTML =
      '<li class="idea"><p></p><p>Cart are Empty --> No GIFT </p></li>';
  }
}

/* --------------  TO DO ---------------- */
// ++++++++++++++++++++++++++++++++++++++  SAVE NEW IDEA

// ++++++++++++++++++++++++++++++++++++++  SHOWUP/UPDATE-> NEW IDEA

/* ----------------------------------------------------------*/
/* ----------------------------------------------------------*/
/* ----------------------------------------------------------*/
/* ----------------------------------------------------------*/
/* ----------------------------------------------------------*/
/* ----------------------------------------------------------*/
/* ----------------------------------------------------------*/
/* ----------------------------------------------------------*/
