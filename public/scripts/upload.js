// Fetch idToken from localStorage
const idToken = localStorage.getItem('idToken');

// Function to upload the file
function uploadFile(event) {
    event.preventDefault(); // Prevent the form from submitting and refreshing the page

    const file = document.getElementById('file-input').files[0]; // Get the file input

    if (!file) {
        console.error("No file selected.");
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    fetch('http://localhost:3000/upload', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${idToken}`, // Add the token in the Authorization header
        },
        body: formData,
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return response.json().then(err => Promise.reject(err));
        }
    })
    .then(result => {
        console.log("File uploaded successfully:", result);
    })
    .catch(error => {
        console.error("Error uploading file:", error);
    });
}

// Add event listener for form submission
document.getElementById('file-upload-form').addEventListener('submit', uploadFile);
