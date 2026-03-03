/**
 * DRIFTFUSION UI Overlay
 * Modern glassmorphism interface on top of original SlowRoads
 */
(function() {
  'use strict';

  // SVG Icons
  const Icons = {
    x: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    users: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    check: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    copy: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`
  };

  // Wait for original game to load
  function init() {
    if (!document.querySelector('canvas')) {
      setTimeout(init, 100);
      return;
    }
    console.log('DRIFTFUSION UI initializing...');
    createStyles();
    createUI();
    setupEventListeners();
  }

  function createStyles() {
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --cyan: #00f0ff;
        --magenta: #ff00aa;
        --purple: #1a0a2e;
        --dark: #0d1117;
        --glass: rgba(13, 17, 23, 0.85);
      }
      
      @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600;700&display=swap');
      
      .df-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 9999;
        font-family: 'Rajdhani', sans-serif;
      }
      
      .df-overlay > * {
        pointer-events: auto;
      }
      
      /* Connection Status */
      .df-connection {
        position: absolute;
        top: 20px;
        right: 20px;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        background: var(--glass);
        border: 1px solid var(--cyan);
        border-radius: 4px;
        color: #fff;
        font-size: 14px;
        backdrop-filter: blur(10px);
        transition: all 0.3s;
      }
      
      .df-status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #333;
      }
      
      .df-status-dot.connected { background: #0f0; box-shadow: 0 0 10px #0f0; }
      .df-status-dot.connecting { background: #ff0; animation: pulse 1s infinite; }
      .df-status-dot.error { background: #f00; }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      
      /* Multiplayer Panel */
      .df-mp-panel {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%) translateX(100%);
        width: 360px;
        background: var(--glass);
        border-left: 2px solid var(--cyan);
        padding: 24px;
        backdrop-filter: blur(20px);
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        max-height: 80vh;
        overflow-y: auto;
      }
      
      .df-mp-panel.open {
        transform: translateY(-50%) translateX(0);
      }
      
      .df-mp-header {
        font-family: 'Orbitron', sans-serif;
        font-size: 18px;
        color: var(--cyan);
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .df-close-btn {
        background: none;
        border: none;
        color: #fff;
        font-size: 24px;
        cursor: pointer;
        opacity: 0.6;
      }
      
      .df-close-btn:hover { opacity: 1; }
      
      .df-section {
        margin-bottom: 20px;
      }
      
      .df-label {
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: rgba(255, 255, 255, 0.6);
        margin-bottom: 8px;
      }
      
      .df-textarea {
        width: 100%;
        min-height: 80px;
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(0, 240, 255, 0.3);
        color: var(--cyan);
        font-family: monospace;
        font-size: 11px;
        padding: 12px;
        resize: vertical;
        border-radius: 4px;
        box-sizing: border-box;
      }
      
      .df-textarea:focus {
        outline: none;
        border-color: var(--cyan);
        box-shadow: 0 0 10px rgba(0, 240, 255, 0.2);
      }
      
      .df-btn-row {
        display: flex;
        gap: 8px;
        margin-top: 8px;
      }
      
      .df-btn {
        flex: 1;
        padding: 10px;
        background: rgba(0, 240, 255, 0.1);
        border: 1px solid var(--cyan);
        color: var(--cyan);
        font-family: 'Orbitron', sans-serif;
        font-size: 11px;
        text-transform: uppercase;
        cursor: pointer;
        transition: all 0.2s;
        border-radius: 4px;
      }
      
      .df-btn:hover {
        background: var(--cyan);
        color: var(--dark);
      }
      
      .df-btn.secondary {
        border-color: var(--magenta);
        color: var(--magenta);
        background: rgba(255, 0, 170, 0.1);
      }
      
      .df-btn.secondary:hover {
        background: var(--magenta);
        color: #fff;
      }
      
      .df-btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
      
      /* Toggle Button */
      .df-toggle-btn {
        position: absolute;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--glass);
        border: 2px solid var(--cyan);
        color: var(--cyan);
        font-size: 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(10px);
        transition: all 0.3s;
      }
      
      .df-toggle-btn:hover {
        background: var(--cyan);
        color: var(--dark);
        transform: scale(1.1);
        box-shadow: 0 0 20px rgba(0, 240, 255, 0.5);
      }
      
      /* Toast Notifications */
      .df-toasts {
        position: absolute;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        gap: 8px;
        pointer-events: none;
      }
      
      .df-toast {
        padding: 12px 24px;
        background: var(--glass);
        border: 1px solid var(--cyan);
        border-radius: 4px;
        color: #fff;
        font-size: 14px;
        animation: slideDown 0.3s ease, fadeOut 0.3s ease 2.7s;
        backdrop-filter: blur(10px);
        box-shadow: 0 0 20px rgba(0, 240, 255, 0.3);
      }
      
      .df-toast.error {
        border-color: #f00;
        box-shadow: 0 0 20px rgba(255, 0, 0, 0.3);
      }
      
      .df-toast.success {
        border-color: #0f0;
        box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
      }
      
      @keyframes slideDown {
        from { transform: translateY(-100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      
      @keyframes fadeOut {
        to { opacity: 0; }
      }
      
      /* Player List */
      .df-players {
        margin-top: 16px;
      }
      
      .df-player-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(0, 240, 255, 0.2);
        border-radius: 4px;
        margin-bottom: 8px;
      }
      
      .df-player-name {
        font-weight: 600;
        color: #fff;
      }
      
      .df-player-ping {
        font-size: 12px;
        color: var(--cyan);
      }
      
      /* Key hint for MP */
      .df-key-hint {
        position: absolute;
        bottom: 80px;
        right: 20px;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.5);
        text-align: right;
      }
      
      .df-key-hint kbd {
        background: rgba(255, 255, 255, 0.2);
        padding: 2px 6px;
        border-radius: 3px;
        font-family: monospace;
      }
    `;
    document.head.appendChild(style);
  }

  function createUI() {
    const overlay = document.createElement('div');
    overlay.className = 'df-overlay';
    overlay.id = 'df-overlay';
    
    overlay.innerHTML = `
      <!-- Connection Status -->
      <div class="df-connection" id="df-connection" style="display: none;">
        <div class="df-status-dot" id="df-status-dot"></div>
        <span id="df-status-text">Offline</span>
      </div>
      
      <!-- Key Hint -->
      <div class="df-key-hint">
        Press <kbd>M</kbd> for Multiplayer
      </div>
      
      <!-- Multiplayer Panel -->
      <div class="df-mp-panel" id="df-mp-panel">
        <div class="df-mp-header">
          <span>P2P MULTIPLAYER</span>
          <button class="df-close-btn" onclick="dfTogglePanel()">${Icons.x}</button>
        </div>
        
        <div class="df-section">
          <div class="df-label">Your Connection Code</div>
          <textarea class="df-textarea" id="df-local-sdp" readonly placeholder="Click Host to generate..."></textarea>
          <div class="df-btn-row">
            <button class="df-btn" onclick="dfHost()">Host Game</button>
            <button class="df-btn" onclick="dfCopyCode()">Copy</button>
          </div>
        </div>
        
        <div class="df-section">
          <div class="df-label">Friend's Code</div>
          <textarea class="df-textarea" id="df-remote-sdp" placeholder="Paste friend's code here..."></textarea>
          <div class="df-btn-row">
            <button class="df-btn secondary" onclick="dfJoin()">Connect</button>
            <button class="df-btn secondary" onclick="dfDisconnect()">Disconnect</button>
          </div>
        </div>
        
        <div class="df-section">
          <div class="df-label">Connected Players</div>
          <div class="df-players" id="df-players">
            <div class="df-player-item">
              <span class="df-player-name">No players connected</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Toggle Button -->
      <button class="df-toggle-btn" onclick="dfTogglePanel()" title="Multiplayer">${Icons.users}</button>
      
      <!-- Toasts -->
      <div class="df-toasts" id="df-toasts"></div>
    `;
    
    document.body.appendChild(overlay);
  }

  function setupEventListeners() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'm' || e.key === 'M') {
        dfTogglePanel();
      }
    });
  }

  // Global functions for UI
  window.dfTogglePanel = function() {
    const panel = document.getElementById('df-mp-panel');
    panel.classList.toggle('open');
  };

  window.dfShowToast = function(message, type = 'info') {
    const toasts = document.getElementById('df-toasts');
    const toast = document.createElement('div');
    toast.className = `df-toast ${type}`;
    toast.textContent = message;
    toasts.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  window.dfUpdateStatus = function(state, peerCount = 0) {
    const conn = document.getElementById('df-connection');
    const dot = document.getElementById('df-status-dot');
    const text = document.getElementById('df-status-text');
    
    if (state === 'initialized') {
      conn.style.display = 'none';
      return;
    }
    
    conn.style.display = 'flex';
    dot.className = 'df-status-dot';
    
    switch (state) {
      case 'connected':
        dot.classList.add('connected');
        text.textContent = `${peerCount} Player${peerCount !== 1 ? 's' : ''}`;
        break;
      case 'connecting':
      case 'hosting':
        dot.classList.add('connecting');
        text.textContent = 'Connecting...';
        break;
      default:
        text.textContent = 'Offline';
    }
  };

  window.dfUpdatePlayers = function(peers) {
    const container = document.getElementById('df-players');
    
    if (!peers || peers.length === 0) {
      container.innerHTML = `
        <div class="df-player-item">
          <span class="df-player-name">No players connected</span>
        </div>
      `;
      return;
    }
    
    container.innerHTML = peers.map(p => `
      <div class="df-player-item">
        <span class="df-player-name">${p.id}</span>
        <span class="df-player-ping">${p.latency ? p.latency + 'ms' : '...'}</span>
      </div>
    `).join('');
  };

  window.dfSetLocalSDP = function(sdp) {
    const textarea = document.getElementById('df-local-sdp');
    if (textarea) textarea.value = sdp;
  };

  // These will be overridden by p2p-network.js
  window.dfHost = function() { dfShowToast('P2P not loaded yet', 'error'); };
  window.dfJoin = function() { dfShowToast('P2P not loaded yet', 'error'); };
  window.dfDisconnect = function() { dfShowToast('P2P not loaded yet', 'error'); };
  window.dfCopyCode = function() {
    const sdp = document.getElementById('df-local-sdp')?.value;
    if (!sdp) {
      dfShowToast('No code to copy', 'error');
      return;
    }
    navigator.clipboard.writeText(sdp).then(() => {
      dfShowToast('Code copied!');
    }).catch(() => {
      dfShowToast('Failed to copy', 'error');
    });
  };

  // Start
  init();
})();
