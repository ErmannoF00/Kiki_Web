document.addEventListener("DOMContentLoaded", () => {
  const galleryContainer = document.getElementById("gallery-container");
  const fileUpload = document.getElementById("file-upload");

  const modal = document.getElementById("fullscreen-modal");
  const modalImg = document.getElementById("fullscreen-img");
  const modalClose = document.querySelector(".close");

  let images = [];

  async function fetchImages() {
    try {
      const res = await fetch("https://kiki-web-33io.onrender.com/api/images");
      const data = await res.json();
      images = data || [];
      updateGallery();
    } catch (error) {
      console.error("Errore durante il caricamento delle immagini:", error);
    }
  }

  async function saveImages() {
    try {
      await fetch("https://kiki-web-33io.onrender.com/api/images", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(images),
      });
    } catch (error) {
      console.error("Errore durante il salvataggio delle immagini:", error);
    }
  }

  function createCube(imageUrl, index) {
    const ul = document.createElement("ul");
    ul.classList.add("cube");
    ul.setAttribute("draggable", "true");
    ul.dataset.index = index;

    for (let i = 0; i < 9; i++) {
      const li = document.createElement("li");
      li.style.backgroundImage = `url('${imageUrl}')`;
      ul.appendChild(li);
    }

    ul.addEventListener("click", (e) => {
      if (e.target.classList.contains("remove-btn")) return;
      modal.style.display = "flex";
      modalImg.src = imageUrl;
    });

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "×";
    removeBtn.classList.add("remove-btn");
    removeBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      images.splice(index, 1);
      await saveImages();
      updateGallery();
    });
    ul.appendChild(removeBtn);

    ul.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("index", index);
    });

    ul.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    ul.addEventListener("drop", async (e) => {
      e.preventDefault();
      const draggedIndex = e.dataTransfer.getData("index");
      const targetIndex = ul.dataset.index;
      const temp = images[draggedIndex];
      images[draggedIndex] = images[targetIndex];
      images[targetIndex] = temp;
      await saveImages();
      updateGallery();
    });

    galleryContainer.appendChild(ul);
  }

  function updateGallery() {
    galleryContainer.innerHTML = "";
    images.forEach((src, index) => createCube(src, index));
  }

  fileUpload.addEventListener("change", () => {
    const file = fileUpload.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = async () => {
        images.push(reader.result); // Add image as base64
        await saveImages();         // Save to backend
        updateGallery();            // Refresh gallery
      };
      reader.readAsDataURL(file);
    } else {
      alert("Seleziona un file immagine valido.");
    }
  });

  modalClose.addEventListener("click", () => {
    modal.style.display = "none";
    modalImg.src = "";
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      modalImg.src = "";
    }
  });

  fetchImages();
});
