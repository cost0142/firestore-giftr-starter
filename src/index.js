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
});

// Fetch Function and Push to Array (people)
async function getPeople() {
  //call this from DOMContentLoaded init function
  //the db variable is the one created by the getFirestore(app) call.
  const querySnapshot = await getDocs(collection(db, "people"));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const id = doc.id;
    people.push({ id, ...data });
  });
  selectedPersonId = buildPeople(people);

  // Read ARRAY people
  // console.log(people); ------------------------------------------

  let li = document.querySelector(`[data-id="${selectedPersonId}"]`);
  li.click();
  //Logging the li element to the console --------------------------
  // console.log(li);
}
