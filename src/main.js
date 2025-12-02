// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Mobile Menu
const burger = document.querySelector('.burger');
const nav = document.querySelector('.header__nav');
const body = document.body;

burger.addEventListener('click', () => {
    nav.classList.toggle('active');
    body.classList.toggle('no-scroll'); // Needs CSS class if we want to lock scroll
});

// Close menu on link click
document.querySelectorAll('.header__link').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
    });
});