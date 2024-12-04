document.addEventListener("DOMContentLoaded", () => {
    // Check if the password container exists and show it if needed
    const passwordContainer = document.getElementById('password-container');
    if (passwordContainer) {
        passwordContainer.style.display = 'block'; // Show the password container by default
        console.log('Password container is now visible');
    } else {
        console.error('Password container not found.');
    }

    // Login form logic
    const loginForm = document.getElementById("login-form");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    if (loginForm) {
        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();

            // Example login validation logic
            const username = usernameInput.value;
            const password = passwordInput.value;

            if (username === "correctUsername" && password === "correctPassword") {
                // Set a flag in local storage indicating the user is logged in
                localStorage.setItem("loggedIn", "true");

                // Hide the password form and show home content after successful login
                if (passwordContainer) {
                    passwordContainer.style.display = 'none'; // Hide after login
                    console.log('Password container hidden.');
                }

                displayHomeContent();
            } else {
                alert("Invalid username or password. Please try again.");
            }
        });
    } else {
        console.error('Login form not found.');
    }
});

// Function to display home content
function displayHomeContent() {
    console.log('Displaying home content...');
    document.body.innerHTML = `
        <div class="curtain-animation" style="animation: curtain 1s forwards;">
            <h1>Welcome to Your Home</h1>
            <audio id="bgm" src="file/The Smiths - There Is A Light That Never Goes Out (Official Audio).mp3" autoplay loop></audio>
            <button onclick="window.location.href='gallery/gallery.html'">Go to Memories Gallery</button>
            <button onclick="window.location.href='letterbox/letterbox.html'">Read/Write Letters</button>
            <button onclick="window.location.href='webchat/webchat.html'">Chat with Friends</button>
            <button onclick="window.location.href='gameroom/gameroom.html'">Enter Game Room</button>
        </div>
    `;
}

// Function to validate the password if used elsewhere
function validatePassword() {
    console.log('Validating password...');
    const passwordInput = document.getElementById('password-input');
    const errorMessage = document.getElementById('error-message');
    const loadingIcon = document.getElementById('loading-icon');

    if (passwordInput.value === "dioporco") {
        console.log('Password is correct');
        localStorage.setItem('loggedIn', 'true'); // Set login state
        loadingIcon.style.display = 'block';

        setTimeout(() => {
            console.log('Hiding password container and displaying home content');
            const passwordContainer = document.getElementById('password-container');
            if (passwordContainer) {
                passwordContainer.style.display = 'none'; // Hide after login
            }
            displayHomeContent();
        }, 1500);
    } else {
        console.log('Incorrect password');
        errorMessage.classList.remove('hidden');
        setTimeout(() => {
            errorMessage.classList.add('hidden');
            passwordInput.value = ''; // Clear the input field
        }, 3000);
    }
}

// Event listeners for login
const enterButton = document.getElementById('enter-button');
if (enterButton) {
    enterButton.addEventListener('click', validatePassword);
    console.log('Enter button event listener added');
}

const passwordInput = document.getElementById('password-input');
if (passwordInput) {
    passwordInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            validatePassword();
        }
    });
    console.log('Password input event listener added');
}
