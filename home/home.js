document.addEventListener("DOMContentLoaded", () => {
    console.log("Password validated:", localStorage.getItem("passwordValidated")); // Debugging line

    // Check if the password has been validated
    if (localStorage.getItem("passwordValidated") === "true") {
        console.log("Displaying home content");
        displayHomeContent(); // Skip password page and show home content
    } else {
        console.log("Password page shown");
        setupPasswordPage();
    }
});

// Function to setup the password page
function setupPasswordPage() {
    const passwordInput = document.getElementById("password-input");
    const enterButton = document.getElementById("enter-button");
    const errorMessage = document.getElementById("error-message");
    const loadingIcon = document.getElementById("loading-icon");

    // Validate Password Function
    const validatePassword = () => {
        const password = passwordInput.value.trim();
        if (password === "baubau") {
            loadingIcon.classList.remove("hidden"); // Show loading icon

            setTimeout(() => {
                localStorage.setItem("passwordValidated", "true"); // Set the flag to skip password page in future
                displayHomeContent(); // Once validated, show the next content
            }, 1500); // Show home content after 1.5 seconds
        } else {
            // Incorrect password, show error message
            errorMessage.classList.remove("hidden");
            setTimeout(() => errorMessage.classList.add("hidden"), 3000); // Hide error after 3 seconds
        }
    };

    // Enter Button Click Event
    enterButton.addEventListener("click", validatePassword);

    // "Enter" Key Submission
    passwordInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") validatePassword();
    });
}

// Function to display the home content
function displayHomeContent() {
    document.body.innerHTML = `
        <div class="next-page">
            <h1>Welcome Home!</h1>
            <audio id="bgm" src="file/The_Smiths_-_There_Is_A_Light_That_Never_Goes_Out.mp3" autoplay loop></audio>
            <div class="menu">
                <button class="modern-btn" onclick="navigateTo('gallery/gallery.html')">Go to Gallery</button>
                <button class="modern-btn" onclick="navigateTo('letterbox/letterbox.html')">Letterbox</button>
                <button class="modern-btn" onclick="navigateTo('webchat/webchat.html')">Webchat</button>
                <button class="modern-btn" onclick="navigateTo('gameroom/gameroom.html')">Game Room</button>
                <button class="modern-btn" onclick="logout()">Logout</button>
            </div>
        </div>
    `;
}

// Navigate to a specific page
function navigateTo(url) {
    window.location.href = url;
}

// Logout function to return to the password page
function logout() {
    localStorage.removeItem("passwordValidated");
    window.location.href = "index.html";
}
