// Navigation functionality
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

// Toggle mobile menu
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Smooth scrolling for anchor links
const smoothScroll = document.querySelectorAll('a[href^="#"]');
smoothScroll.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth' });
    });
});

// Hover animations
const hoverElements = document.querySelectorAll('.hover-effect');
hoverElements.forEach(element => {
    element.addEventListener('mouseover', () => {
        element.classList.add('hovered');
    });
    element.addEventListener('mouseout', () => {
        element.classList.remove('hovered');
    });
});