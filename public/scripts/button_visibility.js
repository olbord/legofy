import {initializeApp} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js"
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCYZwns_C8u7AOOH5N5QUcC0nw2tp_mhLY",
  authDomain: "legofy-df62a.firebaseapp.com",
  projectId: "legofy-df62a",
  storageBucket: "legofy-df62a.firebasestorage.app",
  messagingSenderId: "293425962403",
  appId: "1:293425962403:web:c393ed6edb34d601280e16"
};

// Loome ühenduse Firebase'iga
const app = initializeApp(firebaseConfig)

const auth = getAuth();
const signinLink = document.getElementById("signin_link");
const my_collection_link = document.getElementById("my_collection_link");


// Monitor authentication state
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('logged in')
    // User is signed in, show 'Log Out' button
    signinLink.innerHTML = `<a class="nav-bar" id="logout">Log Out</a>`;
    document.getElementById("logout").addEventListener("click", () => {
      signOut(auth)
        .then(() => {
          // Check if the current page is my_collection.html
        if (window.location.pathname.endsWith("/pages/my_collection.html")) {
          // Navigate to index.html
          window.location.href = "index.html";
        }
        else {
          // Reload the page
          location.reload();
        }

          console.log("User signed out.");
        })
        .catch((error) => {
          console.error("Error signing out:", error);
        });
    });
    my_collection_link.innerHTML = `<a class="nav-bar" id="my_collection_link">My Collection</a>`;
    document.getElementById("my_collection_link").addEventListener("click", () => {
      window.location.href = "my_collection.html";
    });
  } else {
    console.log('not logged in')
    // No user is signed in, show 'Log In'
    signinLink.innerHTML = `<a href="/pages/Log%20in.html">Log In</a>`;
  }
});