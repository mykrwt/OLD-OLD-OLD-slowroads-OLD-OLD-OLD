(function () {
  var remixDefaults = {
    'config-scene-topography': 'hard',
    'config-scene-skin': 'spring',
    'config-scene-weather-index': '0',
    'config-camera-mode': '1',
    'config-view-lod-index': '2',
    'config-detail-lod-index': '1'
  };

  Object.keys(remixDefaults).forEach(function (key) {
    localStorage.setItem(key, remixDefaults[key]);
  });

  function applyBranding() {
    var title = document.querySelector('#splash-header');
    var sub = document.querySelector('#splash-subheader');
    if (title) title.textContent = 'kukura';
    if (sub) sub.textContent = 'endless driving remix';

    document.querySelectorAll('a').forEach(function (link) {
      var href = link.getAttribute('href') || '';
      if (href.indexOf('slowroads') >= 0 || href.indexOf('anslo') >= 0) {
        link.setAttribute('href', 'https://kukura.game');
      }
    });

    document.querySelectorAll('div,span,p,strong,h1,h2,h3').forEach(function (node) {
      if (!node.childNodes || node.childNodes.length !== 1 || node.childNodes[0].nodeType !== Node.TEXT_NODE) return;
      var txt = node.textContent;
      if (!txt) return;
      node.textContent = txt
        .replace(/slow roads/gi, 'kukura')
        .replace(/anslo\.dev/gi, 'kukura.game')
        .replace(/anslo/gi, 'kukura labs');
    });
  }

  var observer = new MutationObserver(applyBranding);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyBranding);
  } else {
    applyBranding();
  }
})();
