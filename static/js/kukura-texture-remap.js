(function () {
  function makeTexture(seedA, seedB, tone) {
    var canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    var ctx = canvas.getContext('2d');

    var grad = ctx.createLinearGradient(0, 0, 256, 256);
    grad.addColorStop(0, tone[0]);
    grad.addColorStop(1, tone[1]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    for (var y = 0; y < 256; y += 8) {
      for (var x = 0; x < 256; x += 8) {
        var n = Math.sin((x + seedA) * 0.09) + Math.cos((y + seedB) * 0.08);
        var alpha = 0.1 + ((n + 2) / 4) * 0.25;
        ctx.fillStyle = 'rgba(255,255,255,' + alpha.toFixed(3) + ')';
        ctx.fillRect(x, y, 8, 8);
      }
    }

    return canvas.toDataURL('image/png');
  }

  var paletteA = makeTexture(13, 57, ['#182a3a', '#2e7a66']);
  var paletteB = makeTexture(91, 33, ['#3a2022', '#a36b34']);
  var paletteC = makeTexture(44, 11, ['#2b1f46', '#3e8ac2']);

  var remap = {
    'grass_summer_01.d4364fbb.jpg': paletteA,
    'rock_06_bump.4570639b.jpg': paletteB,
    'sea_waves.1123a3ab.jpg': paletteC,
    'crossfade_finest.cddfba27.jpg': paletteA,
    'crossfade_fine.35c9d77b.jpg': paletteC,
    'mars_surface.9d8c755e.jpg': paletteB,
    'mars_surface_bump.6ea0ca20.jpg': paletteC
  };

  var descriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
  if (!descriptor || !descriptor.set || !descriptor.get) return;

  Object.defineProperty(HTMLImageElement.prototype, 'src', {
    configurable: true,
    enumerable: descriptor.enumerable,
    get: function () {
      return descriptor.get.call(this);
    },
    set: function (value) {
      var next = value;
      if (typeof value === 'string') {
        for (var key in remap) {
          if (value.indexOf(key) !== -1) {
            next = remap[key];
            break;
          }
        }
      }
      return descriptor.set.call(this, next);
    }
  });

  var style = document.createElement('style');
  style.textContent = 'canvas{filter:hue-rotate(165deg) saturate(1.35) contrast(1.15) brightness(0.95) !important;}';
  document.head.appendChild(style);
})();
