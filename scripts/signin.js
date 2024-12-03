// Your web app's Firebase configuration
import {initializeApp} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js"
import {getAuth, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// Your web app's Firebase configuration
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


document.getElementById("signin").addEventListener("click", handleLogIn);

function handleLogIn() {

    const email = document.getElementById("username_textarea").value;
    const password = document.getElementById("password_textarea").value;

    const feedback = document.getElementById("feedback");

    // Ühendame Firebase'i auth keskkonnaga
    const auth = getAuth();

    // Logime sisse emaili ja parooliga
    signInWithEmailAndPassword(auth, email, password)
        // Kasutaja on sisse logitud
        .then(() => {
            // Navigeerime indexile
            window.location.href = "index.html";
        })
        // Kui kasutaja sisse logimisel tekib viga
        .catch((error) => {
            feedback.style.display = "block";
            feedback.innerHTML = error.message
        });

}
