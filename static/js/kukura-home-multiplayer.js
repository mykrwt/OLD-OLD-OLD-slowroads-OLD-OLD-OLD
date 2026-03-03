(function () {
  var defaults = {
    'config-scene-topography': 'hard',
    'config-scene-skin': 'spring',
    'config-scene-weather-index': '0',
    'config-camera-mode': '1'
  };

  Object.keys(defaults).forEach(function (key) {
    if (localStorage.getItem(key) == null) localStorage.setItem(key, defaults[key]);
  });

  var channel = null;
  var playerId = 'p-' + Math.random().toString(36).slice(2, 8);
  var teamCode = '';
  var peers = {};
  var controls = null;
  var localState = { speed: 0, steer: 0, brake: false, ts: 0 };

  function style() {
    if (document.getElementById('kukura-ui-style')) return;
    var s = document.createElement('style');
    s.id = 'kukura-ui-style';
    s.textContent = '' +
      '#kukura-home{position:fixed;left:50%;top:24px;transform:translateX(-50%);z-index:100000;width:min(92vw,560px);background:rgba(8,10,14,.82);color:#f7fbff;border:1px solid rgba(154,199,255,.32);border-radius:16px;padding:16px 16px 14px;font:13px/1.35 Inter,system-ui,sans-serif;box-shadow:0 14px 34px rgba(0,0,0,.45);backdrop-filter:blur(8px)}' +
      '#kukura-home h1{margin:0;font-size:24px;letter-spacing:1px}' +
      '#kukura-home .sub{opacity:.82;margin:2px 0 12px}' +
      '#kukura-home .grid{display:grid;grid-template-columns:1fr auto auto;gap:8px}' +
      '#kukura-home input{border:1px solid rgba(167,214,255,.35);border-radius:10px;background:rgba(255,255,255,.06);color:#fff;padding:10px}' +
      '#kukura-home button{border:0;border-radius:10px;padding:10px 12px;cursor:pointer;font-weight:600}' +
      '#kukura-home .btn-primary{background:#4f7cff;color:white}' +
      '#kukura-home .btn-secondary{background:#2b3444;color:#e2eeff}' +
      '#kukura-home .meta{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap}' +
      '#kukura-home .chip{padding:6px 9px;border-radius:999px;background:rgba(154,199,255,.12);border:1px solid rgba(154,199,255,.25);font-size:11px}' +
      '#kukura-home .peers{margin-top:8px;max-height:112px;overflow:auto;opacity:.9}' +
      '#kukura-home .status{margin-top:8px;color:#9fddff}' +
      '@media (max-width:640px){#kukura-home .grid{grid-template-columns:1fr 1fr}#kukura-home input{grid-column:1/-1}}';
    document.head.appendChild(s);
  }

  function setStatus(t) { if (controls) controls.status.textContent = t; }

  function renderPeers() {
    if (!controls) return;
    var ids = Object.keys(peers);
    controls.peers.innerHTML = ids.length
      ? ids.map(function (id) {
          var st = peers[id];
          return '<div>• '+id+'  speed:'+st.speed.toFixed(1)+' steer:'+st.steer.toFixed(1)+(st.brake?' brake':'')+'</div>';
        }).join('')
      : 'No teammates yet. Open another tab and join the same code.';
  }

  function send(type, data) {
    if (!channel) return;
    channel.postMessage({ type:type, from:playerId, code:teamCode, data:data||{} });
  }

  function joinCode(code) {
    if (!('BroadcastChannel' in window)) return setStatus('BroadcastChannel unsupported in this browser.');
    if (channel) channel.close();
    peers = {};
    renderPeers();

    teamCode = code;
    channel = new BroadcastChannel('kukura-team-' + code);
    channel.onmessage = function (event) {
      var msg = event.data || {};
      if (!msg || msg.code !== teamCode || msg.from === playerId) return;
      if (msg.type === 'hello') {
        send('ack', { state: localState });
      } else if (msg.type === 'ack') {
        setStatus('Connected on team ' + teamCode);
      } else if (msg.type === 'state') {
        peers[msg.from] = msg.data || {};
        renderPeers();
      }
    };
    send('hello', { state: localState });
    setStatus('Joined team ' + code + '. Share this code.');
    if (controls) controls.team.textContent = 'Team ' + code;
  }

  function createCode() {
    return Math.random().toString(36).slice(2, 6).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
  }

  function mount() {
    style();
    var header = document.querySelector('#splash-header');
    var sub = document.querySelector('#splash-subheader');
    if (header) header.textContent = 'kukura';
    if (sub) sub.textContent = 'new horizon remix';

    if (document.getElementById('kukura-home')) return true;
    var el = document.createElement('div');
    el.id = 'kukura-home';
    el.innerHTML = '' +
      '<h1>KUKURA</h1>' +
      '<div class="sub">Clean home + simple team-code multiplayer</div>' +
      '<div class="grid"><input id="k-code" placeholder="TEAM-CODE (e.g. AB12-CD34)"><button class="btn-primary" id="k-create">Create</button><button class="btn-secondary" id="k-join">Join</button></div>' +
      '<div class="meta"><span class="chip" id="k-team">Solo</span><button class="btn-secondary" id="k-start">Start drive</button><button class="btn-secondary" id="k-leave">Leave team</button></div>' +
      '<div class="status" id="k-status">Ready.</div>' +
      '<div class="peers" id="k-peers"></div>';
    document.body.appendChild(el);

    controls = {
      input: el.querySelector('#k-code'),
      team: el.querySelector('#k-team'),
      status: el.querySelector('#k-status'),
      peers: el.querySelector('#k-peers')
    };
    renderPeers();

    el.querySelector('#k-create').addEventListener('click', function () {
      var c = createCode();
      controls.input.value = c;
      joinCode(c);
    });
    el.querySelector('#k-join').addEventListener('click', function () {
      var c = (controls.input.value || '').trim().toUpperCase();
      if (!c) return setStatus('Enter a team code first.');
      joinCode(c);
    });
    el.querySelector('#k-leave').addEventListener('click', function () {
      if (channel) channel.close();
      channel = null;
      teamCode = '';
      peers = {};
      controls.team.textContent = 'Solo';
      setStatus('Left team.');
      renderPeers();
    });
    el.querySelector('#k-start').addEventListener('click', function () {
      var begin = document.querySelector('#splash-container button, #splash-container .splash-reload');
      if (begin) begin.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      setStatus('Driving. Arrow keys to control.');
    });
    return true;
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowUp') localState.speed = Math.min(1, localState.speed + 0.1);
    if (e.key === 'ArrowDown') localState.speed = Math.max(0, localState.speed - 0.1);
    if (e.key === 'ArrowLeft') localState.steer = Math.max(-1, localState.steer - 0.1);
    if (e.key === 'ArrowRight') localState.steer = Math.min(1, localState.steer + 0.1);
    if (e.key === ' ') localState.brake = true;
  });
  document.addEventListener('keyup', function (e) { if (e.key === ' ') localState.brake = false; });

  setInterval(function () {
    localState.ts = Date.now();
    send('state', localState);
  }, 350);

  var tries = 0;
  var timer = setInterval(function () {
    tries += 1;
    if (mount() || tries > 35) clearInterval(timer);
  }, 250);
})();
