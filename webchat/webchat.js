document.addEventListener("DOMContentLoaded", () => {
    const chatInput = document.getElementById("chat-input");
    const chatMessages = document.getElementById("chat-messages");
    const sendButton = document.getElementById("send-button");
    const audioRecordButton = document.getElementById("audio-record");
    const videoRecordButton = document.getElementById("video-record");
  
    sendButton.addEventListener("click", sendMessage);
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        sendMessage();
      }
    });
  
    // Mock function to simulate sending a message
    function sendMessage() {
      const messageText = chatInput.value.trim();
      if (messageText) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");
        messageElement.innerHTML = `<span class="username">You:</span> ${messageText}`;
        chatMessages.appendChild(messageElement);
        chatInput.value = "";
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
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
  
    // Video recording logic (for future implementation)
    videoRecordButton.addEventListener("click", async () => {
      alert("Video recording is not yet implemented.");
    });
  });
  