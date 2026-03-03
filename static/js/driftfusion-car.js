/**
 * DRIFTFUSION Car Module
 * Handles local vehicle state capture and remote player car rendering
 * Extracted from driftfusion-bridge.js
 */
(function() {
  'use strict';

  let remotePlayers = new Map();
  let localPlayerState = null;
  let localInputState = {};

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

  // Called by bridge once game canvas is ready
  window.dfCarInit = function() {
    captureLocalState();
    setupInputHooks();
    console.log('🚗 DRIFTFUSION Car module ready');
  };
})();
