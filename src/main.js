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
/* ========================
   HERO ANIMATIONS
   ======================== */

// 1. Text Reveal Animation with GSAP
document.addEventListener('DOMContentLoaded', () => {
    // Split text into words/chars
    const typeSplit = new SplitType('.reveal-text', { types: 'lines, words' });
    
    // Animate Lines
    gsap.from(typeSplit.words, {
        y: '100%',
        opacity: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: 'power2.out',
        delay: 0.2
    });

    // Animate Actions (Buttons & Stats)
    gsap.from('.reveal-actions', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        delay: 0.8,
        ease: 'power2.out',
        stagger: 0.2
    });
});

/* ========================
   CANVAS PARTICLE NETWORK
   ======================== */
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

// Configuration
const particleCount = 60; // Количество частиц
const connectionDistance = 150; // Дистанция соединения линий
const mouseDistance = 200; // Реакция на мышь

// Resize
function resize() {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
}
window.addEventListener('resize', resize);
resize();

// Mouse tracking
let mouse = { x: null, y: null };
window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});
window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

// Particle Class
class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.size = Math.random() * 2 + 1;
        this.color = '#06b6d4'; // Cyan accent
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off walls
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse interaction
        if (mouse.x != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouseDistance) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (mouseDistance - distance) / mouseDistance;
                const directionX = forceDirectionX * force * 2;
                const directionY = forceDirectionY * force * 2;
                this.x -= directionX;
                this.y -= directionY;
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

// Init Particles
function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}
initParticles();

// Animation Loop
function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Draw connections
        for (let j = i; j < particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(139, 92, 246, ${1 - distance / connectionDistance})`; // Purple lines
                ctx.lineWidth = 1;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateParticles);
}
animateParticles();

/* ========================
   SCROLL ANIMATIONS (Simple Observer)
   ======================== */
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target); // Animate only once
        }
    });
}, observerOptions);

// Set initial state and observe
const animatedElements = document.querySelectorAll('.reveal-card, .section-header, .innovation-content, .innovation-visual');

animatedElements.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "all 0.8s ease-out";
    observer.observe(el);
});
/* ========================
   MATH CAPTCHA & FORM
   ======================== */
const form = document.getElementById('contactForm');
const successMsg = document.getElementById('successMessage');
const resetBtn = document.getElementById('resetFormBtn');
const captchaQuestion = document.getElementById('math-question');
const captchaInput = document.getElementById('captcha');
const captchaError = document.getElementById('captchaError');
const submitBtn = form.querySelector('button[type="submit"]');

let correctAnswer;

// Generate Random Math Problem
function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    correctAnswer = num1 + num2;
    captchaQuestion.textContent = `${num1} + ${num2}`;
    captchaInput.value = '';
    captchaError.style.display = 'none';
}

// Initial Generation
generateCaptcha();

// Ограничиваем ввод телефона только цифрами
const phoneInput = document.getElementById('phone');
phoneInput.addEventListener('input', () => {
    phoneInput.value = phoneInput.value.replace(/\D/g, ''); // Убираем всё кроме цифр
});

form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Validate Captcha
    if (parseInt(captchaInput.value) !== correctAnswer) {
        captchaError.style.display = 'block';
        captchaInput.focus();
        isValid = false;
    } else {
        captchaError.style.display = 'none';
    }

    // Validate phone
    if (!/^\d{6,15}$/.test(phoneInput.value)) { // минимум 6 цифр, максимум 15
        phoneInput.classList.add('error');
        phoneInput.focus();
        isValid = false;
    } else {
        phoneInput.classList.remove('error');
    }

    if (!isValid) return;

    // Simulate AJAX Request
    submitBtn.classList.add('loading');
    
    setTimeout(() => {
        submitBtn.classList.remove('loading');
        form.style.display = 'none';
        successMsg.style.display = 'block';
        
        // Reset form for next time
        form.reset();
        generateCaptcha(); // Новый капча
    }, 1500);
});

resetBtn.addEventListener('click', () => {
    successMsg.style.display = 'none';
    form.style.display = 'block';
    generateCaptcha(); // Новый math problem
});


/* ========================
   COOKIE POPUP LOGIC
   ======================== */
const cookiePopup = document.getElementById('cookiePopup');
const acceptBtn = document.getElementById('acceptCookie');

// Check localStorage
if (!localStorage.getItem('cookiesAccepted')) {
    setTimeout(() => {
        cookiePopup.classList.add('show');
    }, 2000); // Show after 2 seconds
}

acceptBtn.addEventListener('click', () => {
    localStorage.setItem('cookiesAccepted', 'true');
    cookiePopup.classList.remove('show');
});