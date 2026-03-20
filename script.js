document.addEventListener("DOMContentLoaded", function () {

  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("menu");
  const overlay = document.getElementById("menuOverlay");

  if (!hamburger || !menu || !overlay) return;

  const links = document.querySelectorAll(".menu a");

  // Toggle menu
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    menu.classList.toggle("active");
    overlay.classList.toggle("active");
  });

  // Close function
  function closeMenu() {
    hamburger.classList.remove("active");
    menu.classList.remove("active");
    overlay.classList.remove("active");
  }

  // Overlay click
  overlay.addEventListener("click", closeMenu);

  // Link click (IMPORTANT FIX)
  links.forEach(link => {
    link.addEventListener("click", function () {

      closeMenu();

      // Small delay for smooth closing before navigation
      setTimeout(() => {
        window.location.href = this.href;
      }, 150);

    });
  });

});
