import { pages, getPageOptions, selectOption, navigatePage, getSelectedOptions, isCharacterComplete } from './characterBuilderCore.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js';

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

// Function to save the character (exported for use elsewhere)
export async function saveCharacter() {
  // Check if the character is complete before saving
  if (!isCharacterComplete()) {
    alert("Please complete all selections before saving.");
    return;
  }

  // Get the final character options (you need to implement `getSelectedOptions()`)
  const character = getSelectedOptions();

  try {
    // Get current user from Firebase
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No user signed in.");
    }

    // Get Firebase ID token
    const idToken = await user.getIdToken();

    // Send character data and ID token to your backend
    const response = await fetch('/stack-and-upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ character, idToken })
    });

    const data = await response.json();
    if (response.ok) {
      alert('Character saved successfully!');
      window.location.href = '../pages/my_collection.html';  // Redirect to another page
    } else {
      alert(`Error: ${data.error || 'Something went wrong.'}`);
    }
  } catch (error) {
    console.error('Error uploading character:', error);
    alert('There was an error uploading your character.');
  }
}

document.addEventListener("DOMContentLoaded", () => {
    function loadPage() {
        const { index, page } = getPageOptions(); // Destructure to get current index and page data
        if (!page) {
            console.error("Page options are undefined. Check the implementation in characterBuilderCore.js.");
            return;
        }

        const gallery = document.getElementById("gallery");
        if (!gallery) {
            console.error("Gallery element not found in the DOM.");
            return;
        }

        gallery.innerHTML = "";

        page.options.forEach(option => {
            const img = document.createElement("img");
            img.src = option.gallerySrc;
            img.alt = option.value;
            img.onclick = () => {
                selectOption(page.type, option.value, option.previewSrc);
                document.getElementById(`${page.type}Image`).src = option.previewSrc;
                updateButtons();
            };
            gallery.appendChild(img);
        });

        updateButtons(); // Update button visibility based on the current index
    }

    function updateButtons() {
        const { index, page } = getPageOptions(); // Get current index and page
        const selectedOptions = getSelectedOptions();
        const pageType = page.type;

        // Disable/Enable buttons based on the current index
        document.getElementById("prevBtn").disabled = index === 0;
        document.getElementById("nextBtn").disabled = !selectedOptions[pageType];
        document.getElementById("nextBtn").style.display = index === pages.length - 1 ? "none" : "inline";
        document.getElementById("saveBtn").style.display = index === pages.length - 1 ? "inline" : "none";
    }

    function navigate(direction) {
        try {
            navigatePage(direction); // Updates the current page index internally
            loadPage(); // Refreshes the UI with the updated page
        } catch (error) {
            alert(error.message); // Gracefully handle errors like invalid navigation
        }
    }

    // Attach navigation and save functions to buttons
    document.getElementById("prevBtn").onclick = () => navigate(-1);
    document.getElementById("nextBtn").onclick = () => navigate(1);
    document.getElementById("saveBtn").onclick = saveCharacter;

    // Initialize the first page
    loadPage();
});
