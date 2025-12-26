// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navList = document.querySelector('.nav-list');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navList.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
        document.body.style.overflow = navList.classList.contains('active') ? 'hidden' : '';
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navList && navList.classList.contains('active')) {
        if (!navList.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            navList.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navList.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        // VAŽNO: Vrati mogućnost skrolovanja!
        document.body.style.overflow = '';
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        // Zatvori mobilni meni i vrati scroll
        if (navList) {
            navList.classList.remove('active');
        }
        if (mobileMenuToggle) {
            mobileMenuToggle.classList.remove('active');
        }
        document.body.style.overflow = '';
        document.body.style.overflowY = 'auto';
        document.documentElement.style.overflow = '';
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Header scroll effect
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.5)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
    }
    
    lastScroll = currentScroll;
});

// Active nav link highlighting
const sections = document.querySelectorAll('section[id]');

function highlightActiveSection() {
    const scrollY = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Check if we're at the bottom of the page
    const isAtBottom = scrollY + windowHeight >= documentHeight - 50;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 150;
        const sectionId = section.getAttribute('id');

        if (isAtBottom && sectionId === 'kontakt') {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#kontakt') {
                    link.classList.add('active');
                }
            });
        } else if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightActiveSection);
window.addEventListener('load', highlightActiveSection);

// Gallery image lightbox effect (simple implementation)
const galleryItems = document.querySelectorAll('.galerija-item');

galleryItems.forEach(item => {
    item.addEventListener('click', function() {
        const img = this.querySelector('img');
        if (img) {
            // Create lightbox
            const lightbox = document.createElement('div');
            lightbox.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                cursor: pointer;
            `;
            
            const lightboxImg = document.createElement('img');
            lightboxImg.src = img.src;
            lightboxImg.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                object-fit: contain;
            `;
            
            lightbox.appendChild(lightboxImg);
            document.body.appendChild(lightbox);
            
            // Close on click
            lightbox.addEventListener('click', () => {
                document.body.removeChild(lightbox);
            });
            
            // Close on ESC key
            const closeLightbox = (e) => {
                if (e.key === 'Escape') {
                    if (document.body.contains(lightbox)) {
                        document.body.removeChild(lightbox);
                    }
                    document.removeEventListener('keydown', closeLightbox);
                }
            };
            document.addEventListener('keydown', closeLightbox);
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and items
document.querySelectorAll('.usluga-card, .cenovnik-card, .galerija-item, .kontakt-item, .oprema-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Phone number click handler
const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
phoneLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        // Allow default behavior (call on mobile)
    });
});

// Email click handler
const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
emailLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        // Allow default behavior
    });
});

// Form validation if contact form is added later
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = 'red';
        } else {
            input.style.borderColor = '';
        }
    });
    
    return isValid;
}

// Create circular favicon
function createCircularFavicon() {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        
        // Create circular clipping path
        ctx.beginPath();
        ctx.arc(16, 16, 16, 0, Math.PI * 2);
        ctx.clip();
        
        // Draw image
        ctx.drawImage(img, 0, 0, 32, 32);
        
        // Update favicon
        const favicon = document.getElementById('favicon');
        if (favicon) {
            favicon.href = canvas.toDataURL('image/png');
        }
    };
    img.src = 'images/logo.jpg';
}

// Create circular favicon on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createCircularFavicon);
} else {
    createCircularFavicon();
}

// Console message
console.log('%cBatić - Dubinsko Pranje', 'color: #FFD700; font-size: 20px; font-weight: bold;');
console.log('%cProfesionalno dubinsko pranje tepiha i nameštaja u Novom Sadu i Titlu', 'color: #333; font-size: 12px;');

