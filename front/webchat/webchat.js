document.addEventListener("DOMContentLoaded", () => {
  const chatInput = document.getElementById("chat-input");
  const chatMessages = document.getElementById("chat-messages");
  const sendButton = document.getElementById("send-button");
  const audioRecordButton = document.getElementById("audio-record");
  const videoRecordButton = document.getElementById("video-record");
  const userStatus = document.getElementById("user-status");

  // Initialize WebSocket connection to the server
  const socket = new WebSocket("ws://localhost:8080");

  socket.onopen = () => {
    console.log("Connected to the server");
    userStatus.textContent = "Online";
  };

  socket.onclose = () => {
    console.log("Disconnected from the server");
    userStatus.textContent = "Offline";
  };

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type === "chat") {
      displayMessage(message);
    }
  };

  sendButton.addEventListener("click", () => {
    const messageText = chatInput.value.trim();
    if (messageText) {
      const message = { type: "chat", content: messageText, username: "You" };
      socket.send(JSON.stringify(message));
      chatInput.value = "";
      displayMessage(message);
    }
  });

  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendButton.click();
    }
  });

  function displayMessage({ username, content }) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");
    messageElement.innerHTML = `<span class="username">${username}:</span> <span class="text">${content}</span>`;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Audio recording logic
  let audioRecorder;
  let audioChunks = [];

  audioRecordButton.addEventListener("click", async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Audio recording is not supported in your browser.");
      return;
    }

    if (!audioRecorder) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioRecorder = new MediaRecorder(stream);
      audioRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };
      audioRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audioElement = new Audio(audioUrl);
        audioElement.controls = true;
        chatMessages.appendChild(audioElement);
        audioChunks = [];
      };
      audioRecorder.start();
      audioRecordButton.textContent = "Stop";
    } else {
      audioRecorder.stop();
      audioRecorder = null;
      audioRecordButton.textContent = "🎙️";
    }
  });

  videoRecordButton.addEventListener("click", async () => {
    alert("Video recording is not yet implemented.");
  });
});
