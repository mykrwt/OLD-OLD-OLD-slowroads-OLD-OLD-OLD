/**
 * DRIFTFUSION Bridge
 * Hooks into original SlowRoads game state for P2P sync
 */
(function() {
  'use strict';

  let remotePlayers = new Map();
  let localPlayerState = null;

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
        captureLocalState();
        callback(timestamp);
      });
    };

    // Also hook into gamepad/keyboard input to capture vehicle state
    setupInputHooks();
  }

  function captureLocalState() {
    // Try to extract player state from the game
    // This is a simplified version - the actual game stores state differently
    
    // Look for global game state objects that SlowRoads creates
    const gameState = window.gameState || window.app || window.G;
    
    if (gameState) {
      localPlayerState = {
        position: gameState.player?.position || { x: 0, y: 0, z: 0 },
        rotation: gameState.player?.rotation || { x: 0, y: 0, z: 0 },
        velocity: gameState.player?.velocity || { x: 0, y: 0, z: 0 },
        timestamp: Date.now()
      };
    }
  }

  function setupInputHooks() {
    // Track key states for vehicle control sync
    const keys = {};
    
    document.addEventListener('keydown', (e) => {
      keys[e.code] = true;
      updateLocalInput(keys);
    });
    
    document.addEventListener('keyup', (e) => {
      keys[e.code] = false;
      updateLocalInput(keys);
    });
  }

  function updateLocalInput(keys) {
    // Store current input state
    localInputState = {
      throttle: keys['ArrowUp'] || keys['KeyW'] ? 1 : 0,
      brake: keys['ArrowDown'] || keys['KeyS'] || keys['Space'] ? 1 : 0,
      steerLeft: keys['ArrowLeft'] || keys['KeyA'] ? 1 : 0,
      steerRight: keys['ArrowRight'] || keys['KeyD'] ? 1 : 0,
      timestamp: Date.now()
    };
  }

  // Expose function for P2P to call
  window.dfGetGameState = function() {
    // Return combined state for broadcasting
    return {
      position: localPlayerState?.position || { x: 0, y: 0, z: 0 },
      rotation: localPlayerState?.rotation || { y: 0 },
      velocity: localPlayerState?.velocity || { x: 0, y: 0, z: 0 },
      input: localInputState || {},
      timestamp: Date.now()
    };
  };

  // Handle remote player state
  window.dfHandleRemoteState = function(peerId, state) {
    if (!remotePlayers.has(peerId)) {
      createRemotePlayer(peerId);
    }
    
    const player = remotePlayers.get(peerId);
    player.targetState = state;
    player.lastUpdate = Date.now();
  };

  function createRemotePlayer(peerId) {
    console.log('Creating remote player:', peerId);
    
    // Create a visual representation of remote player
    // This would add a ghost car to the scene
    remotePlayers.set(peerId, {
      targetState: null,
      currentState: null,
      lastUpdate: Date.now()
    });
    
    window.dfShowToast?.('Player joined!', 'success');
  }

  // Start hooking
  setTimeout(hookGameLoop, 2000); // Wait for game to initialize
})();
