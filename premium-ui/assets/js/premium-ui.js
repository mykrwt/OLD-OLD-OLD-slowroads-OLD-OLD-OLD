/**
 * SLOW ROADS PREMIUM UI
 * Advanced overlay system with car/road customization and multiplayer
 * Version: 2.0.0
 */

(function() {
  'use strict';

  // ==========================================
  // CONFIGURATION
  // ==========================================
  const CONFIG = {
    version: '2.0.0',
    debug: false,
    animations: true,
    syncRate: 20, // Hz
    maxPeers: 8
  };

  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const State = {
    ui: {
      sidebarOpen: false,
      activeTab: 'customization',
      toastQueue: []
    },
    car: {
      color: '#ff0000',
      texture: 'default',
      neonEnabled: false,
      neonColor: '#00f0ff'
    },
    road: {
      texture: 'asphalt',
      theme: 'default'
    },
    multiplayer: {
      connected: false,
      peers: [],
      isHost: false,
      localCode: null
    }
  };

  // ==========================================
  // CAR COLOR PRESETS
  // ==========================================
  const CAR_COLORS = [
    { name: 'Rosso Corsa', hex: '#ff0000', type: 'solid' },
    { name: 'Midnight Blue', hex: '#001f3f', type: 'solid' },
    { name: 'Gunmetal', hex: '#2c3e50', type: 'metallic' },
    { name: 'Pearl White', hex: '#f5f5f0', type: 'pearl' },
    { name: 'Liquid Gold', hex: '#ffd700', type: 'metallic' },
    { name: 'Cyber Pink', hex: '#ff00aa', type: 'neon' },
    { name: 'Electric Cyan', hex: '#00f0ff', type: 'neon' },
    { name: 'Purple Haze', hex: '#8b5cf6', type: 'metallic' },
    { name: 'Sunset Orange', hex: '#ff6b35', type: 'solid' },
    { name: 'Forest Green', hex: '#228b22', type: 'solid' },
    { name: 'Midnight Black', hex: '#0a0a0a', type: 'metallic' },
    { name: 'Chrome Silver', hex: '#c0c0c0', type: 'chrome' }
  ];

  // ==========================================
  // ROAD TEXTURE PRESETS
  // ==========================================
  const ROAD_PRESETS = [
    {
      id: 'asphalt',
      name: 'Midnight Asphalt',
      desc: 'Classic dark road',
      color: '#2a2a2a',
      roughness: 0.9,
      metalness: 0.1
    },
    {
      id: 'carbon',
      name: 'Carbon Fiber',
      desc: 'Racing weave pattern',
      color: '#1a1a1a',
      roughness: 0.7,
      metalness: 0.3,
      pattern: 'carbon'
    },
    {
      id: 'neon',
      name: 'Neon Grid',
      desc: 'Cyberpunk aesthetic',
      color: '#0a0a1a',
      roughness: 0.5,
      metalness: 0.5,
      emissive: '#00f0ff',
      emissiveIntensity: 0.2
    },
    {
      id: 'mars',
      name: 'Red Planet',
      desc: 'Martian surface',
      color: '#8b4513',
      roughness: 1.0,
      metalness: 0.0
    },
    {
      id: 'ice',
      name: 'Arctic Ice',
      desc: 'Frozen tundra',
      color: '#e0f7fa',
      roughness: 0.2,
      metalness: 0.1
    },
    {
      id: 'gold',
      name: 'Golden Highway',
      desc: 'Luxury gold finish',
      color: '#ffd700',
      roughness: 0.3,
      metalness: 0.8
    }
  ];

  // ==========================================
  // UTILITY FUNCTIONS
  // ==========================================
  const Utils = {
    log: (...args) => CONFIG.debug && console.log('[PREMIUM]', ...args),
    
    generateId: () => Math.random().toString(36).substring(2, 10).toUpperCase(),
    
    throttle: (fn, limit) => {
      let inThrottle;
      return function(...args) {
        if (!inThrottle) {
          fn.apply(this, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    },
    
    debounce: (fn, delay) => {
      let timeout;
      return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), delay);
      };
    },
    
    hexToRgb: (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    },
    
    lerp: (start, end, t) => start + (end - start) * t
  };

  // ==========================================
  // TOAST NOTIFICATION SYSTEM
  // ==========================================
  const Toast = {
    container: null,
    
    init() {
      this.container = document.createElement('div');
      this.container.className = 'premium-toasts';
      document.body.appendChild(this.container);
    },
    
    show(message, type = 'info', duration = 3000) {
      if (!this.container) this.init();
      
      const toast = document.createElement('div');
      toast.className = `premium-toast ${type}`;
      
      const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
      };
      
      toast.innerHTML = `
        <span>${icons[type] || icons.info}</span>
        <span>${message}</span>
      `;
      
      this.container.appendChild(toast);
      
      setTimeout(() => {
        toast.remove();
      }, duration);
    }
  };

  // ==========================================
  // CAR CUSTOMIZATION MODULE
  // ==========================================
  const CarModule = {
    currentColor: CAR_COLORS[0].hex,
    currentTexture: 'default',
    
    init() {
      this.createColorPicker();
      this.setupHooks();
      Utils.log('Car module initialized');
    },
    
    createColorPicker() {
      const container = document.getElementById('premium-car-colors');
      if (!container) return;
      
      container.innerHTML = CAR_COLORS.map(color => `
        <div class="premium-color-option ${color.hex === this.currentColor ? 'selected' : ''}"
             style="background-color: ${color.hex}"
             data-color="${color.hex}"
             data-name="${color.name}"
             title="${color.name}">
        </div>
      `).join('');
      
      container.addEventListener('click', (e) => {
        const option = e.target.closest('.premium-color-option');
        if (option) {
          const color = option.dataset.color;
          const name = option.dataset.name;
          this.setCarColor(color, name);
          
          // Update selection UI
          container.querySelectorAll('.premium-color-option').forEach(opt => {
            opt.classList.remove('selected');
          });
          option.classList.add('selected');
        }
      });
    },
    
    setCarColor(color, name) {
      this.currentColor = color;
      State.car.color = color;
      
      // Apply to game if possible
      this.applyCarColor(color);
      
      Toast.show(`Car color: ${name || 'Custom'}`, 'success');
      
      // Broadcast to peers if multiplayer
      if (State.multiplayer.connected) {
        P2PModule.broadcast({
          type: 'carUpdate',
          color: color,
          from: State.multiplayer.localCode
        });
      }
    },
    
    applyCarColor(color) {
      // Try to find and modify car mesh in the game
      const canvas = document.querySelector('canvas');
      if (!canvas) return;
      
      // Method 1: Try to access Three.js scene directly
      try {
        const game = window.game || window.app || window.G;
        if (game && game.scene) {
          game.scene.traverse((obj) => {
            if (obj.isMesh && obj.name && obj.name.toLowerCase().includes('car')) {
              if (obj.material) {
                if (Array.isArray(obj.material)) {
                  obj.material.forEach(mat => {
                    if (mat.color) mat.color.set(color);
                  });
                } else if (obj.material.color) {
                  obj.material.color.set(color);
                }
              }
            }
          });
        }
      } catch (e) {
        Utils.log('Could not apply car color via scene traversal', e);
      }
      
      // Method 2: Store for bridge module
      window.premiumCarColor = color;
      
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('premium:carColorChange', { 
        detail: { color } 
      }));
    },
    
    setupHooks() {
      // Hook into game initialization
      const checkGame = setInterval(() => {
        const canvas = document.querySelector('canvas');
        if (canvas) {
          clearInterval(checkGame);
          Utils.log('Game canvas detected, applying car hooks');
          this.applyCarColor(this.currentColor);
        }
      }, 1000);
    }
  };

  // ==========================================
  // ROAD CUSTOMIZATION MODULE
  // ==========================================
  const RoadModule = {
    currentPreset: ROAD_PRESETS[0],
    
    init() {
      this.createPresetGrid();
      Utils.log('Road module initialized');
    },
    
    createPresetGrid() {
      const container = document.getElementById('premium-road-presets');
      if (!container) return;
      
      container.innerHTML = ROAD_PRESETS.map(preset => `
        <div class="premium-road-preset ${preset.id === this.currentPreset.id ? 'active' : ''}"
             data-preset="${preset.id}">
          <div class="premium-road-preview ${preset.id}"></div>
          <div class="premium-road-name">${preset.name}</div>
          <div class="premium-road-desc">${preset.desc}</div>
        </div>
      `).join('');
      
      container.addEventListener('click', (e) => {
        const preset = e.target.closest('.premium-road-preset');
        if (preset) {
          const presetId = preset.dataset.preset;
          this.setRoadPreset(presetId);
          
          container.querySelectorAll('.premium-road-preset').forEach(p => {
            p.classList.remove('active');
          });
          preset.classList.add('active');
        }
      });
    },
    
    setRoadPreset(presetId) {
      const preset = ROAD_PRESETS.find(p => p.id === presetId);
      if (!preset) return;
      
      this.currentPreset = preset;
      State.road.texture = preset.id;
      
      this.applyRoadTexture(preset);
      Toast.show(`Road: ${preset.name}`, 'success');
    },
    
    applyRoadTexture(preset) {
      // Store for game bridge
      window.premiumRoadTexture = preset;
      
      // Dispatch event
      window.dispatchEvent(new CustomEvent('premium:roadTextureChange', { 
        detail: { preset } 
      }));
      
      // Try to modify game materials
      try {
        const game = window.game || window.app || window.G;
        if (game && game.scene) {
          game.scene.traverse((obj) => {
            if (obj.isMesh && obj.name && 
                (obj.name.toLowerCase().includes('road') || 
                 obj.name.toLowerCase().includes('ground'))) {
              if (obj.material) {
                const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
                materials.forEach(mat => {
                  mat.color.set(preset.color);
                  if (mat.roughness !== undefined) mat.roughness = preset.roughness;
                  if (mat.metalness !== undefined) mat.metalness = preset.metalness;
                  if (preset.emissive && mat.emissive) {
                    mat.emissive.set(preset.emissive);
                    mat.emissiveIntensity = preset.emissiveIntensity || 0;
                  }
                });
              }
            }
          });
        }
      } catch (e) {
        Utils.log('Could not apply road texture', e);
      }
    }
  };

  // ==========================================
  // P2P MULTIPLAYER MODULE
  // ==========================================
  const P2PModule = {
    network: null,
    peers: new Map(),
    
    init() {
      this.setupUI();
      Utils.log('P2P module initialized');
    },
    
    setupUI() {
      // Host button
      const hostBtn = document.getElementById('premium-host-btn');
      if (hostBtn) {
        hostBtn.addEventListener('click', () => this.hostGame());
      }
      
      // Join button
      const joinBtn = document.getElementById('premium-join-btn');
      if (joinBtn) {
        joinBtn.addEventListener('click', () => this.joinGame());
      }
      
      // Disconnect button
      const disconnectBtn = document.getElementById('premium-disconnect-btn');
      if (disconnectBtn) {
        disconnectBtn.addEventListener('click', () => this.disconnect());
      }
      
      // Copy button
      const copyBtn = document.getElementById('premium-copy-btn');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => this.copyCode());
      }
    },
    
    async hostGame() {
      try {
        Toast.show('Creating game session...', 'info');
        
        // Generate connection code
        const code = this.generateConnectionCode();
        State.multiplayer.localCode = code;
        State.multiplayer.isHost = true;
        
        // Update UI
        const codeBox = document.getElementById('premium-local-code');
        if (codeBox) {
          codeBox.textContent = code;
          codeBox.classList.remove('empty');
        }
        
        this.updateConnectionStatus('hosting');
        Toast.show('Game session created! Share your code.', 'success');
        
      } catch (err) {
        Utils.log('Host error:', err);
        Toast.show('Failed to create game', 'error');
      }
    },
    
    async joinGame() {
      const codeInput = document.getElementById('premium-remote-code');
      const code = codeInput?.value?.trim();
      
      if (!code) {
        Toast.show('Please enter a connection code', 'warning');
        return;
      }
      
      try {
        Toast.show('Connecting...', 'info');
        State.multiplayer.isHost = false;
        
        // Simulate connection (actual WebRTC would go here)
        setTimeout(() => {
          this.updateConnectionStatus('connected');
          this.addPlayer('Player-' + Utils.generateId().slice(0, 4));
          Toast.show('Connected to game!', 'success');
        }, 1500);
        
      } catch (err) {
        Utils.log('Join error:', err);
        Toast.show('Failed to connect', 'error');
      }
    },
    
    disconnect() {
      State.multiplayer.connected = false;
      State.multiplayer.peers = [];
      
      this.updateConnectionStatus('offline');
      this.updatePlayerList();
      
      const codeBox = document.getElementById('premium-local-code');
      if (codeBox) {
        codeBox.textContent = 'Click "Host Game" to generate...';
        codeBox.classList.add('empty');
      }
      
      Toast.show('Disconnected from game', 'info');
    },
    
    generateConnectionCode() {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let code = 'SR-';
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    },
    
    copyCode() {
      const code = document.getElementById('premium-local-code')?.textContent;
      if (!code || code.includes('Click')) {
        Toast.show('No code to copy', 'warning');
        return;
      }
      
      navigator.clipboard.writeText(code).then(() => {
        Toast.show('Code copied to clipboard!', 'success');
      }).catch(() => {
        Toast.show('Failed to copy code', 'error');
      });
    },
    
    updateConnectionStatus(status) {
      const dot = document.getElementById('premium-status-dot');
      const text = document.getElementById('premium-status-text');
      const playerCount = document.getElementById('premium-player-count');
      
      if (dot) {
        dot.className = 'premium-status-dot ' + status;
      }
      
      if (text) {
        const labels = {
          offline: 'Offline',
          hosting: 'Hosting...',
          connecting: 'Connecting...',
          connected: 'Online'
        };
        text.textContent = labels[status] || status;
      }
      
      if (playerCount) {
        playerCount.classList.toggle('active', status === 'connected');
      }
      
      State.multiplayer.connected = (status === 'connected');
    },
    
    addPlayer(id) {
      State.multiplayer.peers.push({
        id,
        joinedAt: Date.now(),
        ping: Math.floor(Math.random() * 50) + 20
      });
      this.updatePlayerList();
    },
    
    removePlayer(id) {
      State.multiplayer.peers = State.multiplayer.peers.filter(p => p.id !== id);
      this.updatePlayerList();
    },
    
    updatePlayerList() {
      const container = document.getElementById('premium-player-list');
      if (!container) return;
      
      if (State.multiplayer.peers.length === 0) {
        container.innerHTML = `
          <div class="premium-player-item">
            <div class="premium-player-info">
              <div class="premium-player-name" style="color: var(--text-muted)">No players connected</div>
            </div>
          </div>
        `;
        return;
      }
      
      container.innerHTML = State.multiplayer.peers.map(peer => `
        <div class="premium-player-item">
          <div class="premium-player-avatar">${peer.id.charAt(0)}</div>
          <div class="premium-player-info">
            <div class="premium-player-name">${peer.id}</div>
            <div class="premium-player-status">Connected</div>
          </div>
          <div class="premium-player-ping">${peer.ping}ms</div>
        </div>
      `).join('');
      
      // Update player count badge
      const countBadge = document.getElementById('premium-player-count');
      if (countBadge) {
        countBadge.innerHTML = `👥 ${State.multiplayer.peers.length + 1}`;
      }
    },
    
    broadcast(data) {
      // Broadcast to all connected peers
      Utils.log('Broadcasting:', data);
    }
  };

  // ==========================================
  // UI CONTROLLER
  // ==========================================
  const UIController = {
    sidebar: null,
    
    init() {
      this.createOverlay();
      this.setupEventListeners();
      Toast.init();
      Utils.log('UI Controller initialized');
    },
    
    createOverlay() {
      const overlay = document.createElement('div');
      overlay.className = 'premium-overlay';
      overlay.id = 'premium-overlay';
      
      overlay.innerHTML = `
        <!-- HUD Elements -->
        <div class="premium-hud">
          <!-- Top Bar -->
          <div class="premium-topbar">
            <div class="premium-logo">
              <div class="premium-logo-icon">SR</div>
              <div>
                <div class="premium-logo-text">SLOW ROADS</div>
                <span class="premium-logo-badge">PREMIUM</span>
              </div>
            </div>
            
            <div style="display: flex; gap: 12px;">
              <div class="premium-connection">
                <div class="premium-status-dot offline" id="premium-status-dot"></div>
                <span class="premium-status-text" id="premium-status-text">Offline</span>
              </div>
              
              <div class="premium-player-count" id="premium-player-count">
                👥 1
              </div>
            </div>
          </div>
          
          <!-- Speedometer -->
          <div class="premium-speedometer">
            <div class="premium-speed-ring">
              <div class="premium-speed-inner">
                <div class="premium-speed-value" id="premium-speed">0</div>
                <div class="premium-speed-unit">KM/H</div>
              </div>
            </div>
          </div>
          
          <!-- Mini Stats -->
          <div class="premium-ministats">
            <div class="premium-stat-item">
              <div class="premium-stat-icon">📍</div>
              <div class="premium-stat-info">
                <div class="premium-stat-label">Distance</div>
                <div class="premium-stat-value" id="premium-distance">0.0</div>
              </div>
            </div>
            <div class="premium-stat-item">
              <div class="premium-stat-icon">⏱️</div>
              <div class="premium-stat-info">
                <div class="premium-stat-label">Time</div>
                <div class="premium-stat-value" id="premium-time">00:00</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Control Buttons -->
        <div class="premium-controls">
          <button class="premium-control-btn" id="premium-btn-settings" title="Settings">⚙️</button>
          <button class="premium-control-btn" id="premium-btn-multiplayer" title="Multiplayer">👥</button>
          <button class="premium-control-btn" id="premium-btn-customize" title="Customize">🎨</button>
          <button class="premium-control-btn" id="premium-btn-menu" title="Menu">☰</button>
        </div>
        
        <!-- Sidebar -->
        <div class="premium-sidebar" id="premium-sidebar">
          <div class="premium-sidebar-header">
            <div class="premium-sidebar-title">CUSTOMIZATION</div>
            <button class="premium-sidebar-close" id="premium-sidebar-close">×</button>
          </div>
          
          <div class="premium-sidebar-content">
            <!-- Tabs -->
            <div class="premium-tabs">
              <button class="premium-tab active" data-tab="customization">Car & Road</button>
              <button class="premium-tab" data-tab="multiplayer">Multiplayer</button>
              <button class="premium-tab" data-tab="settings">Settings</button>
            </div>
            
            <!-- Tab: Customization -->
            <div class="premium-tab-content active" id="tab-customization">
              <div class="premium-section">
                <div class="premium-section-title">Car Color</div>
                <div class="premium-card">
                  <div class="premium-color-picker" id="premium-car-colors"></div>
                </div>
              </div>
              
              <div class="premium-section">
                <div class="premium-section-title">Road Texture</div>
                <div class="premium-road-presets" id="premium-road-presets"></div>
              </div>
              
              <div class="premium-section">
                <div class="premium-section-title">Neon Underglow</div>
                <div class="premium-card">
                  <div class="premium-toggle">
                    <span class="premium-toggle-label">Enable Neon Lights</span>
                    <div class="premium-toggle-switch" id="premium-neon-toggle">
                      <div class="premium-toggle-thumb"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Tab: Multiplayer -->
            <div class="premium-tab-content" id="tab-multiplayer">
              <div class="premium-section">
                <div class="premium-section-title">Your Game Code</div>
                <div class="premium-code-box empty" id="premium-local-code">
                  Click "Host Game" to generate...
                </div>
                <div class="premium-code-actions">
                  <button class="premium-btn premium-btn-primary" id="premium-host-btn">Host Game</button>
                  <button class="premium-btn premium-btn-secondary" id="premium-copy-btn">Copy</button>
                </div>
              </div>
              
              <div class="premium-section">
                <div class="premium-section-title">Join Game</div>
                <div class="premium-card">
                  <input type="text" 
                         class="premium-code-box" 
                         id="premium-remote-code"
                         placeholder="Enter connection code (e.g., SR-ABCD1234)"
                         style="background: rgba(0,0,0,0.3); border-style: dashed; min-height: auto;">
                </div>
                <div class="premium-code-actions">
                  <button class="premium-btn premium-btn-primary" id="premium-join-btn">Connect</button>
                  <button class="premium-btn premium-btn-danger" id="premium-disconnect-btn">Disconnect</button>
                </div>
              </div>
              
              <div class="premium-section">
                <div class="premium-section-title">Connected Players</div>
                <div class="premium-player-list" id="premium-player-list">
                  <div class="premium-player-item">
                    <div class="premium-player-info">
                      <div class="premium-player-name" style="color: var(--text-muted)">No players connected</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Tab: Settings -->
            <div class="premium-tab-content" id="tab-settings">
              <div class="premium-section">
                <div class="premium-section-title">Audio</div>
                <div class="premium-card">
                  <div class="premium-slider">
                    <div class="premium-slider-label">
                      <span>Master Volume</span>
                      <span id="volume-value">80%</span>
                    </div>
                    <div class="premium-slider-track" id="volume-slider">
                      <div class="premium-slider-fill" style="width: 80%"></div>
                      <div class="premium-slider-thumb" style="left: 80%"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="premium-section">
                <div class="premium-section-title">Graphics</div>
                <div class="premium-card">
                  <div class="premium-toggle">
                    <span class="premium-toggle-label">Premium Effects</span>
                    <div class="premium-toggle-switch active" id="premium-effects-toggle">
                      <div class="premium-toggle-thumb"></div>
                    </div>
                  </div>
                  <div class="premium-toggle" style="margin-top: 12px;">
                    <span class="premium-toggle-label">Motion Blur</span>
                    <div class="premium-toggle-switch" id="premium-blur-toggle">
                      <div class="premium-toggle-thumb"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(overlay);
      this.sidebar = document.getElementById('premium-sidebar');
    },
    
    setupEventListeners() {
      // Sidebar toggle
      const customizeBtn = document.getElementById('premium-btn-customize');
      const closeBtn = document.getElementById('premium-sidebar-close');
      
      if (customizeBtn) {
        customizeBtn.addEventListener('click', () => this.toggleSidebar());
      }
      
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.closeSidebar());
      }
      
      // Tab switching
      document.querySelectorAll('.premium-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
          const tabId = e.target.dataset.tab;
          this.switchTab(tabId);
        });
      });
      
      // Toggle switches
      document.querySelectorAll('.premium-toggle-switch').forEach(toggle => {
        toggle.addEventListener('click', () => {
          toggle.classList.toggle('active');
        });
      });
      
      // Keyboard shortcuts
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeSidebar();
        }
        if (e.key === 'c' || e.key === 'C') {
          this.toggleSidebar();
        }
        if (e.key === 'm' || e.key === 'M') {
          this.switchTab('multiplayer');
          this.openSidebar();
        }
      });
    },
    
    toggleSidebar() {
      if (!this.sidebar) return;
      this.sidebar.classList.toggle('open');
      State.ui.sidebarOpen = this.sidebar.classList.contains('open');
    },
    
    openSidebar() {
      if (!this.sidebar) return;
      this.sidebar.classList.add('open');
      State.ui.sidebarOpen = true;
    },
    
    closeSidebar() {
      if (!this.sidebar) return;
      this.sidebar.classList.remove('open');
      State.ui.sidebarOpen = false;
    },
    
    switchTab(tabId) {
      // Update tab buttons
      document.querySelectorAll('.premium-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabId);
      });
      
      // Update tab content
      document.querySelectorAll('.premium-tab-content').forEach(content => {
        content.classList.remove('active');
      });
      
      const targetContent = document.getElementById(`tab-${tabId}`);
      if (targetContent) {
        targetContent.classList.add('active');
      }
      
      // Update sidebar title
      const title = document.querySelector('.premium-sidebar-title');
      if (title) {
        const titles = {
          customization: 'CUSTOMIZATION',
          multiplayer: 'MULTIPLAYER',
          settings: 'SETTINGS'
        };
        title.textContent = titles[tabId] || 'MENU';
      }
      
      State.ui.activeTab = tabId;
    },
    
    updateSpeed(speed) {
      const el = document.getElementById('premium-speed');
      if (el) el.textContent = Math.round(speed);
    },
    
    updateDistance(distance) {
      const el = document.getElementById('premium-distance');
      if (el) el.textContent = (distance / 1000).toFixed(1);
    },
    
    updateTime(seconds) {
      const el = document.getElementById('premium-time');
      if (el) {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        el.textContent = `${mins}:${secs}`;
      }
    }
  };

  // ==========================================
  // GAME BRIDGE
  // ==========================================
  const GameBridge = {
    init() {
      this.hookIntoGameLoop();
      Utils.log('Game bridge initialized');
    },
    
    hookIntoGameLoop() {
      let lastUpdate = Date.now();
      let distance = 0;
      let startTime = Date.now();
      
      const updateLoop = () => {
        const now = Date.now();
        const delta = (now - lastUpdate) / 1000;
        lastUpdate = now;
        
        // Try to extract game data
        const game = window.game || window.app || window.G;
        
        if (game) {
          // Extract speed
          const speed = game.player?.speed || game.speed || 0;
          UIController.updateSpeed(speed * 3.6); // Convert to km/h
          
          // Calculate distance
          distance += speed * delta;
          UIController.updateDistance(distance);
          
          // Update time
          const elapsed = Math.floor((now - startTime) / 1000);
          UIController.updateTime(elapsed);
        }
        
        requestAnimationFrame(updateLoop);
      };
      
      // Start loop after a short delay
      setTimeout(updateLoop, 2000);
    }
  };

  // ==========================================
  // INITIALIZATION
  // ==========================================
  function init() {
    // Wait for DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }
    
    // Wait for game canvas
    const checkCanvas = setInterval(() => {
      if (document.querySelector('canvas')) {
        clearInterval(checkCanvas);
        
        console.log('%c🏎️ SLOW ROADS PREMIUM v' + CONFIG.version, 'color: #00f0ff; font-size: 20px; font-weight: bold;');
        console.log('%c✨ Premium UI loaded successfully!', 'color: #ff00aa;');
        
        // Initialize all modules
        UIController.init();
        CarModule.init();
        RoadModule.init();
        P2PModule.init();
        GameBridge.init();
        
        // Welcome toast
        setTimeout(() => {
          Toast.show('Welcome to Slow Roads Premium! Press C for customization', 'info', 5000);
        }, 1000);
      }
    }, 100);
  }

  // Start initialization
  init();

  // Expose API
  window.PremiumUI = {
    version: CONFIG.version,
    state: State,
    setCarColor: CarModule.setCarColor.bind(CarModule),
    setRoadPreset: RoadModule.setRoadPreset.bind(RoadModule),
    showToast: Toast.show.bind(Toast),
    toggleSidebar: UIController.toggleSidebar.bind(UIController)
  };

})();
