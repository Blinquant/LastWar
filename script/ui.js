// script/ui.js - User interface management and interactions
export function initializeUI() {
    // Set current year in footer
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Initialize UI components
    initializeMobileNav();
    initializeSmoothScroll();
    initializeScrollAnimations();
    initializeScrollToTop();
    initializeNavHighlight();
}

/**
 * Mobile navigation toggle functionality
 */
function initializeMobileNav() {
    const navToggle = document.getElementById('nav-toggle');
    const navList = document.getElementById('nav-list');
    
    if (!navToggle || !navList) return;
    
    navToggle.addEventListener('click', function() {
        const expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', String(!expanded));
        navList.classList.toggle('show');
    });
    
    // Close nav when a link is clicked (mobile)
    navList.addEventListener('click', function(e) {
        if (e.target.tagName === 'A' && navList.classList.contains('show')) {
            navList.classList.remove('show');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

/**
 * Smooth scrolling for anchor links
 */
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerHeight = document.querySelector('.site-header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;

                window.scrollTo({
                    top: targetPosition - headerHeight - 20,
                    behavior: 'smooth'
                });

                // Update URL without page jump
                history.pushState(null, null, href);
            }
        });
    });
}

/**
 * Scroll animations for cards and elements
 */
function initializeScrollAnimations() {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    // Animate cards on scroll
    document.querySelectorAll('.tip-card, .resource-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.5s ease-out';
        revealObserver.observe(card);
    });
}

/**
 * Scroll to top button functionality
 */
function initializeScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '↑';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: linear-gradient(90deg, var(--accent), var(--accent-light));
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        transition: all 0.3s;
        z-index: 999;
        box-shadow: 0 4px 12px rgba(14, 165, 163, 0.3);
    `;
    document.body.appendChild(scrollBtn);

    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        scrollBtn.style.opacity = window.pageYOffset > 400 ? '1' : '0';
    });

    // Scroll to top when clicked
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Hover effects
    scrollBtn.addEventListener('mouseenter', () => {
        scrollBtn.style.transform = 'scale(1.1)';
        scrollBtn.style.boxShadow = '0 6px 20px rgba(14, 165, 163, 0.5)';
    });

    scrollBtn.addEventListener('mouseleave', () => {
        scrollBtn.style.transform = 'scale(1)';
        scrollBtn.style.boxShadow = '0 4px 12px rgba(14, 165, 163, 0.3)';
    });
}

/**
 * Navigation highlight based on scroll position
 */
function initializeNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-list a');

    window.addEventListener('scroll', () => {
        let currentSection = '';
        const headerHeight = document.querySelector('.site-header').offsetHeight;
        const offset = headerHeight + 50; // Additional offset for better visibility

        // Find current section in viewport
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - offset) {
                currentSection = section.getAttribute('id');
            }
        });

        // Update navigation links
        navLinks.forEach(link => {
            link.style.color = 'var(--muted)';
            link.style.background = 'transparent';
            const href = link.getAttribute('href').slice(1);
            if (href === currentSection) {
                link.style.color = '#fff';
                link.style.background = 'rgba(255, 255, 255, 0.03)';
            }
        });
    });
}