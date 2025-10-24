// Basic UI interactions and small enhancements.
// All text and comments are in English.

document.addEventListener('DOMContentLoaded', function () {
  // Year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const navToggle = document.getElementById('nav-toggle');
  const navList = document.getElementById('nav-list');
  if (navToggle && navList) {
    navToggle.addEventListener('click', function () {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      navList.classList.toggle('show');
    });

    // close nav when a link is clicked (mobile)
    navList.addEventListener('click', function (e) {
      if (e.target.tagName === 'A' && navList.classList.contains('show')) {
        navList.classList.remove('show');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Animated counters (small, runs once when visible)
  const counters = document.querySelectorAll('.num[data-count]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10) || 0;
        animateCount(el, target, 900);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.6 });
  counters.forEach(c => observer.observe(c));

  // Newsletter form (demo behavior)
  const newsletter = document.getElementById('newsletter');
  if (newsletter) {
    newsletter.addEventListener('submit', function (e) {
      e.preventDefault();
      const email = newsletter.querySelector('#email').value;
      // Minimal validation
      if (!email || !email.includes('@')) {
        alert('Please enter a valid email address.');
        return;
      }
      // Simulate subscription success (replace with real API call)
      newsletter.reset();
      alert('Thank you — subscription successful.');
    });
  }
});

/**
 * Animate numeric count from 0 to target.
 * @param {HTMLElement} el
 * @param {number} target
 * @param {number} duration in ms
 */
function animateCount(el, target, duration) {
  let start = 0;
  const stepTime = Math.max(Math.floor(duration / target), 16);
  const startTime = performance.now();

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.floor(progress * target);
    el.textContent = value;
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = target;
    }
  }
  requestAnimationFrame(step);
}
