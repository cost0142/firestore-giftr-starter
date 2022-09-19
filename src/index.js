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
const people = [];
const ideas = [];

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("btnCancelPerson")
    .addEventListener("click", hideOverlay);

  document
    .getElementById("btnCancelIdea")
    .addEventListener("click", hideOverlay);

  document
    .getElementById("btnAddPerson")
    .addEventListener("click", showOverlay);
  document.getElementById("btnAddIdea").addEventListener("click", showOverlay);

  document
    .getElementById("btnSavePerson")
    .addEventListener("click", savePerson);
  document.getElementById("btnSaveIdea").addEventListener("click", saveIdea);

  //  ----------------------
  document
    .querySelector(".person-list")
    .addEventListener("click", handleSelectPerson);

  document.querySelector(".overlay").addEventListener("click", hideOverlay);

  getPeople();
});

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
  let selectedPerson = people[0].id;
  return selectedPerson;
}

/* --------------------------------------*/
/* --------------------------------------*/
/* ==============IDEAS===================*/
/* --------------------------------------*/
/* --------------------------------------*/

async function getIdeas(id) {
  const personRef = doc(collection(db, "people"), id);
  const ideaCollectionRef = collection(db, "gift-ideas");
  const querySnapshot = await getDocs(docs);

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const id = doc.id;

    ideas.push({ id, ...data });
  });

  console.log("teste123");
}
