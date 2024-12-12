import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut as firebaseSignOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCYZwns_C8u7AOOH5N5QUcC0nw2tp_mhLY",
  authDomain: "legofy-df62a.firebaseapp.com",
  projectId: "legofy-df62a",
  storageBucket: "legofy-df62a.firebasestorage.app",
  messagingSenderId: "293425962403",
  appId: "1:293425962403:web:c393ed6edb34d601280e16"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function toBuilder() {
    const user = auth.currentUser;
    if (user) {
        window.location.href = 'interactive_character_builder.html';
    } else {
        alert("You must be logged in to create a character. Please log in first.");
        window.location.href = 'Log%20in.html';
    }
}

document.getElementById('create-button').addEventListener('click', toBuilder);
