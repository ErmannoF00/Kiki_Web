document.addEventListener("DOMContentLoaded", () => {
  const galleryContent = document.getElementById("gallery-content");
  const playMusicButton = document.getElementById("play-music");
  const pauseMusicButton = document.getElementById("pause-music");
  const prevButton = document.getElementById("prev-button");
  const nextButton = document.getElementById("next-button");
  const musicUpload = document.getElementById("music-upload");
  const fileInput = document.getElementById("file-input");

  let images = [
    { src: 'images/kiki.jpg', alt: 'Kiki' },
    { src: 'images/ermi.jpg', alt: 'Ermi' },
  ];
  let currentIndex = 0;
  let music = new Audio();
  let musicPlaying = false;

  // Display image in the gallery
  function displayImage(index) {
    galleryContent.innerHTML = '';
    const img = document.createElement('img');
    img.src = images[index].src;
    img.alt = images[index].alt;
    img.style.transform = 'scale(1)';
    galleryContent.appendChild(img);

    // Add animation
    setTimeout(() => {
      img.style.transform = 'scale(1.05)';
      setTimeout(() => {
        img.style.transform = 'scale(1)';
      }, 500);
    }, 0);
  }

  // Play music from the uploaded file
  musicUpload.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileType = file.type;
      if (fileType.startsWith('audio/')) {
        const audioURL = URL.createObjectURL(file);
        music.src = audioURL;
        console.log(`Music source set to: ${music.src}`);
      } else {
        console.error('Invalid file type. Please upload an audio file.');
        alert('Invalid file type. Please upload an audio file.');
      }
    } else {
      console.log('No music file selected.');
    }
  });

  // Play music when button clicked
  playMusicButton.addEventListener("click", () => {
    if (!musicPlaying && music.src) {
      music.play().then(() => {
        console.log('Music started playing.');
        musicPlaying = true;
      }).catch(error => {
        console.error('Error playing the song:', error);
        alert('An error occurred while trying to play the song.');
      });
    } else {
      console.log('Music already playing.');
    }
  });

  // Pause music when button clicked
  pauseMusicButton.addEventListener("click", () => {
    if (musicPlaying) {
      music.pause();
      console.log('Music paused.');
      musicPlaying = false;
    }
  });

  // Show next image
  function showNextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    displayImage(currentIndex);
  }

  // Show previous image
  function showPrevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    displayImage(currentIndex);
  }

  // Listen to next and previous buttons
  nextButton.addEventListener("click", showNextImage);
  prevButton.addEventListener("click", showPrevImage);

  // Add image to gallery
  fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      images.push({ src: imageURL, alt: file.name });
      console.log('Image added:', file.name);
      displayImage(currentIndex);
    }
  });

  // Initialize the gallery
  displayImage(currentIndex);
});
