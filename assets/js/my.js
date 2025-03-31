const typedTextSpan = document.querySelector(".typed-text");
const cursorSpan = document.querySelector(".cur-sor-ef");

const textArray = [
  "bots.",
  "NoSQL databases.",
  "web interfaces.",
  "RPA.",
  "NodeJS apis.",
];
const typingDelay = 100;
const erasingDelay = 75;
const newTextDelay = 1000; // Delay between current and next text
let textArrayIndex = 0;
let charIndex = 0;

function type() {
  if (charIndex < textArray[textArrayIndex].length) {
    if (!cursorSpan.classList.contains("typing"))
      cursorSpan.classList.add("typing");
    typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
    charIndex++;
    setTimeout(type, typingDelay);
  } else {
    cursorSpan.classList.remove("typing");
    setTimeout(erase, newTextDelay);
  }
}

function erase() {
  if (charIndex > 0) {
    if (!cursorSpan.classList.contains("typing"))
      cursorSpan.classList.add("typing");
    typedTextSpan.textContent = textArray[textArrayIndex].substring(
      0,
      charIndex - 1
    );
    charIndex--;
    setTimeout(erase, erasingDelay);
  } else {
    cursorSpan.classList.remove("typing");
    textArrayIndex++;
    if (textArrayIndex >= textArray.length) textArrayIndex = 0;
    setTimeout(type, typingDelay + 1100);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // On DOM Load initiate the effect
  if (textArray.length) setTimeout(type, newTextDelay + 250);
});

function preventDefault(e) {
  e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}

// modern Chrome requires { passive: false } when adding event
var supportsPassive = false;
try {
  window.addEventListener(
    "test",
    null,
    Object.defineProperty({}, "passive", {
      get: function () {
        supportsPassive = true;
      },
    })
  );
} catch (e) {}

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent =
  "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";

// call this to Disable
function disableScroll() {
  window.addEventListener("DOMMouseScroll", preventDefault, false); // older FF
  window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
  window.addEventListener("touchmove", preventDefault, wheelOpt); // mobile
  window.addEventListener("keydown", preventDefaultForScrollKeys, false);
}

// call this to Enable
function enableScroll() {
  window.removeEventListener("DOMMouseScroll", preventDefault, false);
  window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
  window.removeEventListener("touchmove", preventDefault, wheelOpt);
  window.removeEventListener("keydown", preventDefaultForScrollKeys, false);
}

// Preloader

function premyfucn() {
  $(window).on("load", function () {
    disableScroll();
    $(".preloader").fadeOut("slow");
    enableScroll();
    $("body").removeClass("loading");
  });
}

premyfucn();

/**
 * Animation on scroll
 */
function aos_init() {
  AOS.init({
    duration: 1000,
    easing: "ease-in-out",
    once: true,
    mirror: false,
  });
}

/**
 * Testimonials Carousel
 */
function initTestimonialsCarousel() {
  const container = document.getElementById("testimonialsContainer");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const carouselElement = document.querySelector(".testimonials-carousel");

  if (!container || !prevBtn || !nextBtn || !carouselElement) return;

  let currentPosition = 0;
  let currentIndex = 0;
  const testimonials = container.querySelectorAll(".col-lg-5");
  const testimonialWidth = testimonials[0].offsetWidth + 20; // Width + gap
  const isMobile = window.innerWidth <= 768;
  const visibleItems = isMobile ? 1 : 2; // Show 1 on mobile, 2 on desktop
  const maxPosition = (testimonials.length - visibleItems) * testimonialWidth;
  let autoplayInterval = null;
  let isHovering = false;

  // Calculate container width and center offset for mobile
  const containerWidth = carouselElement.offsetWidth;
  const centerOffset = isMobile ? (containerWidth - testimonialWidth) / 2 : 0;

  // Initialize position with center offset for mobile
  container.style.transform = `translateX(${isMobile ? centerOffset : 0}px)`;

  // Function to move to next slide
  const moveNext = () => {
    if (currentIndex >= testimonials.length - visibleItems) {
      // Reset to beginning when reaching the end for continuous loop
      currentIndex = 0;
      currentPosition = 0;
    } else {
      currentIndex++;
      currentPosition = currentIndex * testimonialWidth;
    }

    // Apply transform with center offset for mobile
    const transformValue = isMobile
      ? -currentPosition + centerOffset
      : -currentPosition;

    container.style.transform = `translateX(${transformValue}px)`;
  };

  // Function to move to previous slide
  const movePrev = () => {
    currentIndex = Math.max(currentIndex - 1, 0);
    currentPosition = currentIndex * testimonialWidth;

    // Apply transform with center offset for mobile
    const transformValue = isMobile
      ? -currentPosition + centerOffset
      : -currentPosition;

    container.style.transform = `translateX(${transformValue}px)`;
  };

  // Previous button click
  prevBtn.addEventListener("click", () => {
    movePrev();
    // Reset autoplay timer when manually navigating
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      if (!isHovering) startAutoplay();
    }
  });

  // Next button click
  nextBtn.addEventListener("click", () => {
    moveNext();
    // Reset autoplay timer when manually navigating
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      if (!isHovering) startAutoplay();
    }
  });

  // Start autoplay function
  const startAutoplay = () => {
    if (autoplayInterval) clearInterval(autoplayInterval);
    autoplayInterval = setInterval(() => {
      if (!isHovering) moveNext();
    }, 3000); // Move every 3 seconds
  };

  // Pause on hover
  carouselElement.addEventListener("mouseenter", () => {
    isHovering = true;
  });

  // Resume on mouse leave
  carouselElement.addEventListener("mouseleave", () => {
    isHovering = false;
  });

  // Start autoplay
  startAutoplay();
}

// Reinitialize carousel on window resize
let testimonialsCarouselInitialized = false;
let resizeTimeout;

window.addEventListener("resize", () => {
  // Debounce resize event
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if (testimonialsCarouselInitialized) {
      // Remove old event listeners and reinitialize
      const oldContainer = document.getElementById("testimonialsContainer");
      if (oldContainer) {
        oldContainer.style.transform = "translateX(0px)";
      }
      initTestimonialsCarousel();
    }
  }, 250);
});

window.addEventListener("load", () => {
  aos_init();
  initTestimonialsCarousel();
  testimonialsCarouselInitialized = true;
});
