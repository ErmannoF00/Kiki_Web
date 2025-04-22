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
      images = data.imageUrls || []; // Ensure you're using imageUrls
      updateGallery();
    } catch (error) {
      console.error("Error during image loading:", error);
    }
  }
  

  // Save the current images to the backend
  async function saveImages() {
    try {
      await fetch("https://kiki-web-33io.onrender.com/api/images", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(images),  // Ensure the images are in the correct format
      });
    } catch (error) {
      console.error("Error saving images:", error);
    }
  }

  // Upload images to Google Drive
  async function uploadImagesToDrive(base64Images, mimeType) {
    try {
      const uploadPromises = base64Images.map((base64Image, index) => {
        const fileName = `image${index}.jpg`; // Example dynamic naming logic
        return uploadImageToDrive(base64Image, fileName, mimeType);
      });

      await Promise.all(uploadPromises); // Wait for all uploads to finish
      console.log("All images uploaded successfully.");
    } catch (err) {
      console.error("Error uploading images:", err.message);
    }
  }

  // Upload a single image to Google Drive
  async function uploadImageToDrive(base64Image, fileName) {
    try {
      const auth = await authenticateGoogleDrive();
      const driveService = google.drive({ version: "v3", auth });
  
      // Convert base64 string to buffer
      const buffer = Buffer.from(base64Image.split(",")[1], "base64");
  
      const fileMetadata = {
        name: fileName,
        parents: ["1wDTQl4oN6ayHfzHXPrEY9AyPwq6OAOja"], // Your folder ID on Google Drive
      };
  
      const media = {
        mimeType: "image/jpeg", // Assuming all images are jpeg; adjust if necessary
        body: buffer,
      };
  
      const res = await driveService.files.create({
        resource: fileMetadata,
        media: media,
        fields: "id",
      });
  
      console.log("File uploaded to Drive with ID:", res.data.id);
      return `https://drive.google.com/uc?id=${res.data.id}`; // Return the Google Drive image URL
    } catch (err) {
      console.error("Error uploading file to Google Drive:", err.message);
      throw new Error("Failed to upload image to Google Drive");
    }
  }
  

  // Create a visual gallery item (cube) for each image
  function createCube(imageUrl, index) {
    const ul = document.createElement("ul");
    ul.classList.add("cube");
    ul.setAttribute("draggable", "true");
    ul.dataset.index = index;

    // Create 9 'li' elements for the cube look
    for (let i = 0; i < 9; i++) {
      const li = document.createElement("li");
      li.style.backgroundImage = `url('${imageUrl}')`;
      ul.appendChild(li);
    }

    // Open image in fullscreen modal on click
    ul.addEventListener("click", (e) => {
      if (e.target.classList.contains("remove-btn")) return;
      modal.style.display = "flex";
      modalImg.src = imageUrl;
    });

    // Create and handle the remove button
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "×";
    removeBtn.classList.add("remove-btn");
    removeBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      images.splice(index, 1); // Remove image from the array
      await saveImages(); // Save the updated images
      updateGallery(); // Refresh gallery
    });
    ul.appendChild(removeBtn);

    // Enable drag and drop
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
      await saveImages(); // Save the new order
      updateGallery(); // Refresh gallery
    });

    galleryContainer.appendChild(ul); // Add the cube to the gallery container
  }

  // Update the gallery with the current images
  function updateGallery() {
    galleryContainer.innerHTML = ""; // Clear existing gallery
    images.forEach((src, index) => createCube(src, index)); // Add images as cubes
  }

  // Handle image file upload
  fileUpload.addEventListener("change", () => {
    const file = fileUpload.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = async () => {
        images.push(reader.result); // Add image as base64
        await saveImages(); // Save to backend
        updateGallery(); // Refresh gallery
  
        // Upload the image to Google Drive
        const base64Image = reader.result; // base64 string of the image
        const fileName = file.name; // Use the original file name or customize
        const mimeType = file.type; // Dynamically get the MIME type
  
        await uploadImageToDrive(base64Image, fileName, mimeType); // Pass MIME type
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please select a valid image file.");
    }
  });

  // Close the modal when the close button is clicked
  modalClose.addEventListener("click", () => {
    modal.style.display = "none";
    modalImg.src = "";
  });

  // Close the modal when clicking outside the image
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      modalImg.src = "";
    }
  });

  // Initial fetch of images from the backend
  fetchImages();
});
