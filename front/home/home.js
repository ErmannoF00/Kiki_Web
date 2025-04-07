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

      setTimeout(() => {
        localStorage.setItem("passwordValidated", "true");
        document.querySelector(".container").classList.add("fade-out");
        setTimeout(displayHomeContent, 500);
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
  document.body.className = "next-page";

  const children = Array.from(document.body.children);
  children.forEach(child => {
    if (child.tagName !== "VIDEO") child.remove();
  });

  const repoName = window.location.pathname.split('/')[1];
  const BASE = `/${repoName}/front/`;

  const audio = document.createElement("audio");
  audio.id = "bgm";
  audio.src = `${BASE}songs/song1.mp3`;
  audio.autoplay = true;
  audio.loop = true;
  audio.setAttribute("playsinline", "true");

  const wrapper = document.createElement("div");
  wrapper.className = "next-page-content";
  wrapper.innerHTML = `
    <h1>Benvenutə a casa 🏡</h1>
    <div class="menu">
      <button class="modern-btn" onclick="navigateTo('${BASE}gallery/gallery.html')">Galleria</button>
      <button class="modern-btn" onclick="navigateTo('${BASE}letterbox/letterbox.html')">Lettere</button>
      <button class="modern-btn" onclick="navigateTo('${BASE}webchat/webchat.html')">Webchat</button>
      <button class="modern-btn" onclick="navigateTo('${BASE}gameroom/gameroom.html')">Sala Giochi</button>
      <button class="modern-btn" onclick="logout()">Esci</button>
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
  const repoName = window.location.pathname.split('/')[1];
  window.location.href = `/${repoName}/index.html`;
}
