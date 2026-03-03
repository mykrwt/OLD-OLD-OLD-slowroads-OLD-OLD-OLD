(function () {
  var defaults = {
    'config-scene-topography': 'hard',
    'config-scene-skin': 'spring',
    'config-scene-weather-index': '0',
    'config-camera-mode': '1'
  };

  Object.keys(defaults).forEach(function (key) {
    if (localStorage.getItem(key) == null) {
      localStorage.setItem(key, defaults[key]);
    }
  });

  var playerId = 'p-' + Math.random().toString(36).slice(2, 8);
  var channel = null;
  var teamCode = '';
  var peers = {};
  var localState = { speed: 0, steer: 0, brake: false, ts: 0 };
  var controls = null;

  function ensureStyle() {
    if (document.getElementById('kukura-home-style')) return;
    var style = document.createElement('style');
    style.id = 'kukura-home-style';
    style.textContent = '' +
      '#kukura-home{position:fixed;left:20px;top:20px;z-index:100000;width:340px;background:rgba(0,0,0,.68);color:#fff;border:1px solid rgba(255,255,255,.28);border-radius:12px;padding:12px;font:12px/1.4 system-ui,sans-serif;backdrop-filter:blur(4px)}' +
      '#kukura-home h2{margin:0 0 4px 0;font-size:20px;letter-spacing:.5px}' +
      '#kukura-home .sub{opacity:.85;margin-bottom:8px}' +
      '#kukura-home .row{display:flex;gap:6px;margin:6px 0}' +
      '#kukura-home input{flex:1;border-radius:6px;border:1px solid rgba(255,255,255,.25);background:rgba(12,12,12,.7);color:#fff;padding:7px}' +
      '#kukura-home button{border:0;border-radius:6px;background:#3974ff;color:#fff;padding:7px 9px;cursor:pointer}' +
      '#kukura-home .status{margin-top:6px;color:#9fd0ff}' +
      '#kukura-home .peerlist{margin-top:6px;max-height:120px;overflow:auto;opacity:.92}' +
      '#kukura-home .hint{opacity:.68;font-size:11px;margin-top:6px}' +
      '#kukura-home .solo{background:#00a36f}' +
      '#kukura-home .danger{background:#9d2f45}' +
      '#splash-footer,#splash-about,#splash-anslo{display:none !important}';
    document.head.appendChild(style);
  }

  function randomCode() {
    return Math.random().toString(36).slice(2, 6).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
  }

  function setStatus(text) {
    if (controls && controls.status) controls.status.textContent = text;
  }

  function renderPeers() {
    if (!controls || !controls.peerlist) return;
    var ids = Object.keys(peers);
    if (!ids.length) {
      controls.peerlist.textContent = 'No teammates connected yet.';
      return;
    }
    controls.peerlist.innerHTML = ids.map(function (id) {
      var st = peers[id];
      return '<div>• ' + id + ' | speed ' + st.speed.toFixed(1) + ' | steer ' + st.steer.toFixed(1) + (st.brake ? ' | brake' : '') + '</div>';
    }).join('');
  }

  function send(type, data) {
    if (!channel) return;
    channel.postMessage({ type: type, from: playerId, code: teamCode, data: data || {} });
  }

  function bindChannel(code) {
    if (!('BroadcastChannel' in window)) {
      setStatus('Multiplayer unavailable in this browser.');
      return;
    }
    if (channel) channel.close();
    peers = {};
    renderPeers();

    teamCode = code;
    channel = new BroadcastChannel('kukura-team-' + teamCode);
    channel.onmessage = function (event) {
      var msg = event.data || {};
      if (!msg || msg.from === playerId || msg.code !== teamCode) return;

      if (msg.type === 'hello') {
        send('ack', { state: localState });
        setStatus('Teammate joined: ' + msg.from);
      }
      if (msg.type === 'ack') {
        setStatus('Connected to team ' + teamCode);
      }
      if (msg.type === 'state') {
        peers[msg.from] = msg.data || {};
        renderPeers();
      }
    };

    send('hello', { state: localState });
    setStatus('Joined team ' + teamCode + '. Share this code.');
  }

  function startSolo() {
    var beginButton = document.querySelector('#splash-container button, #splash-container .splash-reload');
    if (beginButton) beginButton.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    setStatus('Solo mode: drive with arrow keys.');
  }

  function installHome() {
    ensureStyle();

    var splashHeader = document.querySelector('#splash-header');
    var splashSub = document.querySelector('#splash-subheader');
    if (splashHeader) splashHeader.textContent = 'kukura';
    if (splashSub) splashSub.textContent = 'remix edition';

    if (document.getElementById('kukura-home')) return;
    var box = document.createElement('div');
    box.id = 'kukura-home';
    box.innerHTML = '' +
      '<h2>KUKURA</h2>' +
      '<div class="sub">Simple team-code multiplayer</div>' +
      '<div class="row"><input id="km-code" placeholder="TEAM-CODE" /></div>' +
      '<div class="row"><button id="km-create">Create Team</button><button id="km-join">Join Team</button></div>' +
      '<div class="row"><button class="solo" id="km-solo">Start Solo</button><button class="danger" id="km-leave">Leave</button></div>' +
      '<div class="status" id="km-status">Ready. Create or join a team.</div>' +
      '<div class="peerlist" id="km-peerlist">No teammates connected yet.</div>' +
      '<div class="hint">Works across tabs/windows on this browser profile. Use same team code.</div>';

    document.body.appendChild(box);

    controls = {
      code: box.querySelector('#km-code'),
      status: box.querySelector('#km-status'),
      peerlist: box.querySelector('#km-peerlist')
    };

    box.querySelector('#km-create').addEventListener('click', function () {
      var code = randomCode();
      controls.code.value = code;
      bindChannel(code);
    });

    box.querySelector('#km-join').addEventListener('click', function () {
      var code = (controls.code.value || '').trim().toUpperCase();
      if (!code) {
        setStatus('Enter a team code first.');
        return;
      }
      bindChannel(code);
    });

    box.querySelector('#km-leave').addEventListener('click', function () {
      if (channel) {
        channel.close();
        channel = null;
      }
      teamCode = '';
      peers = {};
      renderPeers();
      setStatus('Left team.');
    });

    box.querySelector('#km-solo').addEventListener('click', startSolo);
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowUp') localState.speed = Math.min(1, localState.speed + 0.1);
    if (event.key === 'ArrowDown') localState.speed = Math.max(0, localState.speed - 0.1);
    if (event.key === 'ArrowLeft') localState.steer = Math.max(-1, localState.steer - 0.1);
    if (event.key === 'ArrowRight') localState.steer = Math.min(1, localState.steer + 0.1);
    if (event.key === ' ') localState.brake = true;
  });

  document.addEventListener('keyup', function (event) {
    if (event.key === ' ') localState.brake = false;
  });

  setInterval(function () {
    localState.ts = Date.now();
    send('state', localState);
  }, 350);

  var tries = 0;
  var wait = setInterval(function () {
    installHome();
    tries += 1;
    if (document.getElementById('kukura-home') || tries > 30) clearInterval(wait);
  }, 300);
})();
