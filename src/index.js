import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

import {
  getAuth,
  GithubAuthProvider,
  signInWithPopup,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";

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
const auth = getAuth(app);

// ppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp

setPersistence(auth, browserSessionPersistence).catch((error) => {
  console.log(error);
});
const provider = new GithubAuthProvider();

function attemptLogin() {
  //try to login with the global auth and provider objects
  signInWithPopup(auth, provider)
    .then((result) => {
      //IF YOU USED GITHUB PROVIDER
      const credential = GithubAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      // The signed-in user info.
      const user = result.user;
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;

      const credential = GithubAuthProvider.credentialFromError(error);
    });
}
function attemptLogout() {
  try {
    auth.signOut();
  } catch (error) {
    console.log(error);
  }
}
auth.onAuthStateChanged(function (user) {
  let authButton = document.getElementById("sign-in");
  if (user) {
    // User is signed in.
    onPeopleSnapshot();
    document.getElementById("btnAddPerson").style.visibility = "visible";
    document.getElementById("btnAddIdea").style.visibility = "visible";
    authButton.innerHTML = "Sign Out";
    console.log("user is signed in");
  } else {
    document.getElementById("btnAddPerson").style.visibility = "hidden";
    document.getElementById("btnAddIdea").style.visibility = "hidden";
    authButton.innerHTML = "Sign In";
    console.log("not logged in");
  }
});

// A variable that holds the id of the selected person.
let selectedPersonId = null;
let selectedGiftId = null;
// ppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp

// Arrays to hold data
let people = [];
let ideas = [];
let firstFetch = true;
document.addEventListener("DOMContentLoaded", () => {
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
  document.getElementById("btnAddIdea").addEventListener("click", (ev) => {
    document.querySelector(".giftIdeaOverlay").textContent = "Add Gift Idea";
    showOverlay(ev);
  });

  /* Adding an event listener to the save button. */
  document
    .getElementById("btnSavePerson")
    .addEventListener("click", savePerson);

  //  Adding an event listener to the button with the id of btnSaveIdea.
  document.getElementById("btnSaveIdea").addEventListener("click", saveNewGift);
  document.getElementById("sign-in").addEventListener("click", (ev) => {
    ev.target.textContent === "Sign In" ? attemptLogin(ev) : attemptLogout(ev);

    if (ev.target.textContent === "Sign Out") {
      people = [];
      ideas = [];

      buildPeople(people);
      buildIdeas(ideas);
    }
  });
  /* Calling the function getPeople() */
});

//  =+++++++++++++++++++++++++++++++++++++++++++++++++++
//  =+++++++++++++++++++++++++++++++++++++++++++++++++++
//  =+++++++++++++++++++++++++++++++++++++++++++++++++++

function onPeopleSnapshot() {
  onSnapshot(collection(db, "people"), (snapshot) => {
    people = [];
    snapshot.docs.forEach((personData) => {
      let person = personData.data();
      const id = personData.id;
      people.push({ id, ...person });
    });
    buildPeople(people);
  });
}
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
  // set title to Add Person
  // check if ev.target.classList has btnEditPerson, if yes set title
  document.querySelector(".addPersonOverlay").innerHTML = "Add Person";

  if (ev.target.classList.contains("btnEditPerson")) {
    document.querySelector(".addPersonOverlay").innerHTML = "Edit Person";
  }
}

/* --------------------------------------*/
/* ==============PEOPLE/PERSON===========*/
/* --------------------------------------*/

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
      console.log(person);
      return `<li data-id="${person.id}" class="person">
      <p class="name">${person.name}</p>
            <p class="dob">${dob}</p>
            <button id="btnAddPerson" class="btnDefault btnEditPerson">Edit</button>
            <button id="deletePerson" class="btnDefault btnDeletePerson">Delete</button>
            </li>
            
            `;
    })
    .join("");
  document.querySelectorAll(".btnEditPerson").forEach((btn) => {
    btn.addEventListener("click", editPerson);
  });
  document.querySelectorAll("#deletePerson").forEach((btn) => {
    btn.addEventListener("click", deletePerson);
  });
  // select the first person in the list if the page is building for the first time
  if (firstFetch == true && people) {
    defaultPerson();
    firstFetch = false;
  }

  // Returning the first person in the array.
  // document
  //   .getElementById("deletePerson")
  //   .addEventListener("click", deletePerson);
}

// When a user clicks on a person, the function will get
// the id of the person and then get the ideas associated with that person
function handleSelectPerson(ev) {
  const li = ev.target.closest(".person");
  const id = li ? li.getAttribute("data-id") : null;

  document.querySelector("li.selected")?.classList.remove("selected");
  getIdeas(id);
  li.classList.add("selected");
  selectedPersonId = id;
}

function defaultPerson() {
  if (people) {
    selectedPersonId = people[0].id;
  } else return;

  // Select the first person in the list.
  document.querySelectorAll(".person").forEach((element) => {
    if (element.getAttribute("data-id") == selectedPersonId) {
      element.className = "person selected";
    }
  });
  getIdeas(selectedPersonId);
}

// --------------------------------------  SAVE NEW PERSON
/* Saving the person to the database. */
async function savePerson(ev) {
  let overlayTitle = document.querySelector(".addPersonOverlay").textContent;

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
    // const documentReference = await addDoc(collection(db, "people"), person);

    if (overlayTitle == "Update Person") {
      //update person

      await updateDoc(doc(db, "people", selectedPersonId), person);
      hideOverlay(ev);
    } else {
      //add person
      await addDoc(collection(db, "people"), person);
      hideOverlay(ev);
    }

    document.getElementById("name").value = "";
    document.getElementById("month").value = "";
    document.getElementById("day").value = "";
    // Hiding the overlay.
    hideOverlay(ev);
    person.id = documentReference.id;
  } catch (err) {}
}

// ---------------------------------------  SNAPSHOTS

/* --------------------------------------*/
/* --------------------------------------*/
/* ==============IDEAS===================*/
/* --------------------------------------*/
/* --------------------------------------*/

// --------------------------------------  FETCH IDEAS
async function getIdeas(id) {
  console.log(id);
  const personRef = doc(collection(db, "people"), id);
  const ideaCollectionRef = collection(db, "gift-ideas");
  const docs = query(ideaCollectionRef, where("person-id", "==", personRef));
  const querySnapshot = await getDocs(docs);
  ideas = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const id = doc.id;
    console.log(data);
    ideas.push({ ...data, id });
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
        console.log(idea);
        return `<li class="idea" data-id="${idea.id}">
                <label for="chk-${idea.id}"
                  ><input type="checkbox" id="chk-${idea.id}" ${
          idea.bought === true ? `checked` : ""
        } class="bought" /> Bought</label
                >
                <p class="title">${idea.idea}</p>
                <p class="location">${idea.location}</p>
                <button id="editGift" class=" btnGift">Edit</button>
            <button id="deleteGift" class=" btnGift">Delete</button>
              </li>`;
      })
      .join("");

    document.querySelectorAll("#deleteGift").forEach((btn) => {
      btn.addEventListener("click", deleteGift);
    });

    document.querySelectorAll("#editGift").forEach((btn) => {
      btn.addEventListener("click", editGift);
    });

    document.querySelectorAll(".bought").forEach((btn) => {
      btn.addEventListener("click", (ev) => {
        boughtGift(ev);
      });
    });
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
  let overlayTitle = document.querySelector(".giftIdeaOverlay").textContent;

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
    if (overlayTitle == "Add Gift Idea") {
      console.log("Hello");
      document.getElementById("title").value = "";
      document.getElementById("location").value = "";
      await addDoc(collection(db, "gift-ideas"), idea);
      hideOverlay(ev);
      getIdeas(selectedPersonId);
    } else {
      //update gift
      console.log("EDIT");
      await updateDoc(doc(db, "gift-ideas", selectedGiftId), idea);
      hideOverlay(ev);
      getIdeas(selectedPersonId);
    }
  } catch (err) {
    console.log("Error adding document:", err);
  }
}

// ++++++++++++++++++++++++++++++++++++++  DELETE PERSON
function deletePerson(ev) {
  const li = ev.target.closest(".person");
  const id = li ? li.getAttribute("data-id") : null;
  if (confirm("Are you sure you want to delete this person?")) {
    if (id) deleteDoc(doc(db, "people", id));
    alert(`Person ${li.querySelector(".name").textContent} deleted`);
    li.remove();
  }
}

// *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- TO DO -*-*-*-*-*-*-*-*

// ++++++++++++++++++++++++++++++++++++++  DELETE IDEA
function deleteGift(ev) {
  const li = ev.target.closest(".idea");
  const id = li ? li.getAttribute("data-id") : null;
  if (confirm("Are you sure you want to delete this gift?")) {
    if (id) deleteDoc(doc(db, "gift-ideas", id));
    alert(`Gift ${li.querySelector(".title").textContent} deleted`);
    li.remove();
  }
}

// ++++++++++++++++++++++++++++++++++++++  BOUGHT IDEA
function boughtGift(ev) {
  const li = ev.target.closest(".idea");

  const id = li ? li.getAttribute("data-id") : null;
  if (id) {
    console.log(id);
    const bought = li.querySelector(".bought").checked;

    updateDoc(doc(db, "gift-ideas", id), { bought: bought });
  }
}

// ++++++++++++++++++++++++++++++++++++++  EDIT IDEA
function editGift(ev) {
  const li = ev.target.closest(".idea");
  const id = li ? li.getAttribute("data-id") : null;
  document.querySelector(".giftIdeaOverlay").textContent = "Update Gift Idea";
  if (id) {
    const idea = ideas.find((idea) => idea.id === id);
    document.getElementById("title").value = idea.idea;
    document.getElementById("location").value = idea.location;
    selectedGiftId = id;
    showOverlay(ev);
  }
}

// ++++++++++++++++++++++++++++++++++++++  EDIT PERSON
function editPerson(ev) {
  const li = ev.target.closest(".person");
  const id = li ? li.getAttribute("data-id") : null;
  if (id) {
    const person = people.find((person) => person.id === id);

    document.getElementById("name").value = person.name;
    document.getElementById("month").value = person["birth-month"];
    document.getElementById("day").value = person["birth-day"];

    // document.getElementById("savePerson").dataset.id = id;
    showOverlay(ev);
  }
}

/* ----------------------------------------------------------*/
/* ----------------------------------------------------------*/
/* ----------------------------------------------------------*/
/* ----------------------------------------------------------*/
/* ----------------------------------------------------------*/
/* ----------------------------------------------------------*/
/* ----------------------------------------------------------*/
/* ----------------------------------------------------------*/
