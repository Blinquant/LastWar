// script/counters.js - Animated counters and statistics
export function initializeCounters() {
    /**
     * Calculate days since server start date (July 21, 2024)
     * @returns {number} Days since server start
     */
    function calculateDaysSinceStart() {
        const startDate = new Date('2024-07-20T00:00:00');
        const today = new Date();
        const timeDiff = today.getTime() - startDate.getTime();
        const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
        return Math.max(1, daysDiff); // Minimum 1 day
    }

    // Intersection Observer for counter animations
    const counters = document.querySelectorAll('.num[data-count]');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                let targetValue;

                // Special case for auto-calculated days counter
                if (element.getAttribute('data-count') === 'auto') {
                    targetValue = calculateDaysSinceStart();
                } else {
                    // Normal counters with fixed values
                    targetValue = parseInt(element.getAttribute('data-count'), 10) || 0;
                }

                animateCount(element, targetValue, 900);
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.6 });

    // Observe all counter elements
    counters.forEach(counter => observer.observe(counter));
}

/**
 * Animate numeric count from 0 to target value
 * @param {HTMLElement} element - DOM element to animate
 * @param {number} target - Target value to count to
 * @param {number} duration - Animation duration in milliseconds
 */
function animateCount(element, target, duration) {
    const startTime = performance.now();
    
    function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentValue = Math.floor(progress * target);
        element.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            element.textContent = target; // Ensure final value is exact
        }
    }
    
    requestAnimationFrame(step);
}