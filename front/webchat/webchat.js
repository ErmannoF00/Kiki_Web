document.addEventListener("DOMContentLoaded", () => {
  const chatInput = document.getElementById("chat-input");
  const chatMessages = document.getElementById("chat-messages");
  const sendButton = document.getElementById("send-button");
  const audioRecordButton = document.getElementById("audio-record");
  const videoRecordButton = document.getElementById("video-record");
  const userStatus = document.getElementById("user-status");

  let isAuthorized = false;
  const messages = JSON.parse(localStorage.getItem("privateMessages") || "[]");

  const requestAccess = () => {
    const pass = prompt("Inserisci la seconda password per accedere alla chat:");
    if (pass === "segreto") {
      isAuthorized = true;
      messages.forEach(displayMessage);
    } else {
      alert("Accesso negato.");
    }
  };

  requestAccess();

  const socket = new WebSocket("wss://kiki-web-33io.onrender.com"); // Use your backend
  socket.onopen = () => (userStatus.textContent = "Online");
  socket.onclose = () => (userStatus.textContent = "Offline");

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type === "chat") {
      saveAndDisplay(message);
    }
  };

  sendButton.addEventListener("click", () => {
    const text = chatInput.value.trim();
    if (text && isAuthorized) {
      const message = { type: "chat", content: text, username: "You" };
      socket.send(JSON.stringify(message));
      saveAndDisplay(message);
      chatInput.value = "";
    }
  });

  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendButton.click();
  });

  const saveAndDisplay = (message) => {
    messages.push(message);
    localStorage.setItem("privateMessages", JSON.stringify(messages));
    displayMessage(message);
  };

  function displayMessage({ username, content }) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("message-bubble", username === "You" ? "outgoing" : "incoming");
    wrapper.innerHTML = `<span class="username">${username}</span><p class="text">${content}</p>`;
    chatMessages.appendChild(wrapper);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  audioRecordButton.addEventListener("click", async () => {
    alert("Registrazione audio non ancora disponibile.");
  });

  videoRecordButton.addEventListener("click", async () => {
    alert("Registrazione video non ancora disponibile.");
  });
});
