// script/main.js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('🚀 Service Worker registered:', registration);
      })
      .catch(error => {
        console.log('❌ Service Worker registration failed:', error);
      });
  });
}



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