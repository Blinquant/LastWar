// script/main.js - Main initialization script
import { initializeUI } from './ui.js';
import { initializeCounters } from './counters.js';
import { initializeArmsRace } from './arms-race.js';
import { initializeStrategies } from './strategies.js';

/**
 * Main initialization function - runs when DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeUI();
    initializeCounters();
    initializeArmsRace();
    initializeStrategies();
    
    console.log('Last War 743 - Initialized successfully');
});