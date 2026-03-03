(function () {
  var panel = document.createElement('div');
  panel.id = 'kukura-multiplayer';
  panel.innerHTML = '\
    <div class="km-header">kukura · peer-to-peer multiplayer</div>\
    <div class="km-row">\
      <button data-action="host">Host</button>\
      <button data-action="join">Join</button>\
      <button data-action="copy">Copy local SDP</button>\
    </div>\
    <textarea class="km-sdp km-local" readonly placeholder="Local SDP appears here"></textarea>\
    <textarea class="km-sdp km-remote" placeholder="Paste remote SDP here"></textarea>\
    <div class="km-row">\
      <button data-action="apply">Apply remote SDP</button>\
      <button data-action="send" disabled>Send status</button>\
    </div>\
    <div class="km-status">Not connected</div>\
    <div class="km-hint">Tip: both players keep this page open. Share SDP text out-of-band once to connect.</div>\
  ';

  var style = document.createElement('style');
  style.textContent = '\
    #kukura-multiplayer { position: fixed; right: 16px; bottom: 16px; z-index: 99999; width: 320px; background: rgba(0,0,0,0.7); color: #fff; border: 1px solid rgba(255,255,255,0.3); border-radius: 10px; padding: 12px; font: 12px/1.4 system-ui,-apple-system,sans-serif; backdrop-filter: blur(3px); }\
    #kukura-multiplayer .km-header { font-weight: 700; margin-bottom: 8px; text-transform: lowercase; }\
    #kukura-multiplayer .km-row { display: flex; gap: 6px; margin-bottom: 8px; }\
    #kukura-multiplayer button { flex: 1; border: none; border-radius: 6px; background: #3c71ff; color: #fff; padding: 6px; cursor: pointer; }\
    #kukura-multiplayer button[disabled] { opacity: 0.5; cursor: not-allowed; }\
    #kukura-multiplayer .km-sdp { width: 100%; height: 70px; margin-bottom: 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: rgba(10,10,10,0.7); color: #fff; padding: 6px; resize: vertical; }\
    #kukura-multiplayer .km-status { margin-bottom: 6px; color: #9ad0ff; }\
    #kukura-multiplayer .km-hint { opacity: 0.75; font-size: 11px; }\
  ';

  document.head.appendChild(style);
  document.body.appendChild(panel);

  var pc = null;
  var dc = null;
  var state = { speed: 0, steering: 0, brake: false, timestamp: 0 };
  var localBox = panel.querySelector('.km-local');
  var remoteBox = panel.querySelector('.km-remote');
  var statusBox = panel.querySelector('.km-status');
  var sendBtn = panel.querySelector('[data-action="send"]');

  function setStatus(message) {
    statusBox.textContent = message;
  }

  function updateLocalDescription() {
    if (pc && pc.localDescription) {
      localBox.value = JSON.stringify(pc.localDescription);
    }
  }

  function ensureConnection() {
    if (pc) return;
    pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    pc.onicecandidate = function (event) {
      if (!event.candidate) {
        updateLocalDescription();
      }
    };

    pc.onconnectionstatechange = function () {
      setStatus('Connection: ' + pc.connectionState);
      sendBtn.disabled = !(dc && dc.readyState === 'open');
    };

    pc.ondatachannel = function (event) {
      attachDataChannel(event.channel);
    };
  }

  function attachDataChannel(channel) {
    dc = channel;
    dc.onopen = function () {
      setStatus('Connected to peer');
      sendBtn.disabled = false;
    };
    dc.onclose = function () {
      setStatus('Peer channel closed');
      sendBtn.disabled = true;
    };
    dc.onmessage = function (event) {
      try {
        var payload = JSON.parse(event.data);
        if (payload.type === 'status') {
          setStatus('Peer speed: ' + payload.state.speed + ' | steering: ' + payload.state.steering);
        }
      } catch (err) {
        setStatus('Received: ' + event.data);
      }
    };
  }

  async function hostGame() {
    ensureConnection();
    attachDataChannel(pc.createDataChannel('kukura-state'));
    var offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    setStatus('Offer created. Share local SDP.');
  }

  async function joinGame() {
    ensureConnection();
    setStatus('Join mode enabled. Paste host SDP, then apply.');
  }

  async function applyRemote() {
    ensureConnection();
    if (!remoteBox.value.trim()) {
      setStatus('Please paste remote SDP first');
      return;
    }

    var desc;
    try {
      desc = JSON.parse(remoteBox.value);
    } catch (err) {
      setStatus('Remote SDP is not valid JSON');
      return;
    }

    await pc.setRemoteDescription(desc);

    if (desc.type === 'offer') {
      var answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      setStatus('Answer created. Share local SDP back.');
    } else {
      setStatus('Remote answer applied. Waiting for connection...');
    }
  }

  function copyLocal() {
    if (!localBox.value) {
      setStatus('No local SDP to copy yet');
      return;
    }
    navigator.clipboard.writeText(localBox.value).then(function () {
      setStatus('Local SDP copied');
    }).catch(function () {
      setStatus('Could not access clipboard; copy manually');
    });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowUp') state.speed = Math.min(1, state.speed + 0.1);
    if (event.key === 'ArrowDown') state.speed = Math.max(0, state.speed - 0.1);
    if (event.key === 'ArrowLeft') state.steering = Math.max(-1, state.steering - 0.1);
    if (event.key === 'ArrowRight') state.steering = Math.min(1, state.steering + 0.1);
    if (event.key === ' ') state.brake = true;
  });

  document.addEventListener('keyup', function (event) {
    if (event.key === ' ') state.brake = false;
  });

  function sendStatus() {
    if (!dc || dc.readyState !== 'open') {
      setStatus('No open peer channel');
      return;
    }
    state.timestamp = Date.now();
    dc.send(JSON.stringify({ type: 'status', state: state }));
    setStatus('Sent local status to peer');
  }

  panel.addEventListener('click', function (event) {
    var action = event.target && event.target.getAttribute('data-action');
    if (!action) return;

    if (action === 'host') hostGame().catch(function (err) { setStatus(err.message); });
    if (action === 'join') joinGame().catch(function (err) { setStatus(err.message); });
    if (action === 'apply') applyRemote().catch(function (err) { setStatus(err.message); });
    if (action === 'copy') copyLocal();
    if (action === 'send') sendStatus();
  });
})();
