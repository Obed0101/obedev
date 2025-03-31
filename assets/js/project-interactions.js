// Project Interactions
document.addEventListener("DOMContentLoaded", () => {
  // Initialize interactive elements for hybrid project
  initHybridProject();

  // Initialize hover effects for project cards
  initProjectCards();
});

// Initialize the hybrid project interactive elements
function initHybridProject() {
  const hybridProject = document.querySelector(".project-hybrid");
  if (!hybridProject) return;

  // Create interactive elements
  const previewContainer = hybridProject.querySelector(
    ".project-hybrid-preview"
  );
  if (!previewContainer) return;

  // Add interactive preview toggle
  const toggleButton = document.createElement("button");
  toggleButton.className = "preview-toggle";
  toggleButton.innerHTML = '<i class="fas fa-eye"></i> Ver Demo';
  hybridProject.querySelector(".project-hybrid-links").prepend(toggleButton);

  // Toggle preview visibility
  toggleButton.addEventListener("click", (e) => {
    e.preventDefault();

    if (previewContainer.classList.contains("active")) {
      previewContainer.classList.remove("active");
      toggleButton.innerHTML = '<i class="fas fa-eye"></i> Ver Demo';
      previewContainer.style.height = "0";
      previewContainer.style.opacity = "0";
    } else {
      previewContainer.classList.add("active");
      toggleButton.innerHTML = '<i class="fas fa-eye-slash"></i> Ocultar Demo';
      previewContainer.style.height = "300px";
      previewContainer.style.opacity = "1";

      // Load iframe content if not already loaded
      const iframe = previewContainer.querySelector("iframe");
      if (iframe && !iframe.src) {
        iframe.src = iframe.dataset.src;
      }
    }
  });

  // Add interactive elements
  const techTags = hybridProject.querySelectorAll(".project-tag");
  techTags.forEach((tag) => {
    tag.addEventListener("click", () => {
      tag.classList.toggle("active");
    });
  });
}

// Initialize hover effects for project cards
function initProjectCards() {
  const projectCards = document.querySelectorAll(".project-card");

  projectCards.forEach((card) => {
    const image = card.querySelector(".project-card-image");

    // Create gradient overlay effect on hover
    card.addEventListener("mousemove", (e) => {
      if (!image) return;

      // Calculate mouse position relative to card
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update gradient position
      card.style.background = `
        radial-gradient(
          circle at ${x}px ${y}px,
          rgba(113, 76, 223, 0.15) 0%,
          rgba(18, 18, 18, 0.5) 50%
        )
      `;
    });

    // Reset gradient on mouse leave
    card.addEventListener("mouseleave", () => {
      card.style.background = "rgba(18, 18, 18, 0.5)";
    });
  });
}
