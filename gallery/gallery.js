document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const musicUpload = document.getElementById("music-upload");
  const startButton = document.getElementById("start-gallery");
  const playButton = document.getElementById("play-music");
  const pauseButton = document.getElementById("pause-music");
  const prevButton = document.getElementById("prev-button");
  const nextButton = document.getElementById("next-button");
  const progressBar = document.getElementById("progress-bar");
  const volumeControl = document.getElementById("volume-control");
  const galleryContent = document.getElementById("gallery-content");
  const initialPlayer = document.getElementById("initial-player");
  const gallery = document.getElementById("gallery");

  let music = new Audio();
  let musicPlaying = false;
  let currentIndex = 0;

  const images = [
      { src: 'images/kiki.jpg', alt: 'Kiki' },
      { src: 'images/ermi.jpg', alt: 'Ermi' }
  ];

  // Helper: Display Image
  function displayImage(index) {
      galleryContent.innerHTML = '';
      const img = document.createElement("img");
      img.src = images[index].src;
      img.alt = images[index].alt;
      galleryContent.appendChild(img);
  }

  // Event: Upload Music
  musicUpload.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file && file.type.startsWith("audio/")) {
          const audioURL = URL.createObjectURL(file);
          music.src = audioURL;
          music.load();
          console.log("Audio loaded:", file.name);
      } else {
          alert("Please upload a valid audio file!");
      }
  });

  // Event: Start Gallery
  startButton.addEventListener("click", () => {
      if (music.src) {
          initialPlayer.style.display = "none";
          gallery.style.display = "block";
          displayImage(currentIndex);
      } else {
          alert("Please select a song first!");
      }
  });

  // Event: Play Music
  playButton.addEventListener("click", () => {
      if (music.src && !musicPlaying) {
          music.play()
              .then(() => {
                  musicPlaying = true;
                  console.log("Music is playing.");
              })
              .catch(err => console.error("Playback error:", err));
      } else {
          alert("No music file selected!");
      }
  });

  // Event: Pause Music
  pauseButton.addEventListener("click", () => {
      if (musicPlaying) {
          music.pause();
          musicPlaying = false;
          console.log("Music paused.");
      }
  });

  // Event: Change Volume
  volumeControl.addEventListener("input", (event) => {
      music.volume = event.target.value / 100;
  });

  // Event: Progress Bar
  music.addEventListener("timeupdate", () => {
      if (music.duration) {
          progressBar.value = (music.currentTime / music.duration) * 100;
      }
  });

  progressBar.addEventListener("input", (event) => {
      if (music.duration) {
          music.currentTime = (event.target.value / 100) * music.duration;
      }
  });

  // Navigation: Next Image
  nextButton.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % images.length;
      displayImage(currentIndex);
  });

  // Navigation: Previous Image
  prevButton.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      displayImage(currentIndex);
  });
});
