document.addEventListener("DOMContentLoaded", () => {
  const chatInput = document.getElementById("chat-input");
  const chatMessages = document.getElementById("chat-messages");
  const sendButton = document.getElementById("send-button");
  const audioRecordButton = document.getElementById("audio-record");
  const userStatus = document.getElementById("user-status");

  let isAuthorized = false;
  const messages = JSON.parse(localStorage.getItem("privateMessages") || "[]");

  // Ask for second password
  const requestAccess = () => {
    const pass = prompt("Inserisci la password segreta per accedere alla chat:");
    if (pass === "segreto") {
      isAuthorized = true;
      messages.forEach(displayMessage);
    } else {
      alert("Accesso negato.");
    }
  };
  requestAccess();

  const socket = new WebSocket("wss://kiki-web-33io.onrender.com");

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

  const saveAndDisplay = (msg) => {
    messages.push(msg);
    localStorage.setItem("privateMessages", JSON.stringify(messages));
    displayMessage(msg);
  };

  function displayMessage({ username, content }) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("message-bubble", username === "You" ? "outgoing" : "incoming");
    wrapper.innerHTML = `<span class="username">${username}</span><p class="text">${content}</p>`;
    chatMessages.appendChild(wrapper);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // 🎙️ Audio Recording
  let mediaRecorder;
  let chunks = [];

  audioRecordButton.addEventListener("click", async () => {
    if (!navigator.mediaDevices) {
      alert("Audio non supportato nel browser.");
      return;
    }

    if (!mediaRecorder) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

      mediaRecorder.ondataavailable = e => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        const audio = document.createElement("audio");
        audio.controls = true;
        audio.src = url;
        chatMessages.appendChild(audio);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        chunks = [];
      };

      mediaRecorder.start();
      audioRecordButton.textContent = "🛑";
    } else {
      mediaRecorder.stop();
      mediaRecorder = null;
      audioRecordButton.textContent = "🎙️";
    }
  });
});
