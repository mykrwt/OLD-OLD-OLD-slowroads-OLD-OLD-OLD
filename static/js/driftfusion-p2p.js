/**
 * DRIFTFUSION P2P Networking
 * Bulletproof WebRTC that doesn't disconnect on minimize
 */
(function() {
  'use strict';

  const ICE_SERVERS = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' }
  ];

  const CONFIG = {
    iceServers: ICE_SERVERS,
    iceCandidatePoolSize: 10
  };

  class P2PNetwork {
    constructor() {
      this.peers = new Map();
      this.dataChannels = new Map();
      this.localId = this.generateId();
      this.isHost = false;
      this.localSDP = null;
      this.keepAliveTimers = new Map();
      this.reconnectAttempts = new Map();
      
      // Handle visibility changes
      this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
      
      // Start sync loop
      this.startSyncLoop();
      
      console.log('🌐 P2P Network ready, ID:', this.localId);
      window.dfUpdateStatus?.('initialized');
    }

    generateId() {
      return Math.random().toString(36).substring(2, 10).toUpperCase();
    }

    handleVisibilityChange() {
      const isHidden = document.hidden;
      console.log('Visibility:', isHidden ? 'hidden' : 'visible');
      
      this.peers.forEach((pc, peerId) => {
        if (isHidden) {
          // Slow down keep-alive when hidden
          this.setKeepAliveInterval(peerId, 5000);
        } else {
          // Resume normal keep-alive
          this.setKeepAliveInterval(peerId, 3000);
          this.sendPing(peerId);
        }
      });
    }

    createPeerConnection(peerId) {
      console.log('Creating peer connection for', peerId);
      
      const pc = new RTCPeerConnection(CONFIG);
      
      pc.onicecandidate = (e) => {
        if (!e.candidate) {
          this.generateLocalSDP(pc);
        }
      };

      pc.onconnectionstatechange = () => {
        console.log('Connection state:', pc.connectionState);
        this.handleConnectionStateChange(peerId, pc.connectionState);
      };

      pc.oniceconnectionstatechange = () => {
        if (pc.iceConnectionState === 'failed') {
          pc.restartIce();
        }
      };

      pc.ondatachannel = (e) => {
        this.attachDataChannel(peerId, e.channel);
      };

      this.peers.set(peerId, pc);
      return pc;
    }

    generateLocalSDP(pc) {
      if (pc.localDescription) {
        this.localSDP = JSON.stringify(pc.localDescription);
        window.dfSetLocalSDP?.(this.localSDP);
      }
    }

    attachDataChannel(peerId, channel) {
      channel.binaryType = 'arraybuffer';
      
      channel.onopen = () => {
        console.log('Data channel opened for', peerId);
        this.dataChannels.set(peerId, channel);
        this.startKeepAlive(peerId);
        window.dfUpdateStatus?.('connected', this.getPeerCount());
        window.dfUpdatePlayers?.(this.getPeers());
        window.dfShowToast?.('Player connected!', 'success');
      };

      channel.onclose = () => {
        console.log('Data channel closed for', peerId);
        this.handleDisconnect(peerId);
      };

      channel.onmessage = (e) => {
        this.handleMessage(peerId, e.data);
      };
    }

    handleMessage(peerId, data) {
      try {
        const msg = JSON.parse(data);
        
        if (msg.type === 'ping') {
          this.sendToPeer(peerId, { type: 'pong', timestamp: msg.timestamp });
        } else if (msg.type === 'pong') {
          const latency = Date.now() - msg.timestamp;
          // Could update latency display here
        } else if (msg.type === 'gameState') {
          // Forward to game
          window.dfHandleRemoteState?.(peerId, msg.data);
        }
      } catch (err) {
        // Binary data or invalid JSON
      }
    }

    startKeepAlive(peerId) {
      this.setKeepAliveInterval(peerId, 3000);
    }

    setKeepAliveInterval(peerId, interval) {
      this.stopKeepAlive(peerId);
      const timer = setInterval(() => this.sendPing(peerId), interval);
      this.keepAliveTimers.set(peerId, timer);
    }

    stopKeepAlive(peerId) {
      const timer = this.keepAliveTimers.get(peerId);
      if (timer) {
        clearInterval(timer);
        this.keepAliveTimers.delete(peerId);
      }
    }

    sendPing(peerId) {
      this.sendToPeer(peerId, { type: 'ping', timestamp: Date.now() });
    }

    sendToPeer(peerId, data) {
      const channel = this.dataChannels.get(peerId);
      if (channel && channel.readyState === 'open') {
        channel.send(JSON.stringify(data));
        return true;
      }
      return false;
    }

    broadcast(data) {
      const msg = JSON.stringify(data);
      this.dataChannels.forEach((channel) => {
        if (channel.readyState === 'open') {
          channel.send(msg);
        }
      });
    }

    handleConnectionStateChange(peerId, state) {
      if (state === 'disconnected' || state === 'failed' || state === 'closed') {
        this.attemptReconnect(peerId);
      }
    }

    attemptReconnect(peerId) {
      const attempts = this.reconnectAttempts.get(peerId) || 0;
      if (attempts >= 5) {
        this.handleDisconnect(peerId);
        return;
      }
      
      this.reconnectAttempts.set(peerId, attempts + 1);
      const delay = Math.min(2000 * Math.pow(2, attempts), 30000);
      
      console.log(`Reconnecting to ${peerId} in ${delay}ms (attempt ${attempts + 1})`);
      
      setTimeout(() => {
        if (this.isHost) {
          this.reconnectPeer(peerId);
        }
      }, delay);
    }

    reconnectPeer(peerId) {
      this.cleanupPeer(peerId);
      
      const pc = this.createPeerConnection(peerId);
      const channel = pc.createDataChannel('df-state', {
        ordered: true,
        maxRetransmits: 3
      });
      this.attachDataChannel(peerId, channel);
      
      pc.createOffer().then(offer => {
        pc.setLocalDescription(offer);
      });
    }

    handleDisconnect(peerId) {
      this.stopKeepAlive(peerId);
      this.cleanupPeer(peerId);
      window.dfUpdateStatus?.('disconnected', this.getPeerCount());
      window.dfUpdatePlayers?.(this.getPeers());
      window.dfShowToast?.('Player disconnected', 'error');
    }

    cleanupPeer(peerId) {
      const pc = this.peers.get(peerId);
      if (pc) {
        pc.close();
        this.peers.delete(peerId);
      }
      
      const channel = this.dataChannels.get(peerId);
      if (channel) {
        channel.close();
        this.dataChannels.delete(peerId);
      }
    }

    async hostGame() {
      console.log('Hosting game...');
      this.isHost = true;
      
      const peerId = 'guest-' + this.generateId();
      const pc = this.createPeerConnection(peerId);
      
      const channel = pc.createDataChannel('df-state', {
        ordered: true,
        maxRetransmits: 3
      });
      this.attachDataChannel(peerId, channel);
      
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      
      window.dfUpdateStatus?.('hosting');
      window.dfShowToast?.('Host code generated! Share it.');
    }

    async joinGame() {
      const remoteSDP = document.getElementById('df-remote-sdp')?.value;
      
      if (!remoteSDP?.trim()) {
        window.dfShowToast?.('Please paste a connection code', 'error');
        return;
      }
      
      console.log('Joining game...');
      this.isHost = false;
      
      let remoteDesc;
      try {
        remoteDesc = JSON.parse(remoteSDP);
      } catch (err) {
        window.dfShowToast?.('Invalid connection code', 'error');
        return;
      }
      
      const peerId = 'host-' + this.generateId();
      const pc = this.createPeerConnection(peerId);
      
      await pc.setRemoteDescription(new RTCSessionDescription(remoteDesc));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      
      window.dfUpdateStatus?.('connecting');
      window.dfShowToast?.('Connecting...');
    }

    disconnect() {
      this.peers.forEach((pc, peerId) => {
        this.cleanupPeer(peerId);
      });
      this.dataChannels.clear();
      this.localSDP = null;
      window.dfSetLocalSDP?.('');
      window.dfUpdateStatus?.('disconnected');
      window.dfUpdatePlayers?.([]);
    }

    getPeers() {
      const peers = [];
      this.dataChannels.forEach((channel, peerId) => {
        if (channel.readyState === 'open') {
          peers.push({ id: peerId, state: 'connected' });
        }
      });
      return peers;
    }

    getPeerCount() {
      return this.dataChannels.size;
    }

    startSyncLoop() {
      const loop = () => {
        this.broadcastGameState();
        setTimeout(loop, 50); // 20Hz
      };
      loop();
    }

    broadcastGameState() {
      // Get state from original game if available
      const gameState = window.dfGetGameState?.();
      if (gameState) {
        this.broadcast({
          type: 'gameState',
          timestamp: Date.now(),
          data: gameState
        });
      }
    }
  }

  // Initialize
  const network = new P2PNetwork();
  
  // Override UI functions
  window.dfHost = () => network.hostGame();
  window.dfJoin = () => network.joinGame();
  window.dfDisconnect = () => network.disconnect();
  window.dfBroadcast = (data) => network.broadcast(data);
  window.dfNetwork = network;
  
  console.log('🎮 DRIFTFUSION P2P loaded');
})();
