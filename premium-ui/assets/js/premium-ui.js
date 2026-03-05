/**
 * Slow Roads Premium — Custom Home & Simplified P2P
 * Replaces the original splash screen with a high-end entry.
 */
(function () {
  'use strict';

  // --- HELPERS ---
  const el = id => {
    const element = document.getElementById(id);
    if (!element) return { onclick: null, style: {}, innerText: '', classList: { add: () => { }, remove: () => { }, contains: () => false }, value: '', remove: () => { }, appendChild: () => { }, querySelector: () => null };
    return element;
  };
  const q = selector => {
    const element = document.querySelector(selector);
    if (!element) return { onclick: null, style: {}, innerText: '', classList: { add: () => { }, remove: () => { }, contains: () => false }, value: '', remove: () => { }, appendChild: () => { }, querySelector: () => null };
    return element;
  };
  const generateCode = () => Math.floor(1000 + Math.random() * 9000).toString();

  // --- CONFIG ---
  const PUBLIC_LOBBIES = [
    { id: 'SR-PUB-01', name: 'ALPINE PEAKS', seed: 'peaks_77', topo: 'mountains', desc: 'High-altitude hairpins and steep drops.' },
    { id: 'SR-PUB-02', name: 'DESERT HIGHWAY', seed: 'dunes_12', topo: 'normal', desc: 'Long straights through a sun-drenched wasteland.' },
    { id: 'SR-PUB-03', name: 'ARCTIC TUNDRA', seed: 'glacier_x', topo: 'mountains', desc: 'Slippery roads and frozen landscapes.' },
    { id: 'SR-PUB-04', name: 'COASTAL DRIVE', seed: 'ocean_breeze', topo: 'normal', desc: 'Relaxing winding roads along the shoreline.' },
  ];

  // --- STATE ---
  const State = {
    peer: null,
    conns: new Map(), // peerId -> { conn, username }
    isHost: false,
    teamCode: null,
    username: localStorage.getItem('sr_username') || '',
    mode: 'menu',
    activeLobbies: new Map(), // lobbyId -> { status, players, hostInfo }
    perf: { fps: 60, ping: 0 },
    config: { isPublic: false }
  };

  // --- UI BUILDING ---
  function buildHome() {
    // Remove if exists
    const existing = el('premium-home');
    if (existing) existing.remove();

    const home = document.createElement('div');
    home.id = 'premium-home';
    home.className = 'premium-home';
    home.innerHTML = `
      <div id="premium-error-msg" class="premium-error-msg">ERROR MESSAGE</div>
      <div class="premium-home-content">
        <div class="premium-home-logo">SLOW ROADS</div>
        <div class="premium-home-tagline">ENDLESS DRIVING ZEN</div>

        <!-- MAIN MENU -->
        <div id="screen-main" class="premium-home-screen active">
          <div class="premium-username-container">
            <div class="premium-input-label">CHOOSE YOUR DRIVER TAG</div>
            <input type="text" id="input-username" class="premium-input-field" placeholder="E.G. DRIFTER_01" maxlength="12" value="${State.username}">
          </div>
          <div class="premium-home-menu">
            <button class="premium-home-btn primary" id="btn-singleplayer">SINGLEPLAYER</button>
            <button class="premium-home-btn" id="btn-multiplayer-menu">MULTIPLAYER</button>
          </div>
        </div>

        <!-- MULTIPLAYER MENU (SERVER BROWSER) -->
        <div id="screen-multiplayer" class="premium-home-screen">
          <div class="premium-home-tagline" style="margin-bottom: 0px; color: #00ff88; font-weight: 900; letter-spacing: 0.2rem;">NETWORK FEED</div>
          <div class="premium-server-browser" id="server-browser-list">
             <div class="premium-loader-mini">INITIALIZING SCAN...</div>
          </div>
          <div class="premium-home-menu multi-grid">
            <button class="premium-home-btn primary" id="btn-mp-refresh">REFRESH</button>
            <button class="premium-home-btn" id="btn-mp-join-room">JOIN ROOM</button>
            <button class="premium-home-btn" id="btn-mp-create-go">CREATE</button>
            <button class="premium-home-btn" id="btn-mp-back">CANCEL</button>
          </div>
        </div>

        <!-- CREATE SETTINGS SCREEN -->
        <div id="screen-create-settings" class="premium-home-screen">
          <div class="premium-home-tagline" style="margin-bottom: 1rem; letter-spacing: 0.3rem;">SERVER CONFIGURATION</div>
          
          <div class="premium-config-group">
            <div class="premium-input-label">SERVER NAME</div>
            <input type="text" id="input-server-name" class="premium-input-field" placeholder="MY EPIC RACE" maxlength="20">
          </div>

          <div class="premium-config-group" style="margin-top: 20px;">
            <div class="premium-input-label">ACCESS TYPE</div>
            <div class="premium-toggle-group">
              <button class="premium-toggle-btn active" id="toggle-private">PRIVATE (CODE)</button>
              <button class="premium-toggle-btn" id="toggle-public">PUBLIC (OPEN)</button>
            </div>
          </div>

          <div class="premium-home-menu" style="margin-top: 30px;">
            <button class="premium-home-btn primary" id="btn-create-init">INITIALIZE</button>
            <button class="premium-home-btn" id="btn-create-back">BACK</button>
          </div>
        </div>

        <!-- CREATE PRIVATE CODE DISPLAY (Lobby entry phase) -->
        <div id="screen-create" class="premium-home-screen">
          <div class="premium-home-tagline" style="margin-bottom: 0.5rem; letter-spacing: 0.3rem;">HOSTING SECURE TEAM</div>
          <div class="premium-code-display" id="display-team-code">----</div>
          <div class="premium-home-menu">
            <button class="premium-home-btn primary" id="btn-create-start">START SESSION</button>
            <button class="premium-home-btn" id="btn-create-cancel">CANCEL</button>
          </div>
        </div>

        <!-- JOIN ROOM SCREEN -->
        <div id="screen-join" class="premium-home-screen">
          <div class="premium-home-tagline" style="margin-bottom: 1rem; letter-spacing: 0.2rem;">ENTER CODE OR SERVER ID</div>
          <div class="premium-code-input-wrapper">
             <input type="text" id="input-room-code" class="premium-code-input-single" maxlength="12" placeholder="0000" style="letter-spacing: 0.5rem; font-size: 1.5rem;" autofocus>
          </div>
          <div class="premium-home-menu">
            <button class="premium-home-btn primary" id="btn-join-confirm">ESTABLISH LINK</button>
            <button class="premium-home-btn" id="btn-join-cancel">CANCEL</button>
          </div>
        </div>

        <!-- LOBBY SCREEN -->
        <div id="screen-lobby" class="premium-home-screen">
          <div class="premium-home-tagline" style="margin-bottom: 0px;" id="lobby-code-title">TEAM CODE: ----</div>
          <div class="premium-lobby-list" id="lobby-list">
            <!-- Players added here -->
          </div>
          <div id="lobby-controls" class="premium-home-menu">
            <button class="premium-home-btn primary" id="btn-start-lobby" style="display:none">START GAME</button>
            <div class="premium-lobby-status" id="lobby-status">WAITING FOR DRIVERS...</div>
            <button class="premium-home-btn" id="btn-leave-lobby">LEAVE TEAM</button>
          </div>
        </div>

      </div>
      
      <!-- DEBUG HUD (toggle with K) -->
      <div id="premium-debug-hud" style="position:fixed; bottom:20px; left:20px; background:rgba(0,0,0,0.85); color:#0f0; font-family:monospace; font-size:11px; padding:12px; border-radius:6px; z-index:99999; display:none; pointer-events:none; min-width:220px;">
        <div style="font-weight:bold;margin-bottom:5px;color:#0ff;">⬡ DEBUG HUD (K)</div>
        <div>PEER ID: <span id="debug-peer-id" style="color:#ff0">-</span></div>
        <div>CONNS: <span id="debug-conns">0</span></div>
        <div>SEED: <span id="debug-seed" style="color:#ff0">-</span></div>
        <div>NODE: <span id="debug-node">-</span></div>
        <div>SYNC: <span id="debug-sync-sent">0</span> sent / <span id="debug-sync-recv">0</span> recv</div>
        <div>GHOSTS: <span id="debug-ghosts">0</span></div>
        <div id="debug-log" style="margin-top:5px; color:#aaa; font-size:10px;"></div>
      </div>
    `;
    document.body.appendChild(home);

    // In-game player list container
    const playerList = document.createElement('div');
    playerList.id = 'premium-player-list';
    playerList.className = 'premium-ingame-players';
    document.body.appendChild(playerList);
  }

  // --- ERROR HANDLING & NAVIGATION (Moved out of buildHome for global scope) ---
  function toastError(msg) {
    const errorEl = el('premium-error-msg');
    if (!errorEl || !errorEl.classList) return;
    errorEl.innerText = msg;
    errorEl.classList.add('show');
    setTimeout(() => errorEl.classList.remove('show'), 3000);
  }

  function showScreen(screenId) {
    document.querySelectorAll('.premium-home-screen').forEach(s => {
      if (s && s.classList) s.classList.remove('active');
    });
    const target = el(screenId);
    if (target && target.classList) target.classList.add('active');
  }

  function validateUsername() {
    const nameInput = el('input-username');
    if (!nameInput) return null;
    const name = nameInput.value.trim().toUpperCase();
    if (!name || name.length < 2) {
      toastError("USERNAME TOO SHORT! (MIN 2 CHARS)");
      return null;
    }
    State.username = name;
    localStorage.setItem('sr_username', name);
    return name;
  }

  // --- GAME START LOGIC ---
  async function startGame() {
    console.log("[PremiumUI] Starting Game...");

    // Hide our home screen with animation
    const home = el('premium-home');
    if (home) {
      home.style.transition = 'opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      home.style.opacity = '0';
      home.style.transform = 'scale(1.1)';
      home.style.pointerEvents = 'none';
      setTimeout(() => home.remove(), 700);
    }

    // Safety Force: The game might be ready but hidden
    const splashContainer = el('splash-container');
    if (splashContainer) splashContainer.style.display = 'block';

    // Poll for the "Begin" button in the original UI
    let attempts = 0;
    const pollStart = setInterval(() => {
      attempts++;
      const startBtn = document.querySelector('.splash-ready') ||
        el('splash-loader') ||
        document.querySelector('[class*="splash-ready"]');

      if (startBtn && (startBtn.classList.contains('splash-ready') || startBtn.innerText.toLowerCase().includes('begin'))) {
        console.log("[PremiumUI] Found start button, clicking...");
        clearInterval(pollStart);
        startBtn.click();
      } else if (attempts > 60) {
        console.warn("[PremiumUI] Could not find start button, forcing direct start...");
        clearInterval(pollStart);
        if (splashContainer) splashContainer.style.display = 'none';
      }
    }, 100);
  }

  // --- P2P MODULE ---
  const P2P = {
    initHost(lobbyId = null, config = {}) {
      const code = lobbyId || generateCode();
      State.teamCode = code;
      State.isHost = true;
      State.serverConfig = config; // { name, isPublic }

      el('lobby-code-title').innerText = `${config.name || 'SESSION'}${config.isPublic ? '' : ' | CODE: ' + code}`;
      el('btn-start-lobby').style.display = 'block';
      el('lobby-status').innerText = 'READY TO RACE';

      showScreen('screen-lobby');
      this.updateLobbyList();
      this.render();

      // For public lobbies, we use a fixed ID structure (Slots 01-10)
      const peerId = lobbyId ? lobbyId : 'SR-' + code + '-HOST';

      // PRO GRADE CONFIG: Add STUN servers to ensure cross-network connectivity
      const peerConfig = {
        config: {
          'iceServers': [
            { url: 'stun:stun.l.google.com:19302' },
            { url: 'stun:stun1.l.google.com:19302' },
            { url: 'stun:stun2.l.google.com:19302' },
          ]
        }
      };

      State.peer = new Peer(peerId, peerConfig);

      State.peer.on('open', (id) => {
        console.log('[P2P] Hosting on', id);
        if (el('debug-peer-id')) el('debug-peer-id').innerText = id;
      });

      State.peer.on('error', err => {
        if (err.type === 'unavailable-id' && !lobbyId) {
          this.initHost();
        } else {
          console.error("[P2P] Peer Error:", err);
          if (lobbyId) {
            // If official ID is taken, we just join as a client
            this.initJoin(lobbyId);
          }
        }
      });

      State.peer.on('connection', conn => {
        // Handle discovery pings
        if (conn.metadata && conn.metadata.type === 'ping') {
          conn.on('open', () => {
            conn.send({
              type: 'pong',
              players: [State.username, ...Array.from(State.conns.values()).map(c => c.username)]
            });
            setTimeout(() => conn.close(), 500);
          });
          return;
        }

        conn.on('open', () => {
          conn.on('data', data => {
            if (data.type === 'handshake') {
              // Check if name taken
              let nameTaken = false;
              State.conns.forEach(c => { if (c.username === data.username) nameTaken = true; });

              if (nameTaken) {
                conn.send({ type: 'error', message: 'USERNAME ALREADY TAKEN' });
                setTimeout(() => conn.close(), 500);
              } else {
                State.conns.set(conn.peer, { conn, username: data.username, perf: data.perf });
                conn.send({
                  type: 'handshake_ack',
                  hostUsername: State.username,
                  serverName: State.serverConfig ? State.serverConfig.name : 'RACE',
                  players: [State.username, ...Array.from(State.conns.values()).map(c => c.username)]
                });
                this.updateLobbyList();
                this.broadcast({ type: 'lobby_update', players: [State.username, ...Array.from(State.conns.values()).map(c => c.username)] });
                if (el('debug-conns')) el('debug-conns').innerText = State.conns.size;

                // Send WORLD_INIT
                const sc = window.sceneConfig;
                const worldInitPacket = {
                  type: 'world_init',
                  seed: window.getGameSeed ? window.getGameSeed() : localStorage.getItem('seed'),
                  config: sc ? sc.value : {},
                  nodeIndex: (window.gameState && window.gameState.vehicleNode) ? window.gameState.vehicleNode.i : 0
                };
                conn.send(worldInitPacket);
              }
            } else if (data.type === 'v_sync') {
              Multiplayer.handleSync(data);
              // Relay to all other joiners
              State.conns.forEach((c, id) => {
                if (id !== conn.peer) c.conn.send(data);
              });
            }
          });
        });

        conn.on('close', () => {
          State.conns.delete(conn.peer);
          this.updateLobbyList();
          this.broadcast({ type: 'lobby_update', players: [State.username, ...Array.from(State.conns.values()).map(c => c.username)] });
        });
      });
    },

    initJoin(code) {
      if (!validateUsername()) return;

      const isPublic = code.startsWith('SR-PUB-');
      State.teamCode = code;
      State.isHost = false;

      el('lobby-code-title').innerText = `TEAM: ${isPublic ? code.replace('SR-PUB-', 'SERVER ') : code}`;
      el('btn-start-lobby').style.display = 'none';
      el('lobby-status').innerText = 'CONNECTING...';

      showScreen('screen-lobby');
      this.updateLobbyList();

      const connectionTimeout = setTimeout(() => {
        if (State.conns.size === 0) {
          toastError("CONNECTION TIMED OUT. SERVER MIGHT BE FULL OR OFFLINE.");
          setTimeout(() => window.location.reload(), 2000);
        }
      }, 10000);

      State.peer = new Peer();
      State.peer.on('open', (id) => {
        if (el('debug-peer-id')) el('debug-peer-id').innerText = id;

        // Public lobbies use the ID directly, private use the prefix
        const targetId = isPublic ? code : 'SR-' + code + '-HOST';
        console.log('[P2P] Attempting to connect to:', targetId);

        // RELIABLE: Set reliable=true to guarantee packet delivery
        const conn = State.peer.connect(targetId, { reliable: true });

        conn.on('open', () => {
          clearTimeout(connectionTimeout);
          console.log('[P2P] Link established with:', targetId);
          el('lobby-status').innerText = 'HANDSHAKING...';

          // Slight delay to ensure Peer Data Channel is stable
          setTimeout(() => {
            conn.send({
              type: 'handshake',
              username: State.username,
              perf: State.perf
            });
          }, 100);
        });

        conn.on('data', data => {
          if (data.type === 'handshake_ack') {
            console.log('[P2P] Handshake complete.');
            State.conns.set('HOST', { conn, username: data.hostUsername });
            el('lobby-status').innerText = 'LINK SECURED';
            el('lobby-code-title').innerText = `SERVER: ${data.serverName || 'CONNECTED'}`;
            this.renderLobbyPlayers(data.players, data.hostUsername);
          } else if (data.type === 'lobby_update') {
            this.renderLobbyPlayers(data.players, State.conns.get('HOST').username);
          } else if (data.type === 'game_start') {
            // Teleport to host's exact spawn node after game loads
            if (data.nodeIndex !== undefined) {
              Multiplayer.scheduleSpawnTeleport(data.nodeIndex);
            }
            startGame();
          } else if (data.type === 'world_init') {
            // --- PHASE 2: Joiner Boot Control with Reload Guard ---
            this.applyWorldInit(data, code);
          } else if (data.type === 'v_sync') {
            Multiplayer.handleSync(data);
          } else if (data.type === 'error') {
            toastError(data.message);
            setTimeout(() => window.location.reload(), 2000);
          }
        });

        conn.on('close', () => {
          toastError("LINK SEVERED FROM REMOTE HOST");
          setTimeout(() => window.location.reload(), 1500);
        });
      });

      State.peer.on('error', (err) => {
        clearTimeout(connectionTimeout);
        if (err.type === 'peer-unavailable') {
          toastError("TARGET SECTOR OFFLINE (PEER NOT FOUND)");
        } else {
          toastError("NETWORK INTERFERENCE DETECTED");
        }
        console.error("[P2P] Peer Error:", err);
        setTimeout(() => window.location.reload(), 2000);
      });
    },

    applyWorldInit(data, teamCode) {
      console.log('[P2P] Received world_init:', data);

      const config = data.config || {};
      const seed = data.seed;

      // Force-sync ALL world parameters to localStorage so engine reads them natively
      localStorage.setItem('seed', seed);
      if (config.topography) localStorage.setItem('config-scene-topography', config.topography);
      if (config.skin) localStorage.setItem('config-scene-skin', config.skin);
      if (config.sceneName) localStorage.setItem('config-scene-name', config.sceneName);
      if (config.weatherIndex !== undefined) localStorage.setItem('config-scene-weather-index', config.weatherIndex);

      // Inject start node into LS as He (Line 1150 in app-bundle.js)
      localStorage.setItem('start-node', data.nodeIndex || 0);

      const urlParams = new URLSearchParams(window.location.search);
      const alreadySynced = urlParams.get('sr_synced') === '1';

      if (alreadySynced && urlParams.get('seed') === seed) {
        console.log('[P2P] Already synced via URL. Teleporting to node:', data.nodeIndex);
        Multiplayer.scheduleSpawnTeleport(data.nodeIndex);
        return;
      }

      // REDIRECT: This is the ONLY way to get the engine to 100% reset its generation 
      // with the new seed/settings. 
      const params = new URLSearchParams();
      params.set('seed', seed);
      params.set('node', data.nodeIndex || 0);
      params.set('topo', config.topography || 'normal'); // Force topo in QS
      params.set('sr_autojoin', teamCode);
      params.set('sr_synced', '1');

      console.log('[P2P] Redirecting to sync with host world...');
      window.location.href = window.location.pathname + '?' + params.toString();
    },

    broadcast(data) {
      // COORDINATE FIX: Ensure we send positions relative to the shared road node
      // if the game engine shifts origin. For now, we rely on sr_synced=1 reload.
      State.conns.forEach(c => {
        if (c.conn.open) c.conn.send(data);
      });
    },

    renderLobbyPlayers(usernames, hostName) {
      const list = el('lobby-list');
      if (!list) return;
      list.innerHTML = usernames.map(name => `
        <div class="premium-lobby-player">
          <div class="premium-player-info">
            <div class="premium-player-dot"></div>
            <div class="premium-player-name">${name} ${name === State.username ? '(YOU)' : ''}</div>
          </div>
          ${name === hostName ? '<div class="premium-host-badge">HOST</div>' : ''}
        </div>
      `).join('');
    },

  };

  const ServerScanner = {
    scan() {
      const list = el('server-browser-list');
      if (!list) return;
      list.innerHTML = '<div class="premium-loader-mini">SCANNING FREQUENCIES...</div>';

      State.activeLobbies.clear();

      let tempPeer = new Peer();
      tempPeer.on('open', () => {
        // Scan slots SR-PUB-01 to SR-PUB-08
        for (let i = 1; i <= 8; i++) {
          const slotId = `SR-PUB-0${i}`;
          // Set reliable for discovery too
          const conn = tempPeer.connect(slotId, { metadata: { type: 'ping' }, reliable: true });

          const timeout = setTimeout(() => {
            conn.close();
          }, 1500);

          conn.on('open', () => {
            clearTimeout(timeout);
            conn.send({ type: 'ping' });
          });

          conn.on('data', data => {
            if (data.type === 'pong') {
              this.updateEntry(slotId, 'online', data.players);
              conn.close();
            }
          });
        }

        // Self-destruct temp peer after scan
        setTimeout(() => {
          tempPeer.destroy();
          if (State.activeLobbies.size === 0) {
            list.innerHTML = '<div class="premium-loader-mini" style="color:#ff3333">NO ACTIVE LINKS FOUND</div>';
          }
        }, 2000);
      });

      this.render();
    },

    updateEntry(id, status, players = []) {
      const lobbyInfo = PUBLIC_LOBBIES.find(l => l.id === id) || { name: 'UNKNOWN SECTOR', desc: 'Remote transmission detected.' };
      State.activeLobbies.set(id, { status, players, ...lobbyInfo });
      this.render();
    },

    render() {
      const list = el('server-browser-list');
      if (!list || !list.classList) return;

      if (State.activeLobbies.size === 0 && !list.innerHTML.includes('SCANNING')) {
        return;
      }

      const items = Array.from(State.activeLobbies.entries());

      list.innerHTML = items.map(([id, info]) => {
        return `
          <div class="premium-server-entry online" onclick="window.PremiumUI.joinPublic('${id}')">
            <div class="premium-server-main">
              <div class="premium-server-name">${info.name}</div>
              <div class="premium-server-desc">${info.desc}</div>
            </div>
            <div class="premium-server-meta">
              <div class="premium-server-status">ACTIVE</div>
              <div class="premium-server-players">${info.players.length}/8</div>
            </div>
          </div>
        `;
      }).join('');
    }
  };

  const PremiumUI = {
    joinPublic(lobbyId) {
      const lobby = PUBLIC_LOBBIES.find(l => l.id === lobbyId);
      if (!lobby) return;

      console.log('[PremiumUI] Attempting to join public lobby:', lobby.name);

      // Check if server is online. If not, we are the host.
      const info = State.activeLobbies.get(lobbyId);
      if (info && info.status === 'online') {
        P2P.initJoin(lobbyId);
      } else {
        // Force world settings for this specific public lobby
        localStorage.setItem('seed', lobby.seed);
        localStorage.setItem('config-scene-topography', lobby.topo);
        P2P.initHost(lobbyId);
      }
    }
  };
  window.PremiumUI = PremiumUI;

  const Performance = {
    benchmark() {
      let lastTime = performance.now();
      let frames = 0;

      const check = () => {
        frames++;
        const now = performance.now();
        if (now >= lastTime + 1000) {
          State.perf.fps = frames;
          frames = 0;
          lastTime = now;
        }
        requestAnimationFrame(check);
      };
      requestAnimationFrame(check);
    }
  };


  // --- MULTIPLAYER SYNC MODULE ---
  const Multiplayer = {
    ghosts: new Map(), // peerId -> { car, label, lastNode }
    syncInterval: null,

    // --- PHASE 3: Post-Boot Teleport ---
    scheduleSpawnTeleport(targetNodeIndex) {
      console.log('[Multiplayer] Scheduling spawn teleport to node:', targetNodeIndex);
      let attempts = 0;
      const poll = setInterval(() => {
        attempts++;
        const gs = window.gameState;
        // Wait until engine has fully set vehicleNode and head
        if (gs && gs.vehicleNode && gs.head && gs.head.i !== undefined) {
          clearInterval(poll);
          // Timing guard: wait 500ms after world is ready before overriding
          setTimeout(() => {
            const targetNode = this.findNodeById(targetNodeIndex, gs.vehicleNode);
            if (targetNode) {
              console.log('[Multiplayer] Teleporting to node:', targetNode.i);
              window.gameState.vehicleNode = targetNode;
              window.gameState.vehicleIndex = targetNode.i;
            } else {
              console.warn('[Multiplayer] Target node not yet generated. Using nearest available.');
              // Failure case: walk to the furthest available node
            }
          }, 500);
        } else if (attempts > 200) {
          clearInterval(poll);
          console.error('[Multiplayer] World never became ready for teleport.');
        }
      }, 100);
    },

    findNodeById(idx, startNode) {
      if (!window.gameState || !window.gameState.head) return null;
      let curr = startNode || window.gameState.head;
      let iters = 0;
      const MAX_ITERS = 50000;

      // Walk forward
      while (curr && curr.i < idx && iters < MAX_ITERS) {
        if (!curr.next) break;
        curr = curr.next;
        iters++;
      }
      // Walk backward if overshot
      while (curr && curr.i > idx && iters < MAX_ITERS) {
        if (!curr.prev) break;
        curr = curr.prev;
        iters++;
      }
      return (curr && curr.i === idx) ? curr : null;
    },

    startSync() {
      if (this.syncInterval) return;
      console.log('[Multiplayer] Starting Sync Loop...');
      this.syncInterval = setInterval(() => this.tick(), 50); // 20fps
    },

    stopSync() {
      if (this.syncInterval) clearInterval(this.syncInterval);
      this.syncInterval = null;
    },

    // Broadcast position relative to the nearest road node to avoid floating origin drift
    tick() {
      if (!window.gameVehicle || !State.peer || !State.peer.open || !window.gameState || !window.gameState.vehicleNode) return;
      const pos = window.gameVehicle.position;
      const rot = window.gameVehicle.rotation;
      const node = window.gameState.vehicleNode;

      // Calculate offset from the current node
      const offsetX = pos.x - node.p.x;
      const offsetY = pos.y - node.p.y;
      const offsetZ = pos.z - node.p.z;

      P2P.broadcast({
        type: 'v_sync',
        peerId: State.peer.id,
        username: State.username,
        vehicle: window.gameVehicle.name || 'Roadster',
        // Send RELATIVE position + node index
        nodeIndex: node.i,
        ox: offsetX, oy: offsetY, oz: offsetZ,
        rx: rot.x, ry: rot.y, rz: rot.z,
        speed: window.gameVehicle.speed || 0
      });

      const sentEl = el('debug-sync-sent');
      if (sentEl) sentEl.innerText = (parseInt(sentEl.innerText) || 0) + 1;
    },

    handleSync(data) {
      if (!State.peer || data.peerId === State.peer.id) return;

      let ghost = this.ghosts.get(data.peerId);
      if (!ghost) {
        console.log('[Multiplayer] First packet from:', data.username, '— creating ghost...');
        ghost = this.createGhost(data.username, data.vehicle);
        if (ghost) {
          this.ghosts.set(data.peerId, ghost);
        } else {
          return; // Will retry next packet
        }
      }

      const { car, label } = ghost;

      // Update vehicle model if it changed
      if (data.vehicle && ghost.type !== data.vehicle) {
        console.log('[Multiplayer] Vehicle changed for:', data.username, 'to:', data.vehicle);
        if (car.parent) car.parent.remove(car);
        const newGhost = this.createGhost(data.username, data.vehicle);
        if (newGhost) {
          this.ghosts.set(data.peerId, newGhost);
          ghost.car = newGhost.car;
          ghost.type = data.vehicle;
          // Important: update the car reference in the destructuring scope or re-fetch
          this.ghosts.set(data.peerId, newGhost);
          return; // Skip this frame to let new ghost settle
        }
      }

      // POSITIONAL SYNC:
      // If we have nodeIndex, use relative positioning (Nuclear Fix for 100% sync)
      if (data.nodeIndex !== undefined) {
        const anchorNode = this.findNodeById(data.nodeIndex, ghost.lastNode);
        if (anchorNode) {
          ghost.lastNode = anchorNode; // Cache for faster lookup next time
          // Reconstruct absolute world position: NodePos + Offset
          car.position.set(
            anchorNode.p.x + data.ox,
            anchorNode.p.y + data.oy,
            anchorNode.p.z + data.oz
          );
        } else {
          // Fallback: If node not found (too far?), hide ghost or try raw coords if available
          // car.visible = false; 
          // console.warn('Ghost node not found:', data.nodeIndex);
        }
      }
      // Fallback to raw coords if legacy packet
      else if (data.x !== undefined) {
        car.position.set(data.x, data.y, data.z);
      }

      if (data.rx !== undefined) {
        car.rotation.set(data.rx, data.ry, data.rz);
      }

      if (label) {
        const speedKmh = Math.round((data.speed || 0) * 3.6);
        label.innerText = `${data.username}\n${speedKmh} km/h`;
      }

      this.updateLabelPos(car, label);

      const recvEl = el('debug-sync-recv');
      if (recvEl) recvEl.innerText = (parseInt(recvEl.innerText) || 0) + 1;
    },

    createGhost(username, vehicleType = 'Roadster') {
      // Wait until vehicle is in scene
      if (!window.gameVehicle || !window.gameVehicle.parent) {
        console.warn('[Multiplayer] gameVehicle not in scene yet, retrying in 500ms...');
        setTimeout(() => {
          const g = this.createGhost(username, vehicleType);
          if (g) this.ghosts.set(username + '_retry', g);
        }, 500);
        return null;
      }

      const scene = window.gameVehicle.parent;

      let carGroup = null;

      // For Slow Roads, we can't easily instantiate a new model from scratch because 
      // the loader and obj data are bundled. Cloning the current vehicle is the most reliable way 
      // if it's the right type. If not, we still clone it as a placeholder.
      try {
        carGroup = window.gameVehicle.clone();
        // Subtle tint to distinguish from self
        carGroup.traverse(c => {
          if (c.isMesh && c.material) {
            const mats = Array.isArray(c.material) ? c.material : [c.material];
            mats.forEach(m => {
              const mc = m.clone();
              if (mc.emissive) mc.emissive.setHex(0x00aa44);
              mc.emissiveIntensity = 0.5;
              if (Array.isArray(c.material)) {
                c.material = c.material.map(() => mc);
              } else {
                c.material = mc;
              }
            });
          }
        });
        console.log('[Multiplayer] ✅ Full vehicle cloned for ghost:', username, 'Type:', vehicleType);
      } catch (e) {
        console.warn('[Multiplayer] Clone failed:', e);
        carGroup = null;
      }

      if (!carGroup) return null;

      // Float label above car
      const labelDiv = document.createElement('div');
      labelDiv.style.cssText = 'position:fixed;color:#00ff88;background:rgba(0,0,0,0.85);padding:4px 10px;border-radius:8px;border:1px solid #00ff88;pointer-events:none;font-family:Orbitron,sans-serif;font-size:12px;font-weight:bold;white-space:pre;text-align:center;z-index:99999;';
      labelDiv.innerText = username;
      document.body.appendChild(labelDiv);

      scene.add(carGroup);

      // Patch collisions once Ao is available
      this.initCollisionPatch();

      return { car: carGroup, label: labelDiv, type: vehicleType, lastNode: window.gameState ? window.gameState.vehicleNode : null };
    },

    collisionPatched: false,
    initCollisionPatch() {
      if (this.collisionPatched || !window.Ao) return;
      this.collisionPatched = true;

      console.log('[Multiplayer] 🛡️ Applying SOLID PHYSICS patch to Ao.prototype.testGround...');
      const originalTestGround = window.Ao.prototype.testGround;
      const ghosts = this.ghosts;

      window.Ao.prototype.testGround = function (x, z, result) {
        let res = originalTestGround.apply(this, arguments);

        // PHYSICAL COLLISIONS: Treat remote cars as solid cylinders
        ghosts.forEach((ghost) => {
          const dx = x - ghost.car.position.x;
          const dz = z - ghost.car.position.z;
          const distSq = dx * dx + dz * dz;

          // Collision radius
          const radius = (ghost.type === 'Coach') ? 4.5 : 2.2;

          if (distSq < radius * radius) {
            const dist = Math.sqrt(distSq);
            // Inject collision data into the engine's result object
            res.w = true; // Wall flag (stops the car)
            res.wd = dist - radius; // Distance to wall
            res.wn = [dx / dist, 0, dz / dist]; // Collision Normal (for bouncing)
            res.wi = 777; // Unique ID for vehicle-to-vehicle hits

            // Visual feedback: brief flash of emission on hit
            if (ghost.car.children[0] && ghost.car.children[0].material) {
              const mat = Array.isArray(ghost.car.children[0].material) ? ghost.car.children[0].material[0] : ghost.car.children[0].material;
              if (mat.emissive) {
                mat.emissive.setHex(0xff0000);
                setTimeout(() => mat.emissive.setHex(0x00aa44), 100);
              }
            }
          }
        });

        return res;
      };
    },

    updateLabelPos(car, label) {
      if (!label) return;
      const camera = this.findCamera();
      if (!camera) { label.style.display = 'none'; return; }
      const vec = car.position.clone();
      vec.y += 2;
      vec.project(camera);
      if (vec.z > 1) { label.style.display = 'none'; return; }
      const x = (vec.x * 0.5 + 0.5) * window.innerWidth;
      const y = (-vec.y * 0.5 + 0.5) * window.innerHeight;
      label.style.display = 'block';
      label.style.transform = `translate(-50%,-100%) translate(${x}px,${y}px)`;
    },

    findCamera() {
      if (!window.gameVehicle || !window.gameVehicle.parent) return null;
      let cam = null;
      window.gameVehicle.parent.traverse(o => { if (o.isCamera) cam = o; });
      return cam;
    },

    clearGhosts() {
      this.ghosts.forEach(g => {
        if (g.car.parent) g.car.parent.remove(g.car);
        if (g.label) g.label.remove();
      });
      this.ghosts.clear();
    }
  };





  // --- EVENT BINDING ---
  function bindEvents() {
    el('btn-singleplayer').onclick = () => { if (validateUsername()) startGame(); };
    el('btn-multiplayer-menu').onclick = () => {
      if (validateUsername()) {
        showScreen('screen-multiplayer');
        ServerScanner.scan();
      }
    };

    // Multiplayer Browser
    el('btn-mp-refresh').onclick = () => ServerScanner.scan();
    el('btn-mp-join-room').onclick = () => showScreen('screen-join');
    el('btn-mp-create-go').onclick = () => {
      if (!validateUsername()) return;
      showScreen('screen-create-settings');
    };
    el('btn-mp-back').onclick = () => showScreen('screen-main');

    // Create Settings
    el('toggle-private').onclick = () => {
      State.config.isPublic = false;
      el('toggle-private').classList.add('active');
      el('toggle-public').classList.remove('active');
    };
    el('toggle-public').onclick = () => {
      State.config.isPublic = true;
      el('toggle-public').classList.add('active');
      el('toggle-private').classList.remove('active');
    };

    el('btn-create-init').onclick = () => {
      const name = el('input-server-name').value.trim().toUpperCase() || 'FAST RACE';
      if (State.config.isPublic) {
        // Pick a random slot SR-PUB-01 to SR-PUB-08
        const slot = 'SR-PUB-0' + (Math.floor(Math.random() * 8) + 1);
        console.log('[P2P] Initializing Public Host on Slot:', slot);
        P2P.initHost(slot, { name, isPublic: true });
        showScreen('screen-lobby');
      } else {
        P2P.initHost(null, { name, isPublic: false });
        el('display-team-code').innerText = State.teamCode;
        showScreen('screen-create');
      }
    };
    el('btn-create-back').onclick = () => showScreen('screen-multiplayer');

    // Create Screen
    el('btn-create-start').onclick = () => {
      const gs = window.gameState;
      const hostNode = gs && gs.vehicleNode ? gs.vehicleNode.i : 0;
      P2P.broadcast({ type: 'game_start', nodeIndex: hostNode });
      startGame();
    };
    el('btn-create-cancel').onclick = () => {
      if (State.peer) State.peer.destroy();
      showScreen('screen-multiplayer');
    };

    // Join Screen
    el('btn-join-confirm').onclick = () => {
      const code = el('input-room-code').value.trim().toUpperCase();
      if (code.length >= 4) P2P.initJoin(code);
      else toastError('ENTER 4-DIGIT CODE OR SERVER ID');
    };
    el('btn-join-cancel').onclick = () => showScreen('screen-multiplayer');

    // Lobby Screen
    el('btn-start-lobby').onclick = () => {
      const gs = window.gameState;
      const hostNode = gs && gs.vehicleNode ? gs.vehicleNode.i : 0;
      P2P.broadcast({ type: 'game_start', nodeIndex: hostNode });
      startGame();
    };
    el('btn-leave-lobby').onclick = () => {
      if (State.peer) State.peer.destroy();
      window.location.reload();
    };
  }




  // --- BOOT ---
  function init() {
    buildHome();
    bindEvents();

    // Stability Loop: Re-bind events and ensure UI exists every 2s
    setInterval(() => {
      const home = el('premium-home');
      if (!home) {
        console.warn('[PremiumUI] UI missing, re-initializing...');
        buildHome();
        bindEvents();
        return;
      }
      const createBtn = el('btn-mp-create-go');
      if (createBtn && !createBtn.onclick) {
        console.warn('[PremiumUI] Events lost, re-binding...');
        bindEvents();
      }
    }, 2000);

    // Load Fonts & Styles
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    const style = document.createElement('style');
    style.innerHTML = `
      .premium-server-browser {
        margin: 15px 0;
        max-height: 180px;
        overflow-y: auto;
        background: rgba(0,0,0,0.3);
        border-radius: 12px;
        padding: 5px;
        border: 1px solid rgba(0,255,136,0.1);
        backdrop-filter: blur(10px);
      }
      .premium-server-browser::-webkit-scrollbar {
        width: 3px;
      }
      .premium-server-browser::-webkit-scrollbar-thumb {
        background: #00ff88;
        border-radius: 10px;
      }
      .premium-server-entry {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 15px;
        margin-bottom: 8px;
        background: rgba(255,255,255,0.02);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border: 1px solid rgba(255,255,255,0.05);
      }
      .premium-server-entry:hover {
        background: rgba(0,255,136,0.05);
        border-color: rgba(0,255,136,0.4);
        transform: scale(1.02);
      }
      .premium-server-entry.online { border-left: 4px solid #00ff88; }
      .premium-server-name { font-family: 'Orbitron', sans-serif; color: #fff; font-size: 13px; font-weight: 900; letter-spacing: 1px; }
      .premium-server-desc { font-size: 10px; color: #aaa; margin-top: 2px; }
      .premium-server-meta { text-align: right; }
      .premium-server-status { font-size: 9px; font-weight: bold; color: #00ff88; letter-spacing: 1px; }
      .premium-server-players { font-size: 11px; color: #fff; opacity: 0.7; font-family: 'Orbitron', sans-serif; }
      .premium-loader-mini { padding: 30px; text-align: center; font-size: 11px; color: #00ff88; letter-spacing: 0.2rem; font-weight: bold; animation: pulse 1.5s infinite; }
      @keyframes pulse { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }
      
      .multi-grid {
         display: grid;
         grid-template-columns: 1fr 1fr;
         gap: 12px;
         width: 100%;
      }
      .premium-code-input-wrapper {
         background: rgba(0,0,0,0.2);
         padding: 25px;
         border-radius: 20px;
         margin-bottom: 25px;
         border: 1px solid rgba(0,255,136,0.2);
         box-shadow: inset 0 0 20px rgba(0,255,136,0.05);
      }
      .premium-code-input-single {
         background: transparent;
         border: none;
         border-bottom: 2px solid #00ff88;
         color: #fff;
         font-family: 'Orbitron', sans-serif;
         font-size: 2.2rem;
         width: 100%;
         text-align: center;
         outline: none;
         letter-spacing: 0.8rem;
         font-weight: 900;
         text-transform: uppercase;
         text-shadow: 0 0 10px rgba(0,255,136,0.5);
      }
      .premium-config-group { text-align: left; width: 100%; }
      .premium-toggle-group {
         display: flex;
         gap: 8px;
         margin-top: 10px;
      }
      .premium-toggle-btn {
         flex: 1;
         background: rgba(255,255,255,0.03);
         border: 1px solid rgba(255,255,255,0.1);
         color: rgba(255,255,255,0.4);
         padding: 12px;
         border-radius: 8px;
         cursor: pointer;
         font-family: 'Orbitron', sans-serif;
         font-size: 10px;
         font-weight: bold;
         transition: all 0.3s;
         letter-spacing: 1px;
      }
      .premium-toggle-btn.active {
         background: rgba(0,255,136,0.1);
         border-color: #00ff88;
         color: #00ff88;
         box-shadow: 0 0 15px rgba(0,255,136,0.2);
      }
      .premium-toggle-btn:hover:not(.active) {
         background: rgba(255,255,255,0.08);
         color: #fff;
      }
    `;
    document.head.appendChild(style);

    Performance.benchmark();

    // Auto-join: check URL params first (set by applyWorldInit redirect), then localStorage
    const urlParams2 = new URLSearchParams(window.location.search);
    const autoJoinCode = urlParams2.get('sr_autojoin') || localStorage.getItem('sr_auto_join');
    if (autoJoinCode) {
      localStorage.removeItem('sr_auto_join');
      console.log('[P2P] Auto-joining team:', autoJoinCode);
      setTimeout(() => P2P.initJoin(autoJoinCode), 1500);
    }

    // Debug Toggle
    window.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'k') {
        const hud = el('premium-debug-hud');
        if (hud) hud.style.display = hud.style.display === 'none' ? 'block' : 'none';
      }
    });

    // Watch for game scene and start sync + update HUD
    setInterval(() => {
      if (window.gameVehicle && window.gameVehicle.parent && !Multiplayer.syncInterval) {
        Multiplayer.startSync();
      }
      // Live HUD updates
      if (el('debug-seed') && window.getGameSeed) el('debug-seed').innerText = window.getGameSeed();
      if (el('debug-node') && window.gameState && window.gameState.vehicleNode) {
        el('debug-node').innerText = window.gameState.vehicleNode.i;
      }
      if (el('debug-ghosts')) el('debug-ghosts').innerText = Multiplayer.ghosts.size;
    }, 1000);
  }

  if (document.readyState === 'complete') init();
  else window.addEventListener('load', init);

})();
