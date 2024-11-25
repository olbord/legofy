document.getElementById("signin").addEventListener("click", () => {
    try {
                // Simulate a token
                const token = "generated_token_" + Math.random().toString(36).substr(2);

                // Store the token in localStorage (or sessionStorage)
                localStorage.setItem("authToken", token);

                // Notify the user
                alert("You have received a token!");

                // Redirect to index.html
                window.location.href = "../pages/index.html";
            } catch (error) {
                alert("An error occurred while generating the token.");
                console.error(error);
            }
        });