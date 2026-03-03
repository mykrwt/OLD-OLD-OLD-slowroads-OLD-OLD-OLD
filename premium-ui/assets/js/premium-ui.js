/**
 * SLOW ROADS PREMIUM UI
 * Advanced overlay system with car/road customization and multiplayer
 * Version: 2.1.0 - Enhanced with SVG Icons and distinct Home/Game UI
 */

(function() {
  'use strict';

  // ==========================================
  // SVG ICONS LIBRARY (Lucide-style)
  // ==========================================
  const Icons = {
    // Navigation & Controls
    settings: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
    
    users: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    
    palette: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r="0.5"/><circle cx="17.5" cy="10.5" r="0.5"/><circle cx="8.5" cy="7.5" r="0.5"/><circle cx="6.5" cy="12.5" r="0.5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z"/></svg>`,
    
    menu: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
    
    // Close/X icon
    x: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    
    // Stats & Info
    mapPin: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
    
    clock: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    
    gauge: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 12l3.5-3.5"/><circle cx="12" cy="12" r="2"/></svg>`,
    
    // Actions
    check: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    
    x: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    
    alertTriangle: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    
    info: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
    
    // Multiplayer
    wifi: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>`,
    
    copy: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
    
    play: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
    
    link: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
    
    // Car related
    car: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>`,
    
    road: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19h16"/><path d="M4 15h16"/><path d="M8 5v14"/><path d="M16 5v14"/><rect x="6" y="3" width="12" height="8"/></svg>`,
    
    // Home specific
    home: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    
    gamepad: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><rect x="2" y="6" width="20" height="12" rx="2"/></svg>`,
    
    // Environment
    sun: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
    
    moon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
    
    // Misc
    volume2: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`,
    
    zap: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`
  };

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
      toastQueue: [],
      isInGame: false,  // Track if player is in-game or at home screen
      gameStarted: false
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
        success: Icons.check,
        error: Icons.x,
        warning: Icons.alertTriangle,
        info: Icons.info
      };
      
      toast.innerHTML = `
        <span class="premium-toast-icon">${icons[type] || icons.info}</span>
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
        countBadge.innerHTML = `<span class="premium-player-count-icon">${Icons.users}</span> ${State.multiplayer.peers.length + 1}`;
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
                <span class="premium-player-count-icon">${Icons.users}</span> 1
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
              <div class="premium-stat-icon">${Icons.mapPin}</div>
              <div class="premium-stat-info">
                <div class="premium-stat-label">Distance</div>
                <div class="premium-stat-value" id="premium-distance">0.0</div>
              </div>
            </div>
            <div class="premium-stat-item">
              <div class="premium-stat-icon">${Icons.clock}</div>
              <div class="premium-stat-info">
                <div class="premium-stat-label">Time</div>
                <div class="premium-stat-value" id="premium-time">00:00</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Control Buttons -->
        <div class="premium-controls">
          <button class="premium-control-btn" id="premium-btn-settings" title="Settings">${Icons.settings}</button>
          <button class="premium-control-btn" id="premium-btn-multiplayer" title="Multiplayer">${Icons.users}</button>
          <button class="premium-control-btn" id="premium-btn-customize" title="Customize">${Icons.palette}</button>
          <button class="premium-control-btn" id="premium-btn-menu" title="Menu">${Icons.menu}</button>
        </div>
        
        <!-- Sidebar -->
        <div class="premium-sidebar" id="premium-sidebar">
          <div class="premium-sidebar-header">
            <div class="premium-sidebar-title">CUSTOMIZATION</div>
            <button class="premium-sidebar-close" id="premium-sidebar-close">${Icons.x}</button>
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
        
        <!-- HOME SCREEN OVERLAY -->
        <div class="premium-home-screen" id="premium-home-screen">
          <div class="premium-home-content">
            <div class="premium-home-logo">
              <div class="premium-home-logo-icon">
                <span class="premium-home-logo-sr">SR</span>
              </div>
              <div class="premium-home-logo-text">
                <h1>SLOW ROADS</h1>
                <span class="premium-home-badge">PREMIUM</span>
              </div>
            </div>
            
            <div class="premium-home-tagline">Endless Driving Zen</div>
            
            <div class="premium-home-actions">
              <button class="premium-home-btn premium-home-btn-primary" id="premium-start-btn">
                <span class="premium-home-btn-icon">${Icons.play}</span>
                <span>START DRIVING</span>
              </button>
              
              <div class="premium-home-secondary-actions">
                <button class="premium-home-btn premium-home-btn-secondary" id="premium-home-customize">
                  <span class="premium-home-btn-icon">${Icons.palette}</span>
                  <span>Customize</span>
                </button>
                
                <button class="premium-home-btn premium-home-btn-secondary" id="premium-home-multiplayer">
                  <span class="premium-home-btn-icon">${Icons.users}</span>
                  <span>Multiplayer</span>
                </button>
              </div>
            </div>
            
            <div class="premium-home-quick-settings">
              <div class="premium-home-setting-row">
                <span class="premium-home-setting-label">${Icons.car} Vehicle</span>
                <select class="premium-home-select" id="premium-vehicle-select">
                  <option value="car">Sports Car</option>
                  <option value="roadster">Roadster</option>
                  <option value="bus">Bus</option>
                  <option value="motorcycle">Motorcycle</option>
                </select>
              </div>
              
              <div class="premium-home-setting-row">
                <span class="premium-home-setting-label">${Icons.road} Environment</span>
                <select class="premium-home-select" id="premium-env-select">
                  <option value="earth">Earth</option>
                  <option value="mars">Mars</option>
                  <option value="moon">Moon</option>
                  <option value="venus">Venus</option>
                </select>
              </div>
            </div>
          </div>
          
          <div class="premium-home-footer">
            <div class="premium-home-footer-links">
              <span>Press <kbd>SPACE</kbd> to start</span>
              <span class="premium-home-divider">|</span>
              <span>Press <kbd>C</kbd> for customization</span>
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
    },
    
    // ==========================================
    // HOME SCREEN MANAGEMENT
    // ==========================================
    showHomeScreen() {
      const homeScreen = document.getElementById('premium-home-screen');
      const hud = document.querySelector('.premium-hud');
      const controls = document.querySelector('.premium-controls');
      
      if (homeScreen) {
        homeScreen.classList.add('premium-home-visible');
        homeScreen.classList.remove('premium-home-hidden');
      }
      if (hud) hud.classList.add('premium-hud-hidden');
      if (controls) controls.classList.add('premium-controls-hidden');
      
      State.ui.isInGame = false;
      State.ui.gameStarted = false;
      
      Utils.log('Home screen shown');
    },
    
    hideHomeScreen() {
      const homeScreen = document.getElementById('premium-home-screen');
      const hud = document.querySelector('.premium-hud');
      const controls = document.querySelector('.premium-controls');
      
      if (homeScreen) {
        homeScreen.classList.add('premium-home-hidden');
        homeScreen.classList.remove('premium-home-visible');
      }
      if (hud) hud.classList.remove('premium-hud-hidden');
      if (controls) controls.classList.remove('premium-controls-hidden');
      
      State.ui.isInGame = true;
      State.ui.gameStarted = true;
      
      Utils.log('Home screen hidden - game started');
    },
    
    setupHomeScreenListeners() {
      // Start button
      const startBtn = document.getElementById('premium-start-btn');
      if (startBtn) {
        startBtn.addEventListener('click', () => {
          this.hideHomeScreen();
          // Dispatch event to start the game
          window.dispatchEvent(new CustomEvent('premium:startGame'));
        });
      }
      
      // Customize button on home screen
      const homeCustomizeBtn = document.getElementById('premium-home-customize');
      if (homeCustomizeBtn) {
        homeCustomizeBtn.addEventListener('click', () => {
          this.switchTab('customization');
          this.openSidebar();
        });
      }
      
      // Multiplayer button on home screen
      const homeMultiplayerBtn = document.getElementById('premium-home-multiplayer');
      if (homeMultiplayerBtn) {
        homeMultiplayerBtn.addEventListener('click', () => {
          this.switchTab('multiplayer');
          this.openSidebar();
        });
      }
      
      // Keyboard shortcut to show home screen (Escape when in game)
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && State.ui.isInGame) {
          // Could show pause menu here
        }
        if (e.code === 'Space' && !State.ui.isInGame) {
          e.preventDefault();
          this.hideHomeScreen();
          window.dispatchEvent(new CustomEvent('premium:startGame'));
        }
      });
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
        
        console.log('%cSLOW ROADS PREMIUM v' + CONFIG.version, 'color: #00f0ff; font-size: 20px; font-weight: bold;');
        console.log('%cPremium UI loaded successfully!', 'color: #ff00aa;');
        
        // Initialize all modules
        UIController.init();
        CarModule.init();
        RoadModule.init();
        P2PModule.init();
        GameBridge.init();
        
        // Setup home screen and show it initially
        UIController.setupHomeScreenListeners();
        UIController.showHomeScreen();
        
        // Welcome toast
        setTimeout(() => {
          Toast.show('Welcome to Slow Roads Premium! Press SPACE to start driving', 'info', 5000);
        }, 1500);
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
