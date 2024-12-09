// Your web app's Firebase configuration
import {initializeApp} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js"
import {getAuth, signOut} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

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


// Add an event listener for the logout button
document.getElementById("signout_button").addEventListener("click", handleLogOut);

function handleLogOut() {
    const auth = getAuth();

    signOut(auth)
        .then(() => {
            // User logged out successfully
            // Hide 'Log out'
            document.getElementById("signout_button").style.display = "none";
            // Clear feedback and welcome message
            document.getElementById("feedback").innerHTML = "";
            document.getElementById("welcome_message").innerHTML = "";

            // Remove idToken from localStorage
            localStorage.removeItem('idToken'); // This will delete the token from localStorage
        })
        .catch((error) => {
            // Handle any errors during logout
            const feedback = document.getElementById("feedback");
            feedback.style.display = "block";
            feedback.innerHTML = error.message;
        });
}
