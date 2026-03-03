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
    if (localStorage.getItem(key) == null) {
      localStorage.setItem(key, remixDefaults[key]);
    }
  });

  var attempts = 0;
  var maxAttempts = 30;
  var intervalId = null;

  function applyBrandingOnce() {
    var changed = false;
    var title = document.querySelector('#splash-header');
    var sub = document.querySelector('#splash-subheader');

    if (title && title.textContent !== 'kukura') {
      title.textContent = 'kukura';
      changed = true;
    }

    if (sub && sub.textContent !== 'endless driving remix') {
      sub.textContent = 'endless driving remix';
      changed = true;
    }

    var aboutLink = document.querySelector('#splash-anslo');
    if (aboutLink && aboutLink.getAttribute('href') !== 'https://kukura.game') {
      aboutLink.setAttribute('href', 'https://kukura.game');
      changed = true;
    }

    attempts += 1;
    if ((title && sub) || attempts >= maxAttempts) {
      clearInterval(intervalId);
    }

    return changed;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      applyBrandingOnce();
      intervalId = setInterval(applyBrandingOnce, 400);
    });
  } else {
    applyBrandingOnce();
    intervalId = setInterval(applyBrandingOnce, 400);
  }
})();
