document.addEventListener("DOMContentLoaded", () => {
    const passwordInput = document.getElementById("password-input");
    const enterButton = document.getElementById("enter-button");
    const errorMessage = document.getElementById("error-message");
    const loadingIcon = document.getElementById("loading-icon");

    // Validate Password Function
    const validatePassword = () => {
        const password = passwordInput.value.trim();
        if (password === "dioporco") {
            loadingIcon.classList.remove("hidden"); // Show loading icon

            // Simulate a delay to show loading
            setTimeout(() => {
                displayHomeContent(); // Once validated, show the next content
            }, 1500); // Show home content after 1.5 seconds
        } else {
            // Incorrect password, show error message
            errorMessage.classList.remove("hidden");
            setTimeout(() => {
                errorMessage.classList.add("hidden"); // Hide error after 3 seconds
            }, 3000);
        }
    };

    // Enter Button Click Event
    enterButton.addEventListener("click", validatePassword);

    // "Enter" Key Submission
    passwordInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") validatePassword();
    });
});

// Display Home Content
function displayHomeContent() {
    document.body.innerHTML = `
        <div class="next-page">
            <h1>Welcome Home!</h1>
            <audio src="file/The Smiths - There Is A Light That Never Goes Out (Official Audio).mp3" autoplay loop></audio>
            <div class="menu">
                <button class="modern-btn" onclick="navigateTo('gallery/gallery.html')">Go to Gallery</button>
                <button class="modern-btn" onclick="navigateTo('letterbox/letterbox.html')">Letterbox</button>
                <button class="modern-btn" onclick="navigateTo('webchat/webchat.html')">Webchat</button>
                <button class="modern-btn" onclick="navigateTo('gameroom/gameroom.html')">Game Room</button>
            </div>
        </div>
    `;
}

// Navigate to a specific page
function navigateTo(url) {
    window.location.href = url;
}
