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
// get a reference to the database
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  //set up the dom events
  document.querySelector(".person-list").addEventListener("click", (ev) => {
    handleSelectors(ev);
  });

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
  getPeople();
  getIdeas();
});

function hideOverlay(ev) {
  ev.preventDefault();
  document.querySelector(".overlay").classList.remove("active");
  document
    .querySelectorAll(".overlay dialog")
    .forEach((dialog) => dialog.classList.remove("active"));
}
function showOverlay(ev) {
  ev.preventDefault();
  document.querySelector(".overlay").classList.add("active");
  const id = ev.target.id === "btnAddPerson" ? "dlgPerson" : "dlgIdea";
  //TODO: check that person is selected before adding an idea
  document.getElementById(id).classList.add("active");
}

//  ------------------  Person ------------------

const peopleList = [];

// Fetch Function Get People
async function getPeople() {
  const people = await getDocs(collection(db, "people"));
  people.forEach((doc) => {
    const data = doc.data();
    const id = doc.id;
    // console.log(data);
    peopleList.push({ id, ...data });

    return data;
  });

  buildPerson();
}

// Building People Function --> DOM
function buildPerson() {
  PageTransitionEvent;
  let ul = document.querySelector(".person-list");

  ul.innerHTML = "";

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

  peopleList.forEach((person) => {
    const dob = `${months[person["birth-month"] - 1]} ${person["birth-day"]}`;

    let li = document.createElement("li");
    li.setAttribute("id", `${person.id}`);
    li.className = "person";

    li.addEventListener("click", (e) => {
      console.log(e.currentTarget);
    });

    let personName = document.createElement("p");
    personName.className = "person-name";
    personName.innerHTML = `${person.name}`;

    let personDob = document.createElement("p");
    personDob.className = "person-dob";
    personDob.innerHTML = `${dob}`;

    li.append(personName, personDob);
    ul.append(li);
  });
}

function handleSelectors(e) {
  let person = document.querySelector(".person");
  person.addEventListener("click", (e) => {
    console.log(e.target);
  });
}

const giftList = [];

// Fetch Function Gift-ideas
async function getIdeas() {
  const ideas = await getDocs(collection(db, "gift-ideas"));
  ideas.forEach((doc) => {
    const data = doc.data();
    const giftId = doc.id;
    console.log(data);

    giftList.push({ giftId, ...data });

    return data;
  });
  buildingIdeas();

  console.log(giftList);
}

// Building Ideas Function --> DOM
function buildingIdeas() {
  let ul = document.querySelector(".idea-list");

  ul.innerHTML = "";

  giftList.forEach((gift) => {
    let li = document.createElement("li");
    li.setAttribute("id", `${gift.id}`);
    li.className = "gift";

    let giftName = document.createElement("p");
    giftName.className = "gift-idea";
    giftName.innerHTML = `${gift.idea}`;

    let giftLocation = document.createElement("p");
    giftLocation.className = "gift-location";
    giftLocation.innerHTML = `${gift.location}`;

    // EDIT
    let editBtn = document.createElement("button");
    editBtn.setAttribute("id", "edit-btn");
    editBtn.innerHTML = "Edit";

    // DELETE
    let deleteBtn = document.createElement("button");
    deleteBtn.setAttribute("id", "delete-btn");
    deleteBtn.innerHTML = "Delete";

    // ADD label for
    // ADD giftEdit for
    // ADD giftDelete for

    li.append(giftName, giftLocation, deleteBtn, editBtn);

    ul.append(li);

    console.log(gift);
  });
}

//  ------------------  ADD Person ------------------

// const form = document.querySelector("form");

// form.addEventListener("submit", (e) => {
//   e.preventDefault();
//   alert("Person Added");
// });

// form.addEventListener("save", (e) => {
//   e.preventDefault();
//   let name = document.getElementById("name").value;
//   db.collection("people").add({
//     task: task,
//   });
//   alert("Task Added");
// });
