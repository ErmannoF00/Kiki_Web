document.addEventListener("DOMContentLoaded", () => {
  const galleryContainer = document.getElementById("gallery-container");
  const uploadButton = document.getElementById("upload-button");
  const fileUpload = document.getElementById("file-upload");

  const modal = document.getElementById("fullscreen-modal");
  const modalImg = document.getElementById("fullscreen-img");
  const modalClose = document.querySelector(".close");

  let images = JSON.parse(localStorage.getItem("userImages") || "[]");

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
    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      images.splice(index, 1);
      localStorage.setItem("userImages", JSON.stringify(images));
      updateGallery();
    });
    ul.appendChild(removeBtn);

    // Drag events
    ul.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("index", index);
    });

    ul.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    ul.addEventListener("drop", (e) => {
      e.preventDefault();
      const draggedIndex = e.dataTransfer.getData("index");
      const targetIndex = ul.dataset.index;
      const temp = images[draggedIndex];
      images[draggedIndex] = images[targetIndex];
      images[targetIndex] = temp;
      localStorage.setItem("userImages", JSON.stringify(images));
      updateGallery();
    });

    galleryContainer.appendChild(ul);
  }

  function updateGallery() {
    galleryContainer.innerHTML = "";
    images.forEach((src, index) => createCube(src, index));
  }

  uploadButton.addEventListener("click", () => {
    const file = fileUpload.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataURL = reader.result;
        images.push(dataURL);
        localStorage.setItem("userImages", JSON.stringify(images));
        updateGallery();
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please select a valid image file!");
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

  updateGallery();
});
