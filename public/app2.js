let scrollAmount = 0;

function scrollRight() {
  const carousel = document.querySelector('.carousel-track');
  const scrollMax = carousel.scrollWidth - carousel.clientWidth;
  
  if (scrollAmount <= scrollMax) {
    scrollAmount += 220; // Adjust to match the width of each .carousel-item + margin
    carousel.style.transform = `translateX(-${scrollAmount}px)`;
  }
}

function scrollLeft() {
  const carousel = document.querySelector('.carousel-track');
  
  if (scrollAmount > 0) {
    scrollAmount -= 220; // Adjust to match the width of each .carousel-item + margin
    carousel.style.transform = `translateX(-${scrollAmount}px)`;
  }
}


