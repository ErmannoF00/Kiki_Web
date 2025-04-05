document.addEventListener("DOMContentLoaded", () => {
    const isValidated = localStorage.getItem("passwordValidated") === "true";
  
    if (isValidated) {
      displayHomeContent();
    } else {
      setupPasswordPage();
    }
  });
  
  function setupPasswordPage() {
    const passwordInput = document.getElementById("password-input");
    const enterButton = document.getElementById("enter-button");
    const errorMessage = document.getElementById("error-message");
    const loadingIcon = document.getElementById("loading-icon");
  
    const validatePassword = () => {
      const password = passwordInput.value.trim();
  
      if (password === "baubau") {
        loadingIcon.classList.remove("hidden");
  
        document.querySelector(".container").classList.add("fade-out");
  
        setTimeout(() => {
          localStorage.setItem("passwordValidated", "true");
          displayHomeContent();
        }, 1500);
      } else {
        errorMessage.classList.remove("hidden");
        setTimeout(() => errorMessage.classList.add("hidden"), 3000);
      }
    };
  
    enterButton.addEventListener("click", validatePassword);
    passwordInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") validatePassword();
    });
  }
  
  function displayHomeContent() {
    document.body.className = "next-page fade-in";
  
    // Remove everything else but keep video if present
    Array.from(document.body.children).forEach(child => {
      if (child.tagName !== "VIDEO") child.remove();
    });
  
    const audio = document.createElement("audio");
    audio.src = "file/The_Smiths_-_There_Is_A_Light_That_Never_Goes_Out.mp3";
    audio.autoplay = true;
    audio.loop = true;
    audio.setAttribute("playsinline", "true");
  
    const wrapper = document.createElement("div");
    wrapper.className = "next-page-content fade-in";
    wrapper.innerHTML = `
      <h1 class="slide-in">Benvenuto a casa 🏡</h1>
      <div class="menu">
        <button class="modern-btn glow" onclick="navigateTo('gallery/gallery.html')">Galleria</button>
        <button class="modern-btn glow" onclick="navigateTo('letterbox/letterbox.html')">Lettere</button>
        <button class="modern-btn glow" onclick="navigateTo('webchat/webchat.html')">Webchat</button>
        <button class="modern-btn glow" onclick="navigateTo('gameroom/gameroom.html')">Game Room</button>
        <button class="modern-btn logout-btn" onclick="logout()">Esci</button>
      </div>
    `;
  
    document.body.appendChild(audio);
    document.body.appendChild(wrapper);
  }
  
  function navigateTo(url) {
    window.location.href = url;
  }
  
  function logout() {
    localStorage.removeItem("passwordValidated");
    window.location.href = "index.html";
  }
  