// script/strategies.js - Strategy tabs functionality and navigation
export function initializeStrategies() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const strategyContents = document.querySelectorAll('.strategy-content');

    /**
     * Switch to a specific strategy tab
     * @param {string} strategyId - ID of the strategy to activate
     */
    function switchTab(strategyId) {
        // Update tab buttons
        tabButtons.forEach(button => {
            const isActive = button.getAttribute('data-strategy') === strategyId;
            button.classList.toggle('active', isActive);
            button.setAttribute('aria-selected', String(isActive));
        });

        // Update content sections
        strategyContents.forEach(content => {
            content.classList.toggle('active', content.id === strategyId);
        });
    }

    /**
     * Initialize tab button event listeners
     */
    tabButtons.forEach(button => {
        // Click event for tab switching
        button.addEventListener('click', function() {
            const strategy = this.getAttribute('data-strategy');
            switchTab(strategy);
        });

        // Keyboard navigation for accessibility
        button.addEventListener('keydown', function(event) {
            // Enter or Space key
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                const strategy = this.getAttribute('data-strategy');
                switchTab(strategy);
            }

            // Arrow key navigation
            if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                event.preventDefault();
                const currentIndex = Array.from(tabButtons).indexOf(this);
                let nextIndex;

                if (event.key === 'ArrowRight') {
                    nextIndex = (currentIndex + 1) % tabButtons.length;
                } else {
                    nextIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
                }

                const nextStrategy = tabButtons[nextIndex].getAttribute('data-strategy');
                switchTab(nextStrategy);
                tabButtons[nextIndex].focus(); // Move focus to new tab
            }
        });
    });

    // Activate first tab by default
    if (tabButtons.length > 0) {
        const firstStrategy = tabButtons[0].getAttribute('data-strategy');
        switchTab(firstStrategy);
    }
}