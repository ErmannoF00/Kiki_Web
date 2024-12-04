document.addEventListener("DOMContentLoaded", () => {
    const gameOptions = document.querySelectorAll(".game-option");
    const yourGameDisplay = document.getElementById("your-game");
    const friendGameStatus = document.getElementById("friend-game-status");
    const startGameButton = document.getElementById("start-game");
  
    let yourGameSelection = null;
    let friendGameSelection = null;
  
    // Function to handle game selection
    gameOptions.forEach(button => {
      button.addEventListener("click", (e) => {
        yourGameSelection = e.target.getAttribute("data-game");
        yourGameDisplay.textContent = `You selected: ${yourGameSelection}`;
        localStorage.setItem("yourGame", yourGameSelection);
        checkFriendSelection();
      });
    });
  
    // Function to check if the friend has made a selection
    const checkFriendSelection = () => {
      friendGameSelection = localStorage.getItem("friendGame");
      if (friendGameSelection) {
        friendGameStatus.textContent = `Friend selected: ${friendGameSelection}`;
        startGameButton.style.display = "block";
        startGameButton.addEventListener("click", () => {
          alert(`Starting game: ${yourGameSelection}`);
          // Redirect to the chosen game link
          window.location.href = `../games/${yourGameSelection}.html`;
        });
      }
    };
  
    // Simulate friend selecting a game (this would be replaced with real-time updates)
    setTimeout(() => {
      if (!friendGameSelection) {
        friendGameSelection = "game2"; // Hardcoded for demo purposes
        localStorage.setItem("friendGame", friendGameSelection);
        checkFriendSelection();
      }
    }, 3000); // Simulate a 3-second delay for the friend selection
  });
  