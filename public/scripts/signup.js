// Your web app's Firebase configuration
import {initializeApp} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js"
import {getAuth, createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

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


document.getElementById("signup").addEventListener("click", handleSignUp);

function handleSignUp() {
    const feedback = document.getElementById("feedback");
    feedback.style.display = "block";

    const email = document.getElementById("username_textarea").value;
    const password = document.getElementById("password_textarea").value;
    const passwordRepeat = document.getElementById("password_repeat").value;

    // Check if the passwords match
    if (password === passwordRepeat) {
        // Connect to Firebase auth environment
        const auth = getAuth();

        // Create user using email and password
        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                // Notify the user that the account was created
                feedback.innerHTML = "Account was made!";
            })
            .catch((error) => {
                // Display error message to the user
                feedback.innerHTML = error.message;
            });
    } else {
        // Display error if passwords do not match
        feedback.innerHTML = "The entered passwords must be identical!";
    }
}

