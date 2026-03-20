document.addEventListener("DOMContentLoaded", function () {

  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("menu");
  const overlay = document.getElementById("menuOverlay");
  const links = document.querySelectorAll(".menu a");

  if (!hamburger || !menu || !overlay) return;

  // Toggle menu
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    menu.classList.toggle("active");
    overlay.classList.toggle("active");
  });

  // Close on overlay click
  overlay.addEventListener("click", closeMenu);

  // Close on link click
  links.forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  function closeMenu() {
    hamburger.classList.remove("active");
    menu.classList.remove("active");
    overlay.classList.remove("active");
  }

});
