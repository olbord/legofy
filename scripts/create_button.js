// Check if the user is logged in
function isLoggedIn() {
    const authToken = localStorage.getItem("authToken"); // Example: Check localStorage for a token
    return !!authToken; // True if logged in, false otherwise
}

// Event listener for the CREATE NOW button
document.getElementById("create-button").addEventListener("click", () => {
    if (isLoggedIn()) {
        window.location.href = "../pages/create_page.html"; // Redirect if logged in
    } else {
        alert("Please log in first ;)"); // Notify user
        window.location.href = "../pages/create_page.html"; // Redirect to login page
    }
});