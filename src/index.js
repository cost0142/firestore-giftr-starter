import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  query,
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

// Fetch Function "People"
async function getPeople() {
  const people = await getDocs(collection(db, "people"));
  people.forEach((doc) => {
    const data = doc.data();
    console.log(data);
  });

  return people;
}

// function addPerson(){}
// function addIdea() { }
// function addPerson(){}
// async function getGifts(){}

// import { collectionGroup, query, where, getDocs } from "firebase/firestore";

// const museums = query(collectionGroup(db, 'landmarks'), where('type', '==', 'museum'));
// const querySnapshot = await getDocs(museums);
// querySnapshot.forEach((doc) => {
//     console.log(doc.id, ' => ', doc.data());
