document.addEventListener("DOMContentLoaded", () => {
  const socket = new WebSocket("wss://kiki-web-33io.onrender.com");

  const gameButtons = document.querySelectorAll(".game-option");
  const yourGameText = document.getElementById("your-game");
  const friendGameText = document.getElementById("friend-game-status");
  const onlineIndicator = document.getElementById("online-status");
  const startGameBtn = document.getElementById("start-game");

  let yourSelection = null;
  let friendSelection = null;

  // Ensure messages are sent only when the WebSocket is open
  function safeSend(data) {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(data));
    } else {
      socket.addEventListener("open", () => {
        socket.send(JSON.stringify(data));
      }, { once: true });
    }
  }

  gameButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      yourSelection = btn.dataset.game;
      yourGameText.textContent = `You selected: ${yourSelection}`;
      safeSend({ type: "game-selection", game: yourSelection });

      if (friendSelection) {
        startGameBtn.style.display = "block";
      }
    });
  });

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === "presence") {
      const online = data.count > 1;
      onlineIndicator.textContent = online ? "Friend is online 💖" : "You're alone 😢";
    }

    if (data.type === "games") {
      const [you, friend] = data.games;
      friendSelection = friend;
      if (friend && friend !== yourSelection) {
        friendGameText.textContent = `Friend selected: ${friend}`;
        if (yourSelection) {
          startGameBtn.style.display = "block";
        }
      }
    }
  };

  startGameBtn.addEventListener("click", () => {
    if (yourSelection) {
      window.open(yourSelection, "_blank");
    }
  });
});
