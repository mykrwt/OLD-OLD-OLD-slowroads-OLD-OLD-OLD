/**
 * DRIFTFUSION Bridge
 * Hooks into original SlowRoads game loop and coordinates car + P2P modules
 */
(function() {
  'use strict';

  // Hook into game loop to capture local state
  function hookGameLoop() {
    // Try to find the game's render loop
    const canvas = document.querySelector('canvas');
    if (!canvas) {
      setTimeout(hookGameLoop, 100);
      return;
    }

    console.log('🔌 DRIFTFUSION Bridge connecting...');

    // Create observer for game state
    const originalRAF = window.requestAnimationFrame;
    window.requestAnimationFrame = function(callback) {
      return originalRAF.call(window, function(timestamp) {
        // Delegate per-frame state capture to car module
        window.dfGetGameState?.();
        callback(timestamp);
      });
    };

    // Delegate vehicle input tracking and car init to car module
    window.dfCarInit?.();
  }

  // Start hooking
  setTimeout(hookGameLoop, 2000); // Wait for game to initialize
})();
