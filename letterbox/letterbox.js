document.addEventListener("DOMContentLoaded", () => {
  const letterList = document.getElementById("letter-list").querySelector("ul");
  const modal = document.getElementById("letter-modal");
  const form = document.getElementById("letter-form");
  const openFormButton = document.getElementById("open-form-button");
  const closeModalButton = document.querySelector(".close-button");

  const letterTextBox = document.getElementById("letter-text");
  const visualLetter = document.getElementById("visual-letter");
  const openHeart = document.getElementById("open-heart");
  const closeLetter = document.getElementById("close-letter");
  const envelope = document.getElementById("envelope");
  const authorPreview = document.getElementById("letter-author-preview");
  const imagePreview = document.getElementById("letter-image-preview");
  const imageInput = document.getElementById("letter-image");

  let letters = [];

  async function fetchLetters() {
    try {
      const res = await fetch("https://kiki-web-33io.onrender.com/api/letters");
      const data = await res.json();
      letters = data.letters || [];
      updateLetterList();
    } catch (error) {
      console.error("Error fetching letters:", error);
    }
  }

  async function saveLetters() {
    try {
      await fetch("https://kiki-web-33io.onrender.com/api/letters", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ letters }),
      });
    } catch (error) {
      console.error("Error saving letters:", error);
    }
  }

  function updateLetterList() {
    letterList.innerHTML = "";
    letters.forEach((letter, index) => {
      const li = document.createElement("li");
      li.textContent = `${letter.title} — ${letter.author}`;
      li.addEventListener("click", () => showLetter(letter));
      letterList.appendChild(li);
    });
  }

  function showLetter(letter) {
    letterTextBox.innerText = letter.content;
    authorPreview.innerText = letter.author;
    if (letter.image) {
      imagePreview.src = letter.image;
      imagePreview.style.display = "block";
    } else {
      imagePreview.style.display = "none";
    }
    visualLetter.style.display = "flex";
    envelope.classList.remove("active");
  }

  function closeVisualLetter() {
    envelope.classList.remove("active");
    setTimeout(() => {
      visualLetter.style.display = "none";
    }, 800);
  }

  openFormButton.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  closeModalButton.addEventListener("click", () => {
    modal.style.display = "none";
    form.reset();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("letter-title").value.trim();
    const author = document.getElementById("letter-author").value.trim();
    const content = document.getElementById("letter-content").value.trim();
    const file = imageInput.files[0];

    const reader = new FileReader();
    reader.onload = async () => {
      const image = file ? reader.result : null;
      letters.push({ title, author, content, image });
      await saveLetters();
      modal.style.display = "none";
      form.reset();
      updateLetterList();
    };

    if (file) {
      reader.readAsDataURL(file);
    } else {
      reader.onload();
    }
  });

  openHeart.addEventListener("click", () => {
    envelope.classList.add("active");
  });

  closeLetter.addEventListener("click", () => {
    closeVisualLetter();
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      form.reset();
    }
  });

  fetchLetters();
});
