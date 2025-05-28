// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const body = document.body;

console.log('Hamburger:', hamburger);
console.log('Nav Links:', navLinks);

// Debounce function to limit event firing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Toggle mobile menu
hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    requestAnimationFrame(() => {
        navLinks.classList.toggle('nav-active');
        body.style.overflow = navLinks.classList.contains('nav-active') ? 'hidden' : '';
    });
});

// Close menu when clicking outside
document.addEventListener('click', debounce((e) => {
    if (navLinks.classList.contains('nav-active') && 
        !hamburger.contains(e.target) && 
        !navLinks.contains(e.target)) {
        requestAnimationFrame(() => {
            navLinks.classList.remove('nav-active');
            body.style.overflow = '';
        });
    }
}, 100));

// Close menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        requestAnimationFrame(() => {
            navLinks.classList.remove('nav-active');
            body.style.overflow = '';
        });
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Form Submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    // Set the form action to FormSubmit endpoint
    contactForm.setAttribute('action', 'https://formsubmit.co/f44f0dfeb4f0df584e71c89aa8e37e45');
    contactForm.setAttribute('method', 'POST');
    
    // Add honeypot to prevent spam
    const honeypot = document.createElement('input');
    honeypot.type = 'text';
    honeypot.name = '_honey';
    honeypot.style.display = 'none';
    contactForm.appendChild(honeypot);
    
    // Disable captcha
    const captcha = document.createElement('input');
    captcha.type = 'hidden';
    captcha.name = '_captcha';
    captcha.value = 'false';
    contactForm.appendChild(captcha);
    
    // Add thank you page redirect
    const redirect = document.createElement('input');
    redirect.type = 'hidden';
    redirect.name = '_next';
    redirect.value = window.location.href;
    contactForm.appendChild(redirect);

    // Add subject line
    const subject = document.createElement('input');
    subject.type = 'hidden';
    subject.name = '_subject';
    subject.value = 'New Contact Form Submission';
    contactForm.appendChild(subject);

    // Add template
    const template = document.createElement('input');
    template.type = 'hidden';
    template.name = '_template';
    template.value = 'table';
    contactForm.appendChild(template);
    
    contactForm.addEventListener('submit', function(e) {
        // Add logging to debug form submission
        console.log('Form submitted');
        console.log('Form action:', this.action);
        console.log('Form method:', this.method);
        
        // Log form data
        const formData = new FormData(this);
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }
    });
}

// Scroll Animation
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Navbar scroll effect with debounce
window.addEventListener('scroll', debounce(() => {
    requestAnimationFrame(() => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}, 100), { passive: true }); 