(function () {
  var playerId = 'p-' + Math.random().toString(36).slice(2, 8);
  var channel = null;
  var teamCode = '';
  var peers = {};

  function randomCode() {
    return Math.random().toString(36).slice(2, 6).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
  }

  function setStatus(text) {
    var el = document.getElementById('kk-status');
    if (el) el.textContent = text;
  }

  function renderPeers() {
    var el = document.getElementById('kk-peers');
    if (!el) return;
    var ids = Object.keys(peers);
    el.innerHTML = ids.length
      ? ids.map(function (id) { return '<div>• teammate ' + id + '</div>'; }).join('')
      : '<div>no teammates yet</div>';
  }

  function send(type, data) {
    if (!channel) return;
    channel.postMessage({ type: type, code: teamCode, from: playerId, data: data || {} });
  }

  function joinTeam(code) {
    if (!('BroadcastChannel' in window)) {
      setStatus('multiplayer not supported in this browser');
      return;
    }

    if (channel) channel.close();
    teamCode = code;
    peers = {};
    renderPeers();

    channel = new BroadcastChannel('kukura-team-' + code);
    channel.onmessage = function (event) {
      var msg = event.data || {};
      if (!msg || msg.code !== teamCode || msg.from === playerId) return;
      if (msg.type === 'hello') {
        send('ack');
      } else if (msg.type === 'ack') {
        peers[msg.from] = true;
        renderPeers();
      }
    };

    send('hello');
    setStatus('joined team ' + code);
    var tag = document.getElementById('kk-team');
    if (tag) tag.textContent = code;
  }

  function startGame() {
    var begin = document.querySelector('#splash-container button, #splash-container .splash-reload');
    if (begin) begin.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    setStatus('starting drive...');
  }

  function mount() {
    if (document.getElementById('kukura-homescreen')) return true;

    var style = document.createElement('style');
    style.id = 'kukura-homescreen-style';
    style.textContent = '' +
      '#kukura-homescreen{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;pointer-events:none}' +
      '#kukura-homescreen .bg{position:absolute;inset:0;background:radial-gradient(circle at 20% 20%,#5f3dc4 0%,transparent 40%),radial-gradient(circle at 80% 30%,#1c7ed6 0%,transparent 35%),radial-gradient(circle at 50% 80%,#099268 0%,transparent 40%),linear-gradient(125deg,#0b1020,#140d1f 55%,#0f172a);filter:saturate(1.25);animation:kkMove 18s ease-in-out infinite alternate;opacity:.92}' +
      '@keyframes kkMove{0%{transform:scale(1) translate(0,0)}100%{transform:scale(1.08) translate(-2%,1%)}}' +
      '#kukura-homescreen .card{position:relative;pointer-events:auto;width:min(92vw,520px);padding:22px;border-radius:18px;background:rgba(6,8,14,.72);border:1px solid rgba(167,199,255,.34);box-shadow:0 20px 40px rgba(0,0,0,.45);color:#eef7ff;font:14px/1.4 Inter,system-ui,sans-serif;backdrop-filter:blur(10px)}' +
      '#kukura-homescreen h1{margin:0;font-size:40px;letter-spacing:4px;text-align:center}' +
      '#kukura-homescreen .subtitle{margin:2px 0 14px;text-align:center;opacity:.86;font-size:14px;letter-spacing:2px;text-transform:uppercase}' +
      '#kukura-homescreen .row{display:flex;gap:8px;margin-top:8px}' +
      '#kukura-homescreen input{flex:1;padding:10px;border-radius:10px;border:1px solid rgba(167,199,255,.4);background:rgba(255,255,255,.08);color:#fff}' +
      '#kukura-homescreen button{padding:10px 12px;border:0;border-radius:10px;cursor:pointer;font-weight:700}' +
      '#kk-start{width:100%;background:#20c997;color:#04260f}' +
      '#kk-create{background:#4c6ef5;color:#fff}#kk-join,#kk-leave{background:#253047;color:#e5edff}' +
      '#kukura-homescreen .meta{margin-top:10px;display:flex;justify-content:space-between;font-size:12px;opacity:.9}' +
      '#kk-peers{margin-top:8px;font-size:12px;opacity:.82;min-height:18px}';
    document.head.appendChild(style);

    var wrap = document.createElement('div');
    wrap.id = 'kukura-homescreen';
    wrap.innerHTML = '' +
      '<div class="bg"></div>' +
      '<div class="card">' +
      '<h1>KUKURA</h1>' +
      '<div class="subtitle">multiplayer horizon</div>' +
      '<button id="kk-start">Start Drive</button>' +
      '<div class="row"><input id="kk-code" placeholder="TEAM-CODE"><button id="kk-create">Create</button><button id="kk-join">Join</button><button id="kk-leave">Leave</button></div>' +
      '<div class="meta"><span>team: <b id="kk-team">SOLO</b></span><span id="kk-status">ready</span></div>' +
      '<div id="kk-peers"></div>' +
      '</div>';
    document.body.appendChild(wrap);

    document.getElementById('kk-start').addEventListener('click', startGame);
    document.getElementById('kk-create').addEventListener('click', function () {
      var c = randomCode();
      document.getElementById('kk-code').value = c;
      joinTeam(c);
    });
    document.getElementById('kk-join').addEventListener('click', function () {
      var c = (document.getElementById('kk-code').value || '').trim().toUpperCase();
      if (!c) return setStatus('enter team code');
      joinTeam(c);
    });
    document.getElementById('kk-leave').addEventListener('click', function () {
      if (channel) channel.close();
      channel = null;
      peers = {};
      teamCode = '';
      document.getElementById('kk-team').textContent = 'SOLO';
      setStatus('left team');
      renderPeers();
    });

    renderPeers();
    return true;
  }

  var tries = 0;
  var timer = setInterval(function () {
    tries += 1;
    if (mount() || tries > 25) clearInterval(timer);
  }, 250);
})();
