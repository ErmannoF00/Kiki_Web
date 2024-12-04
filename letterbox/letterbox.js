document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("letter-form");
    const titleInput = document.getElementById("letter-title");
    const contentInput = document.getElementById("letter-content");
    const letterList = document.getElementById("letter-list").querySelector("ul");
  
    // Load existing letters from localStorage
    const loadLetters = () => {
      letterList.innerHTML = "";
      const letters = JSON.parse(localStorage.getItem("letters")) || [];
      letters.forEach((letter, index) => {
        const li = document.createElement("li");
        li.textContent = `${letter.title} - ${letter.content.substring(0, 30)}...`;
        letterList.appendChild(li);
      });
    };
  
    // Save new letter to localStorage
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = titleInput.value.trim();
      const content = contentInput.value.trim();
  
      if (title && content) {
        const letters = JSON.parse(localStorage.getItem("letters")) || [];
        letters.push({ title, content });
        localStorage.setItem("letters", JSON.stringify(letters));
        titleInput.value = "";
        contentInput.value = "";
        loadLetters();
      } else {
        alert("Please fill in both fields.");
      }
    });
  
    // Initial load of letters
    loadLetters();
  });
  