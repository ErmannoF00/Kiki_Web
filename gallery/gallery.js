document.addEventListener("DOMContentLoaded", () => {
  const galleryContent = document.getElementById("gallery-content");
  const musicSelector = document.getElementById("music-selector");
  const playMusicButton = document.getElementById("play-music");
  const pauseMusicButton = document.getElementById("pause-music");
  const prevButton = document.getElementById("prev-button");
  const nextButton = document.getElementById("next-button");

  const images = [
      { src: '../images/kiki.jpg', alt: 'Kiki' },
      { src: '../images/ermi.jpg', alt: 'Ermi' },
      // Add more images as needed
  ];
  let currentIndex = 0;

  const music = new Audio();
  music.loop = true;

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

  function playMusic() {
    const selectedSong = musicSelector.value;
    console.log(`Selected song path: ${selectedSong}`);
    if (selectedSong) {
      music.src = `../file/${selectedSong}`; // Adjust path if necessary for your structure
      console.log(`Music source set to: ${music.src}`);
      
      music.play().then(() => {
          console.log('Music started playing.');
      }).catch(error => {
          console.error('Error playing the song:', error);
      });
    } else {
        console.log('No song selected.');
    }
  }

  function pauseMusic() {
      console.log('Pausing music');
      music.pause();
  }

  function showNextImage() {
      currentIndex = (currentIndex + 1) % images.length;
      displayImage(currentIndex);
  }

  function showPrevImage() {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      displayImage(currentIndex);
  }

  playMusicButton.addEventListener("click", () => {
    console.log('Play button clicked.');
    playMusic();
  });
  
  pauseMusicButton.addEventListener("click", () => {
    console.log('Pause button clicked.');
    pauseMusic();
  });
  
  nextButton.addEventListener("click", showNextImage);
  prevButton.addEventListener("click", showPrevImage);

  // Initialize the gallery
  displayImage(currentIndex);
});
