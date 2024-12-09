import { pages, getPageOptions, selectOption, navigatePage, getSelectedOptions, isCharacterComplete } from './characterBuilderCore.js';

// Define saveCharacter function before the event listener so it can be exported
function saveCharacter() {
    if (!isCharacterComplete()) {
        alert("Please complete all selections before saving.");
        return;
    }

    const character = getSelectedOptions(); // Retrieve the final character data
    localStorage.setItem("character", JSON.stringify(character)); // Save to localStorage
    alert("Character saved!");
    window.location.href = "myCollection.html"; // Navigate to the next page
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

// Export saveCharacter function
export { saveCharacter };
