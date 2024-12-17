// Your web app's Firebase configuration
import {initializeApp} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js"
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

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
const auth = getAuth(app);


async function loadCollection(user) {
    const container = document.getElementById('collectionContainer');
    container.innerHTML = ''; // Clear any existing content

    try {
        const idToken = await user.getIdToken();
        console.log('Firebase ID Token:', idToken); // Debug log

        // Fetch images from the backend
        const response = await fetch('/api/user-images', {
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        });

        const data = await response.json();

        if (!data.images || data.images.length === 0) {
            container.innerHTML = "<p>No characters in your collection yet!</p>";
            return;
        }

        // Render each image
        data.images.forEach((imageUrl) => {
            const card = document.createElement('div');
            card.classList.add('card');

            const img = document.createElement('img');
            img.src = imageUrl;
            img.style.width = '100px';
            img.style.height = '150px';
            img.style.objectFit = 'contain';

            card.appendChild(img);
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading collection:', error);
        container.innerHTML = "<p>Failed to load your collection. Please try again later.</p>";
    }
}

// Wait for Firebase Auth to detect login state
onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      await loadCollection(user);
    } catch (error) {
      console.error("Error while loading collection:", error);
    }
  } else {
    const container = document.getElementById('collectionContainer');
    container.innerHTML = "<p>Please log in to view your collection.</p>";
  }
});
